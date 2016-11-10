declare module 'sleep-promise' {
  const sleepFunc: (ms: number) => Promise<void>;
  export = sleepFunc;
}