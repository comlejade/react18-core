import { NoFlags } from "./ReactFiberFlags";
import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key) {
  // 实例相关
  this.tag = tag;
  this.key = key;
  this.type = null; //fiber 节点对应虚拟DOM的类型
  this.stateNode = null;

  // Fiber相关
  this.return = null;
  this.sibling = null;
  this.index = 0;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.memoizedState = null;
  this.updateQueue = null;

  // Effects 相关
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;

  // current 和 workInProgress 相关联
  this.alternate = null;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

export function createWorkInProgress(current, pendingProps) {
  // current 是页面上展示的 RootFiber
  // current.alternate 是 工作区中的 RootFiber
  let workInProgress = current.alternate;
  if (workInProgress == null) {
    // 创建
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    // 复用正在展示的Fiber的老节点的信息
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
  } else {
    // 更新
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}

// 将虚拟DOM转成Fiber
export function createFiberFromElement(element) {
  const { type, key, props: pendingProps } = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  // 一开始并不知道是什么类型的组件
  let tag = IndeterminateComponent;
  if (typeof type === "string") {
    tag = HostComponent;
  }

  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

// 将text节点转成Fiber
export function createFiberFromText(text) {
  return createFiber(HostText, content, null);
}
