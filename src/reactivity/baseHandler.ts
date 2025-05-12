import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { ReactiveFlags,readonly,reactive } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shadowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShadow = false) {
  return function get(target: any, key: string) {
    if(key === ReactiveFlags.IS_REACTIVE) {
     return !isReadonly 
    }

    if(key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const result = Reflect.get(target, key)

    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }

    if(isShadow){
      return result
    }

    if(isObject(result)){
      return isReadonly ? readonly(result) : reactive(result)
    }else{
      return result
    }
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

export const shadowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shadowReadonlyGet,
})