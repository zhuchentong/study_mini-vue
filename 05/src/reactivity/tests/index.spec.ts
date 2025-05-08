import {expect, it} from 'vitest'
import {add} from '../index'

it('should pass', () => {
  expect(1).toBe(1)
})

it('should add pass', () => {
  expect(add(1, 2)).toBe(3) 
})

it('should add fail', () => {
 expect(add(1, 2)).not.toBe(4)
})
