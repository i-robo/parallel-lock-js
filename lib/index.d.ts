import { Queue } from './Queue';
import { PromiseDeferType } from './promiseDefer';
export declare class TimeoutError extends Error {
    constructor(taskName: any);
}
export declare type Task = {
    defer: PromiseDeferType<void>;
    id: string;
    timeoutMs: number;
};
export declare class ParallelLock {
    runtimeTimeouts: {
        [key: string]: PromiseDeferType<void>;
    };
    runtimeTimeoutErrors: {
        [key: string]: TimeoutError;
    };
    taskQueue: Queue<Task>;
    parallelCount: number;
    maxParallels: number;
    defaultTimeoutMs: number;
    constructor(options: {
        maxParallels?: number;
        defaultTimeoutMs?: number;
    });
    acquireLock(options?: {
        taskTimeoutMs?: number;
        taskName?: string;
    }): Promise<{
        defer: {
            resolve?: (value?: void) => void;
            reject?: (value: any) => void;
            promise?: Promise<void>;
        };
        id: string;
        timeoutMs: number;
    }>;
    runTask(task: Task): void;
    releaseLock(task: any): void;
}
export default ParallelLock;
