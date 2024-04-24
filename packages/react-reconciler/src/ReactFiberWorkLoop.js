import { scheduleCallback } from "scheduler/index";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { MutationMask, NoFlags } from "./ReactFiberFlags";
import { commitMutationEffectsOnFiber } from "./ReactFiberCommitWork";

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

// 执行根节点的并发工作
function performConcurrentWorkOnRoot(root) {
  // 处理同步渲染
  renderRootSync(root);
  root.finishedWork = root.current.alternate;
  commitRoot(root);
}

function renderRootSync(root) {
  // root = FiberRoot
  // 创建或更新 workInProgress 的Fiber树
  prepareFreshStack(root);
  // 同步循环更新Fiber树
  workLoopSync();
}

// 准备一个新的工作栈
function prepareFreshStack(root) {
  // root = FiberRoot
  // root.current = RootFiber
  // 这里的 RootFiber 是页面上展示的 RootFiber
  workInProgress = createWorkInProgress(root.current, null);
}

// 同步渲染根节点
function workLoopSync() {
  while (workInProgress) {
    // 遍历更新 workInProgress
    // console.log("workInProgress", workInProgress);
    performUnitOfWork(workInProgress);
  }
}

// 执行一个工作单元
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  // 处理完当前节点，返回它的子节点
  const next = beginWork(current, unitOfWork);
  // console.log("next", next);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

// 完成一个工作单元
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    completeWork(current, completedWork);
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    completedWork = returnFiber;
    // 下面这一行是实现循环的关键
    workInProgress = completedWork;
  } while (completedWork !== null);
}

// 提交根节点
function commitRoot(root) {
  const { finishedWork } = root;
  // 子节点是否有副作用
  const subtreeHasEffects =
    (finishedWork.subtreeHasEffects & MutationMask) != NoFlags;

  const rootHasEffect = (finishedWork.flags & MutationMask) != NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    commitMutationEffectsOnFiber(finishedWork, root);
  }

  // root 的current 的指向发生改变
  // workInProgress 树变成了 current 树
  // current 树变成了 workInProgress 树
  root.current = finishedWork;
}
