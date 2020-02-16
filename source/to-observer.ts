/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import { Observer, PartialObserver } from "./types";

const noop = () => {};
const noopObserver = {
  complete: noop,
  error: noop,
  next: noop
};

export function toObserver<T>(
  nextOrObserver?: PartialObserver<T> | ((value: T) => void) | null,
  error?: ((error: any) => void) | null,
  complete?: (() => void) | null
): Observer<T> {
  if (nextOrObserver && typeof nextOrObserver !== "function") {
    if (
      nextOrObserver.next &&
      nextOrObserver.error &&
      nextOrObserver.complete
    ) {
      return nextOrObserver as Observer<T>;
    }
    return {
      complete: (nextOrObserver.complete || noopObserver.complete).bind(
        nextOrObserver
      ),
      error: (nextOrObserver.error || noopObserver.error).bind(nextOrObserver),
      next: (nextOrObserver.next || noopObserver.next).bind(nextOrObserver)
    };
  }
  return {
    complete: complete || noopObserver.complete,
    error: error || noopObserver.error,
    next: nextOrObserver || noopObserver.next
  };
}
