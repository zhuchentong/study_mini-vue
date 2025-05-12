import { ReactiveEffect } from "./effect";

class ComputeRefImpl {
  private _dirty: boolean;
  private _value: undefined;
  private effect: ReactiveEffect;

  constructor(getter: Function) {
    this._dirty = true; // 默认取值时是脏的
    this._value = undefined; // 缓存值

    // 利用 effect 来实现计算属性的缓存
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        // 标记为脏的
        this._dirty = true;
      }
    });
  }

  get value() {
    if(this._dirty){
      this._value = this.effect.run() // 执行 getter 函数，返回值就是计算属性的值
      this._dirty = false; // 标记为不脏的 
    } 

    return this._value
  }
} 

export function computed(getter: Function) {
  return new ComputeRefImpl(getter)
}