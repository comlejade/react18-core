import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import isArray from "shared/isArray";
import { Placement } from "./ReactFiberFlags";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";

export const mountChildFibers = createChildReconciler(false);

export const reconcileChildFibers = createChildReconciler(true);

function createChildReconciler(shouldTrackSideEffects) {
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    // 这里是维护子节点的链表
    // 返回子节点链表的头部节点
    // 对于多个子节点，父节点的child只指向第一个子节点，剩下的子节点都用sibling形成一个链表
    // 而子节点都有一个return属性又指回父节点
    let resultingFistChild = null;
    let previousNewFiber = null;
    let newIdx = 0;
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      if (previousNewFiber == null) {
        resultingFistChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFistChild;
  }

  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild !== "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        default:
          break;
      }
    }

    return null;
  }

  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
  }

  // currentFiber 老的子节点
  // newChild 新的子节点
  function reconcileChildFibers(returnFiber, currentFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconsileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          break;
      }
    }

    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFiber, newChild);
    }
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  /**
   *
   * @param {workInProgress} returnFiber
   * @param {current.child} currentFiber
   * @param {nextChildren} element
   */
  function reconsileSingleElement(returnFiber, currentFirstFiber, element) {
    // 根据虚拟DOM得到Fiber
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  return reconcileChildFibers;
}
