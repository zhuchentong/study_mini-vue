import { mutableHandlers, readonlyHandlers ,shadowReadonlyHandlers} from "./baseHandler"

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 是否是 reactive 对象
  IS_READONLY = "__v_isReadonly" // 是否是 readonly 对象
}

export function reactive(raw: Record<string, any>): any {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw: Record<string, any>): any {
  return createActiveObject(raw, readonlyHandlers)
}

export function shadowReadonly(raw: Record<string, any>): any {
  return createActiveObject(raw, shadowReadonlyHandlers) 
}

function createActiveObject(raw: Record<string, any>, baseHandlers: ProxyHandler<any>){
  return new Proxy(raw, baseHandlers)
}


export function isReactive(value: any): boolean {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: any): boolean {
  return!!value[ReactiveFlags.IS_READONLY] 
}

export function isProxy(value: any): boolean{
  return isReactive(value) || isReadonly(value)
}
