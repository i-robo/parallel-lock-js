export declare type PromiseDeferType<T> = {
    resolve?: (value?: T) => void;
    reject?: (value: any) => void;
    promise?: Promise<T>;
};
export declare function promiseDefer<T>(): {
    resolve?: (value?: T) => void;
    reject?: (value: any) => void;
    promise?: Promise<T>;
};
