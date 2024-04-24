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

## 提交阶段
- commitWork
