// 全局变量，存储当前的 effect
let activeEffect: ReactiveEffect

class ReactiveEffect {
  _fn: Function

  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    // 更新全局的 activeEffect
    activeEffect = this
    // 执行 fn 函数
    return this._fn()
  }
}

// 存储 target 和 key 对应的 effect 集合
let targetMap = new Map()

export function track(target: any, key: string | Symbol) {
  // 如果没有 activeEffect，说明没有依赖收集的必要
  if (!activeEffect) return

  // 从 targetMap 中取出 depsMap
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
   }

  //  从 depsMap 中取出 dep
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  // 收集依赖
  // 这里的 dep 是一个 Set，存储着所有依赖于这个属性的 effect
  dep.add(activeEffect)
}

export function trigger(target: any, key: string| Symbol) {
  let depsMap = targetMap.get(target)
  // 如果没有 depsMap，说明没有触发依赖，直接返回
  if (!depsMap) return

  let dep = depsMap.get(key)
  // 如果没有 dep，说明没有触发依赖，直接返回
  if (!dep) return

  // 触发依赖
  dep.forEach((effect: ReactiveEffect) => {
    effect.run()
  })
}

export function effect(fn: Function) {
  // 创建一个 ReactiveEffect 实例
  const _effect = new ReactiveEffect(fn)
  // 执行 run 方法
  _effect.run()
  // 返回一个 runner 函数，调用时会执行 run 方法
  return _effect.run.bind(_effect)
}