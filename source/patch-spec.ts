/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import * as Rx from "rxjs";
import { patch } from "./patch";
import { toObserver } from "./to-observer";
import { PartialObserver, Subscribable } from "./types";

const subscribable: Subscribable<number> = {
  subscribe(
    nextOrObserver?: PartialObserver<number> | ((value: number) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ) {
    const observer = toObserver(nextOrObserver, error, complete);
    observer.next(42);
    return { unsubscribe: () => {} };
  }
};

describe("patch", () => {
  describe("without Symbol.observable", () => {
    it("should be compatible with from", () => {
      expect(Symbol.observable).to.be.undefined;
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      };
      patch(interop);
      Rx.from(interop).subscribe(value => expect(value).to.equal(42));
    });

    it("should support classes", () => {
      expect(Symbol.observable).to.be.undefined;
      class Interop {
        constructor() {
          patch(this);
        }
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      Rx.from(new Interop()).subscribe(value => expect(value).to.equal(42));
    });
  });

  describe("with Symbol.observable", () => {
    let symbol: Symbol;

    beforeEach(() => {
      symbol = Symbol.observable;
      (Symbol as any).observable = Rx.observable;
    });

    it("should be compatible with from", () => {
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      };
      patch(interop);
      Rx.from(interop).subscribe(value => expect(value).to.equal(42));
    });

    afterEach(() => {
      (Symbol as any).observable = symbol;
    });
  });
});

describe("patchPrototype", () => {
  describe("without Symbol.observable", () => {
    it("should be compatible with from", () => {
      expect(Symbol.observable).to.be.undefined;
      class Interop {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      patch(Interop);
      Rx.from(new Interop()).subscribe(value => expect(value).to.equal(42));
    });
  });

  describe("with Symbol.observable", () => {
    let symbol: Symbol;

    beforeEach(() => {
      symbol = Symbol.observable;
      (Symbol as any).observable = Rx.observable;
    });

    it("should be compatible with from", () => {
      class Interop {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      patch(Interop);
      Rx.from(new Interop()).subscribe(value => expect(value).to.equal(42));
    });

    afterEach(() => {
      (Symbol as any).observable = symbol;
    });
  });
});
