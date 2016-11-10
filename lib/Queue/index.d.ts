export declare class QueueItem<T> {
    data: T;
    next: QueueItem<T>;
    constructor(data: T);
}
export declare class Queue<T> {
    headItem: QueueItem<T>;
    tailItem: QueueItem<T>;
    constructor();
    enqueue(data: T): void;
    dequeue(): T;
}
