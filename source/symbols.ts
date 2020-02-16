/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

declare global {
  /*tslint:disable-next-line:no-unused-declaration*/
  interface SymbolConstructor {
    readonly observable: symbol;
  }
}

export const observable = Symbol.observable || "@@observable";
