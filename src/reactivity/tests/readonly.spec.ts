import { describe, expect, it, vi } from "vitest";
import { readonly } from "../reactive";

describe("readonly", () => {
  it("should work",()=>{
    console.warn = vi.fn()
    const user = readonly({
      age: 10
    })

    user.age++

    // readonly 不允许修改，否则会报错
    expect(console.warn).toBeCalled()
  })
})