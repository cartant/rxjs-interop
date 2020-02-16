/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import { observable } from "./symbols";
import { InteropObservable } from "./types";

export function patch(instance: InteropObservable<any>): void;
export function patch(
  constructor: new (...args: any[]) => InteropObservable<any>
): void;
export function patch(
  arg: InteropObservable<any> | (new (...args: any[]) => InteropObservable<any>)
): void {
  if (!Symbol.observable) {
    if (typeof arg === "function" && arg.prototype[Symbol.observable]) {
      (arg.prototype as any)[observable] = arg.prototype[Symbol.observable];
      delete arg.prototype[Symbol.observable];
    } else {
      (arg as any)[observable] = arg[Symbol.observable];
      delete arg[Symbol.observable];
    }
  }
}
