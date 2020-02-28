/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

import chai from "chai";
const { expect } = chai;
import { toObserver } from "./to-observer.js";

describe("toObserver", () => {
  it("should return non-partial observers", () => {
    const observer = {
      complete() {},
      error() {},
      next() {}
    };
    const result = toObserver(observer);
    expect(result).to.equal(observer);
  });

  it("should support partial observers", () => {
    const observer = {
      next() {}
    };
    const result = toObserver(observer);
    expect(result).to.not.equal(observer);
    expect(result.next).to.be.a("function");
    expect(result.error).to.be.a("function");
    expect(result.complete).to.be.a("function");
  });

  it("should bind a partial observer's context", () => {
    let receivedThis: any;
    let receivedValue: any;
    const observer = {
      next(this: any, value: number) {
        receivedThis = this;
        receivedValue = value;
      }
    };
    const result = toObserver(observer);
    expect(result).to.not.equal(observer);
    expect(result.next).to.be.a("function");
    result.next(42);
    expect(receivedThis).to.equal(observer);
    expect(receivedValue).to.equal(42);
  });

  it("should support separate arguments", () => {
    const next = () => {};
    const error = () => {};
    const complete = () => {};
    const observer = toObserver(next, error, complete);
    expect(observer.next).to.equal(next);
    expect(observer.error).to.equal(error);
    expect(observer.complete).to.equal(complete);
  });

  it("should support undefined arguments", () => {
    const observer = toObserver(undefined, undefined, undefined);
    expect(observer.next).to.be.a("function");
    expect(observer.error).to.be.a("function");
    expect(observer.complete).to.be.a("function");
  });

  it("should support null arguments", () => {
    const observer = toObserver(null, null, null);
    expect(observer.next).to.be.a("function");
    expect(observer.error).to.be.a("function");
    expect(observer.complete).to.be.a("function");
  });
});
