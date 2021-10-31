/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import { Observer, PartialObserver } from "./types";

const noop = () => {};
const rethrow = (error: unknown) => {
  /* eslint-disable-next-line etc/throw-error */
  throw error;
};

export function toObserver<T>(observer?: PartialObserver<T>): Observer<T> {
  if (observer) {
    const { complete, error, next } = observer;
    if (complete && error && next) {
      return observer as Observer<T>;
    }
    return {
      complete: (complete ?? noop).bind(observer),
      error: (error ?? rethrow).bind(observer),
      next: (next ?? noop).bind(observer),
    };
  }
  return {
    complete: noop,
    error: rethrow,
    next: noop,
  };
}
