export type PromiseDeferType<T> = {
  resolve?: (value?: T) => void;
  reject?: (value: any) => void;
  promise?: Promise<T>;
}
export function promiseDefer<T>() {
  const deferred: PromiseDeferType<T> = {};

  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}