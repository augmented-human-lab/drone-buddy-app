import dgram from 'react-native-udp';
import {Buffer} from 'buffer';
import DroneNotConnectedError from '../Errors.ts';
import {Logger} from '../Logger.ts';

export class UdpSocket {
  private _socket: any;
  private readonly _host: string | undefined;
  private readonly _port: number;
  private isConnecting: boolean = false;
  private readonly SOCKET_PROTOCOL: string = 'udp4';

  constructor(port: number, host?: string) {
    this._host = host;
    this._port = port;

    Logger.log_info(
      'System Actions',
      ' UDP SOCKET',
      'Connecting to host' + this._host,
    );
    Logger.log_info(
      'System Actions',
      ' UDP SOCKET',
      'Connecting to port' + this._port,
    );

    // @ts-ignore
    this._socket = dgram.createSocket(this.SOCKET_PROTOCOL);
    this._socket.bind(this._port);
    this._socket.once('listening', () => {
      this.isConnecting = true;
      Logger.log_info('System Actions', ' UDP SOCKET', 'listening to the UDP');
      // Set up a listener for incoming messages
      // this._socket.on(
      //   'message',
      //   (msg: {toString: () => any}, rinfo: {address: any; port: any}) => {
      //     Logger.log_info(
      //       'System Actions',
      //       ' UDP SOCKET',
      //       `Received message: ${msg.toString()} from ${rinfo.address}:${
      //         rinfo.port
      //       }`,
      //     );
      //   },
      // );
    });
  }

  private onSendError(err: Error | null, message: Buffer) {
    if (err) {
      Logger.log_error(
        'System Errors',
        ' UDP SOCKET',
        `Failed to send command: ${err.message}`,
        err,
      );

      this.close();
      this.isConnecting = false;
      if (err.message.includes(' no client found with id')) {
        return new DroneNotConnectedError(this._host, this._port);
      } else if (err.message.includes('ECONNREFUSED')) {
        return new DroneNotConnectedError(this._host, this._port);
      } else {
        return new Error(err.message);
      }
    } else {
      Logger.log_success(
        'System Actions',
        ' UDP SOCKET',
        `Sent message: ${message.toString()} to ${this._host}:${this._port}`,
      );
    }
  }

  addSocketListener(event: string, callback: (arg0: any) => any) {
    this._socket.on(event, callback);
    Logger.log_info(
      'System Actions',
      ' UDP SOCKET',
      'Event Name : ' + event + ' Socket Listener Added',
    );
  }

  close() {
    Logger.log_info('System Actions', ' UDP SOCKET', 'Closing the UDP');
    this._socket.close();
  }

  send(command: string) {
    const message = Buffer.from(command);
    this._socket.send(
      message,
      0,
      message.length,
      this._port,
      this._host,
      (err: Error | null) => {
        this.onSendError(err, message); // Pass the command as a string
      },
    );
  }
}
