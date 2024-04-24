import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};

export function createRoot(container) {
  const root = createContainer(container);
  // 这里的 root 是返回的 FiberRoot
  // 即 Fiber 的根节点，可以根据 current 拿到 rootFiber 的信息
  return new ReactDOMRoot(root);
}
