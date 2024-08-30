// The model is responsible for defining the data structure and the logic of the application. In this case, the HttpError model is used to create custom error objects that can be thrown in the controller to handle errors in the application.
// The HttpError class extends the Error class and adds a code property to store the error code. This allows the controller to return the error code to the client when an error occurs.

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

module.exports = HttpError;
