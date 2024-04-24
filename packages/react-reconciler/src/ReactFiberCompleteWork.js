import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  finalizeInitialChildren,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { NoFlags } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  // HostRoot 相当于 <div id="root"></div>
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      //   debugger;
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalizeInitialChildren(instance, type, newProps);

      bubbleProperties(workInProgress);
      break;
    case HostText:
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
      break;
  }
}

// 将子节点的操作以及子节点的后代的操作都冒泡到父节点上
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  // 记录所有子节点和子节点的子节点的操作，flags对应的是该fiber节点应该执行的操作
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.subtreeFlags = subtreeFlags;
}

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  // console.log(parent);
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 先遍历子节点，再遍历兄弟节点
      // 深度遍历
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    // 下面的循环是归的过程，深入遍历到最深的子节点，然后往回找，
    // 看父节点是否有兄弟节点，有就接着外层循环遍历兄弟节点，
    // 没有就一直往上归
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node = node.sibling;
  }
}
