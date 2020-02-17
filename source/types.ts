/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-interop
 */

export type InteropObservable<T> = {
  [Symbol.observable]: () => Subscribable<T>;
};

export type Observer<T> = {
  closed?: boolean;
  complete(): void;
  error(error: any): void;
  next(value: T): void;
};

export type PartialObserver<T> = Partial<Observer<T>> &
  (
    | { complete(): void }
    | { error(error: any): void }
    | { next(value: T): void }
  );

export type Subscribable<T> = {
  subscribe(observer?: PartialObserver<T>): Unsubscribable;
  subscribe(
    next?: ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Unsubscribable;
};

export type Unsubscribable = {
  unsubscribe(): void;
};
