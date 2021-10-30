/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

declare global {
  interface SymbolConstructor {
    readonly observable: symbol;
  }
}

export const observable = Symbol.observable || "@@observable";
