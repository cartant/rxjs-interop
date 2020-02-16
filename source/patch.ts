/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import { observable } from "./symbols";
import { InteropObservable } from "./types";

export function patch(instance: InteropObservable<any>): void {
  if (!Symbol.observable) {
    (instance as any)[observable] = instance[Symbol.observable];
    delete instance[Symbol.observable];
  }
}

export function patchPrototype(
  ctor: new (...args: any[]) => InteropObservable<any>
) {
  if (!Symbol.observable) {
    (ctor.prototype as any)[observable] = ctor.prototype[Symbol.observable];
    delete ctor.prototype[Symbol.observable];
  }
}
