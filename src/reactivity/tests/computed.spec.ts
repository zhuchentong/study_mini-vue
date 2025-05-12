import { describe, expect, it, vi } from "vitest";
import { computed } from "../computed";
import { ref } from "../ref";

describe("computed", () => {
  it("should work", () => {
    const a = ref(1)
    const b = computed(() => a.value + 1)
    expect(b.value).toBe(2)
    a.value = 2
    expect(b.value).toBe(3)
  })


  it("should lazy", () => {
    const a = ref(1)
    const fn = vi.fn(() => {
      return a.value + 1;
    })

    const b = computed(fn)

    expect(fn).not.toBeCalled()
    expect(b.value).toBe(2)
    expect(fn).toBeCalledTimes(1)
  })

  it("should cache value", () => {
    const a = ref(1)
    const fn = vi.fn(() => {
      return a.value + 1;
    })
    const b = computed(fn)

    expect(b.value).toBe(2)
    expect(fn).toBeCalledTimes(1)

    a.value = 2

    expect(b.value).toBe(3)
    expect(fn).toBeCalledTimes(2)
    
    expect(b.value).toBe(3)
    expect(fn).toBeCalledTimes(2)
  })
})