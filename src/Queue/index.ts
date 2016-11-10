import { promiseDefer, PromiseDeferType } from '../promiseDefer';

export class QueueItem<T> {
  data: T;
  next: QueueItem<T>;
  constructor(data: T) {
    this.data = data;
  }
}

export class Queue<T> {
  headItem: QueueItem<T>;
  tailItem: QueueItem<T>;
  constructor() {
    this.headItem = null;
    this.tailItem = null;
  }
  enqueue(data: T) {
    const itemToInsert = new QueueItem(data);
    if (!this.headItem) {
      this.headItem = itemToInsert;
      this.tailItem = itemToInsert;
    } else {
      this.tailItem.next = itemToInsert;
      this.tailItem = itemToInsert;
    }
  }
  dequeue() {
    if (!this.headItem) { return null }
    const toReturn = this.headItem.data;
    this.headItem = this.headItem.next;
    return toReturn;
  }
}
