/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */
/*tslint:disable:no-unused-expression*/

import chai from "chai";
const { expect } = chai;
import Rx from "rxjs";
import { patch } from "./patch.js";
import { toObserver } from "./to-observer.js";
import { PartialObserver, Subscribable } from "./types.js";

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
    beforeEach(() => {
      expect(Symbol.observable).to.be.undefined;
    });

    it("should patch an object", () => {
      const values: number[] = [];
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      };
      patch(interop);
      Rx.from(interop).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a class instance", () => {
      const values: number[] = [];
      class Interop {
        constructor() {
          patch(this);
        }
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      Rx.from(new Interop()).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a class", () => {
      const values: number[] = [];
      class Interop {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      patch(Interop);
      Rx.from(new Interop()).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });
  });

  describe("with Symbol.observable", () => {
    let symbol: Symbol;

    beforeEach(() => {
      symbol = Symbol.observable;
      (Symbol as any).observable = Rx.observable;
    });

    it("should patch an object", () => {
      const values: number[] = [];
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      };
      patch(interop);
      Rx.from(interop).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a class instance", () => {
      const values: number[] = [];
      class Interop {
        constructor() {
          patch(this);
        }
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      Rx.from(new Interop()).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a class", () => {
      const values: number[] = [];
      class Interop {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      patch(Interop);
      Rx.from(new Interop()).subscribe(value => values.push(42));
      expect(values).to.deep.equal([42]);
    });

    afterEach(() => {
      (Symbol as any).observable = symbol;
    });
  });
});
