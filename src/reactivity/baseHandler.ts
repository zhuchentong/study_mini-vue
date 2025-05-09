import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(readonly = false) {
  return function get(target: any, key: string) {
    const result = Reflect.get(target, key)
    // 依赖收集
    if (!readonly) {
      track(target, key)
    }
    return result
  }
}


function createSetter() {
  return function set(target: any, key: string, value: any) {
    const result = Reflect.set(target, key, value)

    // 触发依赖
    trigger(target, key)

    return result
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target: any, key: string, value: any) {
    console.warn(`not allow call set function on readonly object`)
    return true
  } 
}