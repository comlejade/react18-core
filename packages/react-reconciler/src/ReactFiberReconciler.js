import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { createFiberRoot } from "./ReactFiberRoot";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

export function updateContainer(element, container) {
  // contianer 对应的FiberRoot
  // current 拿到 rootFiber
  //
  const current = container.current;
  //   console.log(current);
  const update = createUpdate();
  update.payload = { element };
  // 返回FiberRoot
  const root = enqueueUpdate(current, update);

  // 从这里正式开始渲染过程
  scheduleUpdateOnFiber(root);
}
