/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */
/* eslint-disable no-unused-expressions */

import { expect } from "chai";
import * as Rx from "rxjs";
import { patch } from "./patch";
import { toObserver } from "./to-observer";
import { InteropObservable, PartialObserver, Subscribable } from "./types";

const subscribable: Subscribable<number> = {
  subscribe(partialObserver?: PartialObserver<number>) {
    const observer = toObserver(partialObserver);
    observer.next(42);
    return { unsubscribe: () => {} };
  },
};

describe("patch", () => {
  describe("return value", () => {
    it("should return a passed object", () => {
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        },
      };
      expect(patch(interop)).to.equal(interop);
    });

    it("should return a passed class", () => {
      class Interop {
        constructor() {
          patch(this);
        }
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        }
      }
      expect(patch(Interop)).to.equal(Interop);
    });

    it("should return a passed function", () => {
      const interop = ((
        ...args: Parameters<Subscribable<number>["subscribe"]>
      ) =>
        subscribable.subscribe(
          ...args
        )) as unknown as InteropObservable<number>;
      interop[Symbol.observable] = (): Subscribable<number> => {
        return subscribable;
      };
      expect(patch(interop)).to.equal(interop);
    });
  });

  describe("without Symbol.observable", () => {
    beforeEach(() => {
      expect(Symbol.observable).to.be.undefined;
    });

    it("should patch an object", () => {
      const values: number[] = [];
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        },
      };
      patch(interop);
      Rx.from(interop).subscribe((value) => values.push(value));
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
      Rx.from(new Interop()).subscribe((value) => values.push(value));
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
      Rx.from(new Interop()).subscribe((value) => values.push(value));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a function", () => {
      const values: number[] = [];
      const interop = ((
        ...args: Parameters<Subscribable<number>["subscribe"]>
      ) =>
        subscribable.subscribe(
          ...args
        )) as unknown as InteropObservable<number>;
      interop[Symbol.observable] = (): Subscribable<number> => {
        return subscribable;
      };
      patch(interop);
      Rx.from(interop).subscribe((value) => values.push(value));
      expect(values).to.deep.equal([42]);
    });
  });

  describe("with Symbol.observable", () => {
    let symbol: symbol;

    beforeEach(() => {
      symbol = Symbol.observable;
      (Symbol as any).observable = Rx.observable;
    });

    it("should patch an object", () => {
      const values: number[] = [];
      const interop = {
        [Symbol.observable](): Subscribable<number> {
          return subscribable;
        },
      };
      patch(interop);
      Rx.from(interop).subscribe((value) => values.push(value));
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
      Rx.from(new Interop()).subscribe((value) => values.push(value));
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
      Rx.from(new Interop()).subscribe((value) => values.push(value));
      expect(values).to.deep.equal([42]);
    });

    it("should patch a function", () => {
      const values: number[] = [];
      const interop = ((
        ...args: Parameters<Subscribable<number>["subscribe"]>
      ) =>
        subscribable.subscribe(
          ...args
        )) as unknown as InteropObservable<number>;
      interop[Symbol.observable] = (): Subscribable<number> => {
        return subscribable;
      };
      patch(interop);
      Rx.from(interop).subscribe((value) => values.push(value));
      expect(values).to.deep.equal([42]);
    });

    afterEach(() => {
      (Symbol as any).observable = symbol;
    });
  });
});
