class DroneNotConnectedError extends Error {
  constructor(host: string | undefined, port: number) {
    const message = `System Errors : DRONE : Drone not connected to the network: ${host}:${port}`;
    super(message); // Pass message to parent constructor
    this.name = this.constructor.name; // Set the error name to the name of the custom error class
    Object.setPrototypeOf(this, DroneNotConnectedError.prototype); // Set the prototype explicitly.
  }

  logCustomError() {
    // Custom method to log the error
    console.log(`DroneNotConnectedError: ${this.name}: ${this.message}`);
  }
}

export default DroneNotConnectedError;
