import { scheduleCallback } from "scheduler/index";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

let workInProgress = null;

// 开始调度 Fiber 更新
export function scheduleUpdateOnFiber(root) {
  // root 是 FiberRoot
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  // 在浏览器的空余时间执行
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

function performConcurrentWorkOnRoot(root) {
  // 处理同步渲染
  renderRootSync(root);
  root.finishedWork = root.current.alternate;
  // commitRoot(root)
}

function renderRootSync(root) {
  // root = FiberRoot
  // 创建或更新 workInProgress 的Fiber树
  prepareFreshStack(root);
  // 同步循环更新Fiber树
  workLoopSync();
}

function prepareFreshStack(root) {
  // root = FiberRoot
  // root.current = RootFiber
  // 这里的 RootFiber 是页面上展示的 RootFiber
  workInProgress = createWorkInProgress(root.current, null);
}

function workLoopSync() {
  while (workInProgress !== null) {
    // 遍历更新 workInProgress
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  // 处理完当前节点，返回它的子节点
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  workInProgress = null;
  //   if (next == null) {
  //     completeUniOfWork(unitOfWork);
  //   } else {
  //     workInProgress = next;
  //   }
}

function completeUniOfWork(unitOfWork) {
  console.log(unitOfWork);
}
