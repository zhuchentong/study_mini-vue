import { describe, expect, it } from "vitest";
import { effect } from "../effect";
import { isRef, proxyRefs, ref, unRef } from "../ref";
import { isReactive } from "../reactive";

describe("Ref",()=>{
  it("should be word",()=>{
    const obj = ref(1)
    expect(obj.value).toBe(1)
    obj.value = 2
    expect(obj.value).toBe(2)
  })

  it("should be reactive",()=>{
    const obj = ref(1)
    let dummy: number = 0
    let callcounts = 0
    effect(()=>{
      dummy = obj.value
      callcounts++
    })
    expect(dummy).toBe(1)
    obj.value = 2
    expect(dummy).toBe(2)
    expect(callcounts).toBe(2)
    obj.value = 2
    // 重复值不触发依赖
    expect(callcounts).toBe(2)
  })

  it("nested object should be word",()=>{
    const obj = ref({count: 1})
    expect(obj.value.count).toBe(1)
    obj.value.count = 2
    expect(obj.value.count).toBe(2)

    expect(isReactive(obj.value)).toBe(true)
  })

  it("isRef",()=>{
    const obj = ref(1)
    expect(isRef(obj)).toBe(true)
    expect(isRef(1)).toBe(false)
  })

  it("unRef",()=>{
    const obj = ref(1)
    expect(unRef(obj)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it("proxyRefs",()=>{
    const obj = { foo: 1, bar: ref(2) }
    const proxyObj = proxyRefs(obj)
    expect(proxyObj.foo).toBe(1) 
    expect(proxyObj.bar).toBe(2)
    expect(isRef(proxyObj.foo)).toBe(false)
    expect(isRef(obj.bar)).toBe(true)
    proxyObj.foo = 2
    expect(obj.foo).toBe(2)
    proxyObj.bar = 3
    expect(obj.bar.value).toBe(3)
  })
})