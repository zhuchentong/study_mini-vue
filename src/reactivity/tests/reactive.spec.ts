import {describe, expect, it, vi} from 'vitest'
import { isReactive, isReadonly, reactive, readonly, shadowReadonly } from '../reactive'

describe("reactive",()=>{
  it("should work",()=>{
    const originObject = {
      foo: 1,
    }

    const reactiveObject = reactive(originObject)

    expect(reactiveObject).not.toBe(originObject)
    expect(reactiveObject.foo).toBe(1)
  })

  it("isReactive",()=>{
    const reactiveObject = reactive({foo: 1})
    expect(isReactive(reactiveObject)).toBe(true)
    expect(isReactive({foo: 1})).toBe(false)
  })

  it("should work",()=>{
    console.warn = vi.fn()
    const user = readonly({
      age: 10
    })

    user.age++

    // readonly 不允许修改，否则会报错
    expect(console.warn).toBeCalled()
  })

  it("isReadonly", () => {
    const user = readonly({
      age: 10
    })

    expect(user).not.toBe({age: 10})
    expect(isReadonly(user)).toBe(true)
    expect(isReadonly({age: 10})).toBe(false)
  })

  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{bar: 2}]
    }

    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(original.array)).toBe(false)
    expect(isReactive(original.nested)).toBe(false)
  })

  it("nested readonly", () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{bar: 2}]
    }

    const observed = readonly(original)
    expect(isReadonly(observed.nested)).toBe(true)
    expect(isReadonly(observed.array)).toBe(true)
    expect(isReadonly(original.array)).toBe(false)
    expect(isReadonly(original.nested)).toBe(false)
  })

  it("shadow readonly",()=>{
    const original = {foo: {a:1}} as const
    const observed = shadowReadonly(original)

    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.foo)).toBe(false)
  })
})