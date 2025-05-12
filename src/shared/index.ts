export function isObject(value: any): boolean {
  return typeof value === "object" && value !== null
}

export const extend = Object.assign

export function hasChanged(value: any, oldValue: any): boolean {
  return !Object.is(value, oldValue)
}