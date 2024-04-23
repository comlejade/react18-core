# Fiber 架构 
- Fiber 架构是为了 React 为了解决性能问题和提升调度能力而引入的一种新的内容实现机制
- 它主要通过重新组织渲染过程，使React可以更有效的执行渲染任务。

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