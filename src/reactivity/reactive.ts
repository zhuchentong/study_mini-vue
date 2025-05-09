import { mutableHandlers, readonlyHandlers } from "./baseHandler"

export function reactive(raw: Record<string, any>): any {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw: Record<string, any>): any {
  return createActiveObject(raw, readonlyHandlers)
}


function createActiveObject(raw: Record<string, any>, baseHandlers: ProxyHandler<any>){
  return new Proxy(raw, baseHandlers)
}