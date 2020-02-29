# rxjs-interop

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/rxjs-interop/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/rxjs-interop.svg)](https://www.npmjs.com/package/rxjs-interop)
[![Build status](https://img.shields.io/travis/cartant/rxjs-interop.svg)](http://travis-ci.org/cartant/rxjs-interop)
[![dependency status](https://img.shields.io/david/cartant/rxjs-interop.svg)](https://david-dm.org/cartant/rxjs-interop)
[![devDependency Status](https://img.shields.io/david/dev/cartant/rxjs-interop.svg)](https://david-dm.org/cartant/rxjs-interop#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/rxjs-interop.svg)](https://david-dm.org/cartant/rxjs-interop#info=peerDependencies)

### What is it?

A package that contains interop helper functions and types for use with RxJS.

### Why might you need it?

Observables exist independently of RxJS. There are [TC39](https://github.com/tc39/proposal-observable) and [WHATWG](https://github.com/whatwg/dom/issues/544) observable proposals. The helpers in this package make it easy to implement observables that will work with or without RxJS and will still play nice - with RxJS - if `Symbol.observable` is not configured.

## Install

Install the package using NPM:

```sh
npm install rxjs-interop --save
```

## Usage

Interop observables expose an observable factory via the `Symbol.observable` property, like this:

```ts
export const interop = {
  [Symbol.observable]: () => {
    return {
      subscribe(nextOrObserver, error, complete) {
        /* figure out whether it's a next callback or an observer */
        /* call observer methods */
        return () => { /* some teardown logic */ };
      }
    };
  }
});
```

For this to work with RxJS, the caller will need to initialize `Symbol.observable` - which makes things more complicated.

You can use the `patch` and `toObserver` helpers in this package to more easily implement `subscribe` and to make sure that the interop observable will work with RxJS without `Symbol.observable` having to be initialized:

```ts
import { patch, toObserver } from "rxjs-interop";

export const interop = patch({
  [Symbol.observable]: () => {
    return {
      subscribe(nextOrObserver, error, complete) {
        const observer = toObserver(nextOrObserver, error, complete);
        /* call observer methods */
        return () => { /* some teardown logic */ };
      }
    };
  }
});
```

`patch` can be passed either an interop observable instance or the constructor of an interop observable class.