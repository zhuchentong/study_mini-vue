import {describe, expect, it} from 'vitest'
import { reactive } from '../reactive'
import { effect } from '../effect'

describe("effect",()=>{
  it("should work",()=>{
    const user = reactive({
      age: 10
    })

    let nextAge: number = 0

    effect(()=> {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++

    expect(nextAge).toBe(12)
  })
})