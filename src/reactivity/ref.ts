import { hasChanged, isObject } from "../shared";
import { trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _raw_value: any;
  private _value: any;
  private dep: Set<any>
  public readonly __v_isRef = true

  constructor(public raw: any) {
    this.__v_isRef = true;
    this._raw_value = raw;
    this._value = toReactive(raw)
    // 存储依赖
    this.dep = new Set()
  }


  get value() {
    // 依赖收集
    trackEffects(this.dep)
    // 返回值
    return this._value
  }

  set value(newValue) {
    // 判断是否有变化
    if (hasChanged(newValue, this._raw_value)) {
      // 更新值
      this._raw_value = newValue;
      this._value = toReactive(newValue)
      // 触发依赖
      triggerEffects(this.dep)
    }

  }
}

export function ref(raw: any) {
  return new RefImpl(raw)
}

function toReactive(raw: any) {
  return isObject(raw) ? reactive(raw) : raw;
}

export function isRef(ref: any){
  return !!ref.__v_isRef
}

export function unRef(ref: any){
  return isRef(ref)? ref.value : ref
}

export function proxyRefs(ref: any){
  return new Proxy(ref, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if(isRef(target[key]) && !isRef(value)){
        return target[key].value = value
      }else{
        return Reflect.set(target, key, value)
      }
    }
  })
}