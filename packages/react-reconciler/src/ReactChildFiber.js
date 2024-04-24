import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import isArray from "shared/isArray";
import { Placement } from "./ReactFiberFlags";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";

// 如果没有老夫fiber，初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false);

// 有老父fiber更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true);

function createChildReconciler(shouldTrackSideEffects) {
  // 比较子Fibers
  // currentFiber 老的子节点
  // newChild 新的子节点
  function reconcileChildFibers(returnFiber, currentFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          break;
      }
    }

    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFiber, newChild);
    }
  }

  // 将新的子节点数组和旧的子节点Fiber进行比较，并返回新的子Fiber
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    // debugger;
    // 这里是维护子节点的链表
    // 返回子节点链表的头部节点
    // 对于多个子节点，父节点的child只指向第一个子节点，剩下的子节点都用sibling形成一个链表
    // 而子节点都有一个return属性又指回父节点
    let resultingFistChild = null;
    let previousNewFiber = null;
    let newIdx = 0;
    // console.log("newChildren", newChildren);
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      if (previousNewFiber === null) {
        resultingFistChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFistChild;
  }

  // 根据新的子节点创建Fiber

  function createChild(returnFiber, newChild) {
    // console.log("newChild", newChild);
    if (
      (typeof newChild === "string" && newChild !== "") ||
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

  // 为新创建的Fiber设置索引，并在必要时设置副作用
  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
  }

  // 设置副作用
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  /**
   * 创建Child Reconciler 的函数
   * @param {workInProgress} returnFiber
   * @param {current.child} currentFiber
   * @param {nextChildren} element
   */
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 根据虚拟DOM得到Fiber
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  return reconcileChildFibers;
}
