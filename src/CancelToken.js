export class CancelError {
  constructor() {
    this.name = 'CancelError';
  }
}

CancelError.prototype = Object.create(Error.prototype);

export class CancelToken {
  constructor(executor) {
    this._promise = new Promise((resolve) => {
      executor(() => {
        this._cancelError = new CancelError();
        resolve(this._cancelError);
      });
    });
  }

  get requested() {
    return Boolean(this._cancelError);
  }

  get promise() {
    return this._promise;
  }

  throwIfRequested() {
    if (this._cancelError) {
      throw this._cancelError;
    }
  }
}
