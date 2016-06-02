jest.unmock('../CancelToken.js');

import { CancelToken, CancelError } from '../CancelToken.js';

describe('CancelToken', () => {
  it('promise resolves with CancelError when canceled', () => {
    const cancelToken = new CancelToken((cancel) => cancel());

    return cancelToken.promise.then((value) => {
      expect(value instanceof CancelError).toBeTruthy();
    });
  });

  it('throwIfRequested throws when canceled', () => {
    const cancelToken = new CancelToken((cancel) => cancel());

    return cancelToken.promise.then(() => {
      expect(() => {
        cancelToken.throwIfRequested();
      }).toThrow();
    });
  });
});
