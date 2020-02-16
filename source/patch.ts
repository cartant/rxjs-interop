/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import { observable } from "./symbols";
import { InteropObservable } from "./types";

export function patch<T>(interop: InteropObservable<T>): void {
  if (!Symbol.observable) {
    (interop as any)[observable] = interop[Symbol.observable];
    delete interop[Symbol.observable];
  }
}

export function patchPrototype<
  C extends new (...args: any[]) => InteropObservable<any>
>(ctor: C) {
  if (!Symbol.observable) {
    (ctor.prototype as any)[observable] = ctor.prototype[Symbol.observable];
    delete ctor.prototype[Symbol.observable];
  }
}
