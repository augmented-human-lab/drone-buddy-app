export class Logger {
  static log_info(
    messageType: string,
    destination: string,
    message: string,
    info?: any,
  ) {
    console.log(
      '🔵 Info: ',
      messageType,
      ' : ',
      destination,
      ' : ',
      message,
      info,
    );
  }

  static log_error(
    messageType: string,
    destination: string,
    message: string,
    error: any,
  ) {
    console.log(
      '🔴 Error: ',
      messageType,
      ' : ',
      destination,
      ' : ',
      message,
      ' : ',
      error,
    );
  }

  static log_success(
    messageType: string,
    destination: string,
    message: string,
    info?: any,
  ) {
    console.log(
      '🟢 Success: ',
      messageType,
      ' : ',
      destination,
      ' : ',
      message,
      info,
    );
  }

  static log_warning(
    messageType: string,
    destination: string,
    message: string,
    info?: any,
  ) {
    console.log(
      '🟠 Warning: ',
      messageType,
      ' : ',
      destination,
      ' : ',
      message,
      info,
    );
  }
}
