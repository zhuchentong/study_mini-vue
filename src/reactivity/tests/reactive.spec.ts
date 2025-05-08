import {describe, expect, it} from 'vitest'
import { reactive } from '../reactive'

describe("reactive",()=>{
  it("should work",()=>{
    const originObject = {
      foo: 1,
    }

    const reactiveObject = reactive(originObject)

    expect(reactiveObject).not.toBe(originObject)
    expect(reactiveObject.foo).toBe(1)
  })
})