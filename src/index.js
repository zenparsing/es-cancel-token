import { CancelToken, CancelError } from './CancelToken.js';

export { CancelToken, CancelError } from './CancelToken.js';

export function polyfill() {
  Object.assign(global, { CancelToken, CancelError });
}
