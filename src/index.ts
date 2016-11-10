import * as uuid from 'node-uuid';
import * as sleep from 'sleep-promise';

import { Queue } from './Queue';
import { promiseDefer, PromiseDeferType } from './promiseDefer';

export class TimeoutError extends Error {
  constructor(taskName) {
    super(`${taskName} timed out!`);
  }
}

export type Task = {
  defer: PromiseDeferType<void>,
  id: string,
  timeoutMs: number,
};

export class ParallelLock {
  runtimeTimeouts: {
    [key: string]: PromiseDeferType<void>,
  };
  runtimeTimeoutErrors: {
    [key: string]: TimeoutError,
  };
  taskQueue: Queue<Task>;
  parallelCount: number;
  maxParallels: number;
  defaultTimeoutMs: number;

  constructor(options: {
    maxParallels?: number,
    defaultTimeoutMs?: number,
  }) {
    this.taskQueue = new Queue<Task>();
    this.maxParallels = options.maxParallels || 1;
    this.runtimeTimeouts = {};
    this.runtimeTimeoutErrors = {};
    this.parallelCount = 0;
    this.defaultTimeoutMs = options.defaultTimeoutMs || 100000;
  }

  async acquireLock(options?: {
    taskTimeoutMs?: number,
    taskName?: string,
  }) {
    const { taskTimeoutMs, taskName } = options || {
      taskTimeoutMs: null, taskName: null,
    };
    const defer = promiseDefer<void>();
    const id = uuid.v4();
    const timeoutMs = taskTimeoutMs || this.defaultTimeoutMs;
    const task: Task = {
      defer, id, timeoutMs,
    };
    this.runtimeTimeoutErrors[task.id] = new TimeoutError(taskName);
    if (this.parallelCount < this.maxParallels) {
      this.runTask(task);
    } else {
      this.taskQueue.enqueue(task);
    }
    await task.defer;
    return task;
  }
  runTask(task: Task) {
    const timeoutDefer = promiseDefer<void>();
    this.runtimeTimeouts[task.id] = timeoutDefer;
    this.parallelCount++;
    this.runtimeTimeouts[task.id].promise
      .catch((error) => {
        throw(error);
      });

    sleep(task.timeoutMs)
      .then(() => {
        timeoutDefer.reject(this.runtimeTimeoutErrors[task.id]);
      });
    task.defer.resolve();
  }
  releaseLock(task) {
    // delete this.runtimeTimeouts[task.id];
    this.parallelCount--;
    if (this.parallelCount < this.maxParallels) {
      const taskToRun = this.taskQueue.dequeue();
      if (taskToRun) {
        this.runTask(taskToRun);
      }
    }
    this.runtimeTimeouts[task.id].resolve();
  }
}

export default ParallelLock;