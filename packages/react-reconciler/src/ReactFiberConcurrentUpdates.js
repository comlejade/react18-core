import { HostRoot } from "./ReactWorkTags";

export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }

  // 这里是找到整个应用程序的根节点 FiberRoot
  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  return null;
}
