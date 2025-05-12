// 全局变量，存储当前的 effect
let activeEffect: ReactiveEffect | undefined
let shouldTrack = true

class ReactiveEffect {
  active = true
  _fn: Function
  deps: Set<Set<ReactiveEffect>> = new Set()

  // scheduler 是一个函数，用于调度执行 effect
  constructor(
    fn: Function,
    public scheduler?: Function,
    public onStop?: Function
  ) {
    this._fn = fn
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    // 更新 shouldTrack 的值
    shouldTrack = true
    // 更新全局的 activeEffect
    activeEffect = this
    // 执行 fn 函数
    const result = this._fn()

    shouldTrack = false

    return result
  }

  stop() {
    if (!this.active) {
      return
    }

    if (this.onStop) {
      this.onStop()
    }

    cleanupEffectDeps(this)

    this.active = false
    shouldTrack = false

  }
}

function cleanupEffectDeps(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })

  effect.deps.clear()
}

// 存储 target 和 key 对应的 effect 集合
let targetMap = new Map()

export function track(target: any, key: string | Symbol) {
  // 如果没有 activeEffect，说明没有依赖收集的必要
  if (!isTracking()) return
  if (!activeEffect) return

  // 从 targetMap 中取出 depsMap
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  //  从 depsMap 中取出 dep
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 如果 dep 中已经有 activeEffect，
  // 说明已经收集过依赖，不需要再次收集
  if (!dep.has(activeEffect)) {
    // 收集依赖
    // 这里的 dep 是一个 Set，存储着所有依赖于这个属性的 effect
    dep.add(activeEffect)
    // 将 dep 添加到 activeEffect 的 deps 中
    // 这样做的目的是为了在 stop 方法中，能够找到所有依赖于这个属性的 effect
    activeEffect.deps.add(dep)
  }
}

export function trigger(target: any, key: string | Symbol) {
  let depsMap = targetMap.get(target)
  // 如果没有 depsMap，说明没有触发依赖，直接返回
  if (!depsMap) return

  let dep = depsMap.get(key)
  // 如果没有 dep，说明没有触发依赖，直接返回
  if (!dep) return

  // 触发依赖
  dep.forEach((effect: ReactiveEffect) => {
    // 如果 effect 有 scheduler 函数，说明需要调度执行
    // 否则直接执行 run 方法
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

export function effect(fn: Function, options: any = {}) {
  // 创建一个 ReactiveEffect 实例
  const _effect = new ReactiveEffect(
    fn,
    options?.scheduler,
    options?.onStop
  )
  // 执行 run 方法
  _effect.run()
  // 返回一个 runner 函数，调用时会执行 run 方法
  const runner: any = _effect.run.bind(_effect)
  // runner 绑定Effect实例，便于effect.stop()方法使用
  runner.effect = _effect

  return runner
}

/**
 * 停止响应式
 * @param runner 
 */
export function stop(runner: Function & { effect: ReactiveEffect }) {
  if (runner.effect) {
    runner.effect.stop()
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}