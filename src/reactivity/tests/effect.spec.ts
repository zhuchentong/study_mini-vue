import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactive'
import { effect } from '../effect'

describe("effect", () => {
  it("should work", () => {
    const user = reactive({
      age: 10
    })

    let nextAge: number = 0

    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++

    expect(nextAge).toBe(12)
  })

  it("should return runner when call effect", () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return "foo"
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })

  it("scheduler", () => {
    let dummy: number = 0
    let run: any

    const scheduler = vi.fn(() => {
      run = runner
    })

    const obj = reactive({ foo: 1 })

    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })

    expect(dummy).toBe(1)
    expect(scheduler).not.toHaveBeenCalled()

    obj.foo++
    expect(dummy).toBe(1)
    expect(scheduler).toHaveBeenCalledTimes(1)
  
    run()
    expect(dummy).toBe(2)
  })
})