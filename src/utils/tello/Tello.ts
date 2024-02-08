import {UdpSocket} from './UdpSocket.ts';
import {Logger} from '../Logger.ts';

const DRONE_HOST = '192.168.10.1';
const DRONE_IO_PORT = 8889;

const VS_UDP_IP = '0.0.0.0';
const VS_UDP_PORT = 11111;

export class Tello {
  private _socket: UdpSocket;
  private _stream_socket: UdpSocket;

  constructor() {
    this._socket = new UdpSocket(DRONE_IO_PORT, DRONE_HOST);
    this._stream_socket = new UdpSocket(VS_UDP_PORT, VS_UDP_IP);
    this.addSocketEvents();
  }

  private addSocketEvents() {
    this._socket.addSocketListener('error', this.onSocketError.bind(this));
    this._socket.addSocketListener(
      'message',
      this.onSocketSocketMsg.bind(this),
    );
    this._stream_socket.addSocketListener(
      'error',
      this.onStreamSocketError.bind(this),
    );
    this._stream_socket.addSocketListener(
      'message',
      this.onStreamSocketSocketMsg.bind(this),
    );
  }

  private onSocketError(err: Error) {
    Logger.log_error(
      'System Actions',
      ' TELLO',
      `Drone IO response: ${err.message}`,
      err,
    );

    this._socket.close();
  }

  private onStreamSocketError(err: Error) {
    Logger.log_error(
      'System Actions',
      ' TELLO',
      `Drone Stream response: ${err.message}`,
      err,
    );

    this._stream_socket.close();
  }

  private onSocketSocketMsg(msg: Buffer) {
    Logger.log_success('System Actions', ' TELLO', `Drone IO response: ${msg}`);
  }

  private onStreamSocketSocketMsg(msg: Buffer) {
    // Logger.log_success('System Actions', ' TELLO', `Drone stream response: ${msg}`);
  }

  send(command: string) {
    Logger.log_info('System Actions', ' TELLO', `Sending command: ${command}`);
    this._socket.send(command);
  }

  land() {
    this.send('land');
  }

  takeoff() {
    this.send('takeoff');
  }

  flip() {
    this.send('flip');
  }

  forward(distance: number) {
    this.send(`forward ${distance}`);
  }

  back(distance: number) {
    this.send(`back ${distance}`);
  }

  left(distance: number) {
    this.send(`left ${distance}`);
  }

  right(distance: number) {
    this.send(`right ${distance}`);
  }

  up(distance: number) {
    this.send(`up ${distance}`);
  }

  down(distance: number) {
    this.send(`down ${distance}`);
  }

  rotateClockwise(angle: number) {
    this.send(`cw ${angle}`);
  }

  rotateCounterClockwise(angle: number) {
    this.send(`ccw ${angle}`);
  }

  getBattery() {
    this.send('battery?');
  }

  getSpeed() {
    this.send('speed?');
  }

  getFlightTime() {
    this.send('time?');
  }

  getTemperature() {
    this.send('temp?');
  }

  getAttitude() {
    this.send('attitude?');
  }

  getBarometer() {
    this.send('baro?');
  }

  getAcceleration() {
    this.send('acceleration?');
  }

  getHeight() {
    this.send('height?');
  }
}
