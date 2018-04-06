import esl = require('esl');
import events = require('events');
import util = require('util');

function normalize_phone_number( phone_number: string ) {
    let phone = (phone_number[0] === '+' ? phone_number.slice(1) : phone_number);
    phone = phone[0] === '1' ? phone.slice(1) : phone;
    return phone;
}

export class ConfCall {
    dn: string;
    name: string;
    pin: string;
    caller_id: string;
    uuid: string;
    url:string;
}

export module FreeSWITCH {
    class ESLClient extends events.EventEmitter {
        private port: number;
        private host: string;
        private pwd: string;

        private fs_client: any;
        private fs_socket: any;

        private connected: boolean;

        constructor(host: string, port:number, pwd:string) {
            super();

            this.host = host;
            this.port = port;
            this.pwd = pwd;

            this.connected = false;
        }

        private event_list = 'HEARTBEAT RE_SCHEDULE API CHANNEL_STATE CALL_UPDATE CHANNEL_CALLSTATE'.split(' ');
        private setup_event_listeners(client) {
            client.event_json('all');
            
            let event_log = (msg, evt) => {
//                console.log(`${msg}: ${JSON.stringify(evt)}`)
            }

            client.on('CUSTOM', (evt) => {
                let sub_class = evt.body['Event-Subclass']
                event_log( `CUSTOM::${sub_class}`, evt);
            });
            
            this.event_list.forEach( (event_name) => {
                client.on(event_name, (evt) => event_log( event_name, evt));
            })
        }

        public connect() {
            return new Promise( (resolve, reject) => {
                let options = {
                    'password': this.pwd,
                    'report': this.esl_client_error.bind(this),
                    'all_events': true
                };
                var self = this;
                self.connected = false;
                this.fs_socket = esl.client(options, 
                    function () {       // Don't use () => syntax here because it obscures 'this', 
                                        // which is a pointer to the client obj that we're actually after.
                        self.connected = true;
                        self.fs_client = this;
                        self.setup_event_listeners(this);
                        resolve();
                    }, 
                    (err) => {
                        reject(err);
                    }
                );

                this.fs_socket.connect( this.port, this.host );
            })
        }

        private esl_client_error(Error) {
            this.emit('esl-error', Error);
        }

        public isConnected(): boolean {
            return this.connected;
        }

        public api(msg) {
            return this.fs_client.api(msg);
        }

    }

    export class FSConnection extends events.EventEmitter {
        private client: ESLClient;
        private client_is_connecting: boolean;
        private connection_interval: NodeJS.Timer;

        constructor(host: string, port:number, pwd:string) {
            super();
            this.client_is_connecting = false;

            this.client = new ESLClient(host, port, pwd);
            this.client.on('esl-error', (err) => this.client_error(err));
            
            this.connection_interval = setInterval( () => this.check_connection(), 5000);
        }

        private client_error(err) {
            this.emit('error', err);
        }

        private check_connection() {
            if (!this.client) {
                return;
            }

            if (!this.client.isConnected() && !this.client_is_connecting) {
                this.client_is_connecting = true;
                this.client.connect()
                    .then( () => {
                        this.emit('connected');
                        this.client_is_connecting = false;
                    })
                    .catch( (err) => {
                        this.client_error(err);
                        this.client_is_connecting = false;
                    });
            }

            if (this.client.isConnected()) {
                this.client.api('status')
                    .then( (res) => {})
                    .catch( err => {
                        this.client_error(err);
                    });
            }
        }

        private dial_conference(phone_number: string, fs_conference: string, caller_id: string) {
            return new Promise<string>( (resolve, reject) => {
                let phone = normalize_phone_number(phone_number);
                let cid = normalize_phone_number(caller_id);

                let args= `originate ${(caller_id ? `{origination_caller_id_number=+1${cid}}` : '')}sofia/gateway/twilio/+1${phone} ${fs_conference}`;
                this.client.api(args)
                    .then( (res) => {
                        console.log(`Successfully dialed conference. UUID=${res.uuid}`)
                        resolve(res.uuid);
                    })
                    .catch( (err) => {
                        console.error(`originate.catch: error\n${err.message}`)
                        this.client_error(err)
                    });
            });
        }

        private login_to_conference(uuid: string, pin: string) {
            return new Promise<string>( (resolve, reject) => {
                let args= `uuid_send_dtmf ${uuid} ${pin}#`;
                setTimeout( () =>{      // Give 5 seconds for call to connect before attempting to send PIN
                    this.client.api(args)
                        .then( (res) => {
                            console.log(`login_to_conference: pin=${pin}\nres=${util.inspect(res)}`)
                            resolve(uuid);
                        })
                        .catch( (err) => {
                            if (err && err.args && err.args.reply === '-ERR no reply\n') {
                                resolve(uuid);
                                return;
                            }
                            reject(err);
                        })
                    }, 5000 );
            })
        }
        public async conference_list() {
            return new Promise<Array<string>>( (resolve, reject) => {
                let args = `conference list`;

                this.client.api(args)
                    .then( (res) => {
//Conference 3010-172.31.27.163 (2 members rate: 8000 flags: r
                        if (res && res.body) {
                            // FS "should" return "No active conferences", but to make sure
                            // we're going to look for the start of a valid conference line
                            // and return the empty array if we don't find it.
                            if (!res.body.startsWith('Conference ')) {
                                resolve([]);
                            } else {
                                // Returned data will contain multiple lines
                                // First line is "Conference <name> ..." 
                                // next X lines are the attendees on that conference
                                // So filter out lines that begin with "Conference ",
                                // then map each of those, extracting the conference name
                                let confs = res.body.split('\n')
                                    .filter( f => f.startsWith('Conference '))
                                    .map( l => {
                                        let epos = l.indexOf(' ', 11);
                                        return l.substring(11, epos);
                                    });
                                console.log(util.inspect(confs));
                                resolve(confs);
                            }
                        } else {
                            reject(new Error('No body found in response to "conference list"'));
                        }
                    })
                    .catch( (err) => {
                        console.error(`conference_list.catch: err=${util.inspect(err)}`);
                        reject(err);
                    })
                })
        }

        public async get_conference_name(conf: string) {
            return new Promise<string>( (resolve, reject) => {
            this.conference_list()
                .then( (clist:Array<string>) => {
                    let cname = clist.filter( c => c.startsWith(conf));
                    resolve(cname[0]);
                })
            });
        }

        private async get_conference_dn() {
            return new Promise<string>( (resolve, reject) => {
                resolve('3010');
            })
        }

        public async call_conference(phone_number: string, pin: string, caller_id: string ) {
            return new Promise<ConfCall>( async (resolve, reject) => {
                try {
                    var conf_data:ConfCall = new ConfCall();

                    conf_data.caller_id = caller_id;
                    conf_data.pin = pin;

                    conf_data.dn = await this.get_conference_dn();
                    conf_data.uuid = await this.dial_conference(phone_number, conf_data.dn, conf_data.caller_id)
                    await this.login_to_conference(conf_data.uuid, conf_data.pin);
                    conf_data.name = await this.get_conference_name(conf_data.dn);

                    console.log('Resolving call conference');
                    resolve(conf_data);
                } catch (err) {
                    reject(err);
                }
            });
        }

        public async record_conference(conf:ConfCall, rtmp:string) {
            return new Promise( async (resolve, reject) => {
                try {
                    console.log(`record_conference: call id ${conf.dn}, rtmp ${rtmp}`);
                    let cmd_line = `conference ${conf.name} record ${rtmp}`
                    await this.client.api(cmd_line); 
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
        }
    }
}
