import { createHostRootFiber } from "./ReactFiber";
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue";

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

export function createFiberRoot(containerInfo) {
  // FiberRoot 和 rootFiber 通过 current 连接
  const root = new FiberRootNode(containerInfo);
  const uninitializedFiber = createHostRootFiber();
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  initialUpdateQueue(uninitializedFiber);
  return root;
}
