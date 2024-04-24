import { NoFlags } from "./ReactFiberFlags";
import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";

// Fiber节点的构造函数
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.memoizedState = null;
  this.updateQueue = null;
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.alternate = null;
  this.index = 0;
}

// 创建一个新的Fiber 节点
export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

// 创建HostRoot类型的Fiber
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

// 基于旧的Fiber节点和新的属性创建一个新的Fiber节点
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
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

// 从类型和属性创建新的Fiber节点
function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;
  if (typeof type === "string") {
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

// 将text节点转成文本类型的Fiber
export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}
