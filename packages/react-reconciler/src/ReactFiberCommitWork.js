import {
  appendChild,
  insertBefore,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { MutationMask, Placement } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

export function commitMutationEffectsOnFiber(finishedWork, root) {
  switch (finishedWork.tag) {
    case HostRoot:
    case HostComponent:
    case HostText: {
      recursivelyTraverMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
  }
}

function recursivelyTraverMutationEffects(root, parentFiber) {
  if (parentFiber.substreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork;
  if (flags & Placement) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
}

// Host 就是宿主，这里就是说是宿主环境产生的Fiber，即div，span这类原生的dom元素产生的fiber节点

function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostRoot: {
      // <div id="root"></div>
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
  }
}

function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    const { child } = node;
    if (child) {
      insertOrAppendPlacementNode(child, before, parent);
      let { sibling } = child;
      while (sibling) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

// 找到一个可以挂载的节点，父节点可能是函数节点
// 不是原生的dom节点，不能挂载，所以要一直向上找到一个能够挂载的位置
function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent) {
    if (isHostParent(parent)) {
      return;
    }
    parent = parent.return;
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot;
}

function getHostSibling(fiber) {
  let node = fiber;
  siblings: while (true) {
    // 如果没有兄弟节点，或者兄弟节点不能挂载，就往回寻找父节点
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;
    // 如果当前node不能挂载，继续寻找当前节点的子节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.flags & Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }
    // 如果当前节点不是要修改的节点，就返回他的stateNode
    if (!(node.flags & Placement)) {
      return node.stateNode;
    }
  }
}
