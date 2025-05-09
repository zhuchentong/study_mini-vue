import {describe, expect, it} from 'vitest'
import { isReactive, reactive } from '../reactive'

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
})