# Parallel-Lock JS
 - promise-based lock for testing

```typescript
// (Start)
const noticeDBLocks = new ParallelLock(1, 10000);

// (Code 1)
beforeEach(async () => {
  await noticeDBLocks.acquireLock();
});
...
afterEach(async() => {
  await noticeDBLocks.releaseLock();
});

```