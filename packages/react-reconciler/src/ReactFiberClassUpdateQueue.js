import assign from "shared/assign";
import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {};

  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  // 这里维护的是一个update的单向循环链表
  // 设计成环形链表是为了处理优先级的问题
  if (pending == null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // 这里的pending始终指向最新的update
  updateQueue.shared.pending = update;

  // 返回整个应用程序的根节点，可以看作是链表的head
  return markUpdateLaneFromFiberToRoot(fiber);
}

export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  // queue.shared.pending 指向 update 循环链表中的最后一个update
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;

    // 将循环链表变成单向链表，最后一个节点不再指向第一个节点
    lastPendingUpdate.next = null;
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;

    // 循环更新链表，合并state
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    // 更新好state之后，再重新赋值给 memoizedState，缓存起来
    workInProgress.memoizedState = newState;
  } else {
  }
}

function getStateFromUpdate(update, prevState) {
  const { payload } = update;
  return assign({}, prevState, payload);
}
