# Fiber 架构 
- Fiber 架构是为了 React 为了解决性能问题和提升调度能力而引入的一种新的内容实现机制
- 它主要通过重新组织渲染过程，使React可以更有效的执行渲染任务。

## 动机
- 性能
- 调度
- 可扩展性

# Fiber
数据结构对象
主要结构
* type
* key
* props
* return
* child
* sibling

## 原来虚拟DOM的渲染流程
虚拟DOM -> 真实DOM -> 挂载
## 最新Fiber流程
虚拟DOM树 -> Fiber树 -> 真实DOM -> 挂载

# 双缓存策略
前缓冲区 <--- 后缓冲区
* 前缓冲区显示完整渲染的帧
* 后缓冲区是正在绘制的渲染帧

## 当前渲染树
## 工作进程树
## 提交阶段

# 工作循环
React 内部处理更新和渲染任务的主要过程

- 协调：计算新的组件状态和虚拟DOM
    - 拆分成较小的工作单元
- 提交：负责将新的虚拟DOM应用到实际的DOM上

# 并发模式
- 大的单独任务拆分成许多小任务
- 时间切片，requestIdleCallback
- 优先级调度

# createRoot 到 render

- createRoot -> 1. createContainer, 2. new ReactDOMRoot

- createContainer -> createFiberRoot -> 1. 创建FiberRoot ` 即 new FiberRootNode ` 2.创建宿主环境的 RootFiber ` 即 createHostRootFiber ` -> 关联两者 ` FiberRoot.current = HostRootFiber ` ` HostRootFiber.stateNode = FiberRoot `

- ReactDOMRoot -> render -> updateContainer

# render 函数
虚拟DOM -> Fiber树 -> 真实DOM -> 挂载
- beginWork 阶段， 虚拟DOM -> Fiber树
- completeWork 阶段，Fiber树 -> 真实DOM
- commitWork 阶段，挂载

## 渲染阶段
- beginWork
- completeWork

### beginWork
- render函数从updateContainer开始
- updateContainer -> createUpdate, enqueueUpdate
- createUpdate -> 生成了一个 update 对象 payload 中保存着 {element}
- enqueueUpdate -> 将上步新生成的update放入一个 update 的单向循环链表中，fiber 节点中有一个 updateQueue 属性，updaeQueue.shared.pending 始终指向最后插入的update，这个函数返回整个应用的根节点，可以看成是一个fiber链表的根节点
- fiber是一个链表，fiber上的updateQueue又保存一个update的单向循环链表
- 上面是先维护一下update链表，然后正式开始渲染过程 scheduleUpdateOnFiber(root)
- ensureRootIsScheduled 调度一个这个更新过程
- scheduleCallback 确保只在浏览器空余时间执行 perfromConcurrentWorkOnRoot
- renderRootSync 开启同步渲染
- prepareFreshStack 创建或者更新workInProgress的Fiber树，createWorkInProgress
- 有了workInProgress，开始同步更新Fiber树 workLoopSync()
- 遍历workInProgress链表，通过performUnitOfWork(workInProgress)更新workInProgress
- preformUnitOfWork 工作单元是处理更新的关键
- beginWork阶段 就在这个函数中完成，beginWork的作用是处理当前节点，然后返回它的子节点
- beginWork 会根据 workInProgress.tag 的类型用不同的函数处理不同的fiber节点
    - updateHostRoot
    - updateHostComponent
- updateHostRoot 通过 processUpdateQueue 处理 update 链表，遍历这个链表生成新的 state，然后把新的state保存在 memoizedState 上
- memoizedState 保存的是一个 element 属性，上面是子元素列表
- 接下来用 reconcileChildren 来处理这些子节点
    - mountChildFibers
    - reconcileChildFibers -> reconcileSingleElement -> createFiberFromElement -> createFiberFromTypeAndProps -> createFiber


## 提交阶段
- commitWork
