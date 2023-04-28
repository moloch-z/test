import { get, set } from 'lodash-unified'
import type { Entries } from 'type-fest'
import type { Arrayable, DeepMerge, DeepMergeArray } from '.'
import { isObject, isArray, hasOwnProperty, hasSameKey } from './types'

export const keysOf = <T extends object>(arr: T) => Object.keys(arr) as Array<keyof T>
export const entriesOf = <T extends object>(arr: T) => Object.entries(arr) as Entries<T>

export const getProp = <T = any>(obj: Record<string, any>, path: Arrayable<string>, defaultValue?: any): { value: T } => {
  return {
    get value() {
      return get(obj, path, defaultValue)
    },
    set value(val: any) {
      set(obj, path, val)
    }
  }
}

export function deepMerge<T, U>(src: T, target: U): DeepMerge<T, U>
export function deepMerge<T, U>(src: T, target: U, concatArray: boolean): DeepMerge<T, U>
export function deepMerge<T, U>(src: T, target: U, concatArray: true): DeepMergeArray<T, U>

/**
 *  deep merge object
 *
 * @param {object} src 原对象
 * @param {object} target 目标对象
 * @param {boolean} concatArray 是否连接数组
 * @returns {object} src & target
 */
export function deepMerge<T, U>(src: T, target: U, concatArray = false): DeepMerge<T, U> {
  const res = src as DeepMerge<T, U>

  if (isObject(target) && isObject(src)) {
    for (const key in target) {
      if (hasOwnProperty(res, key)) {
        if (hasSameKey(res, target, key)) {
          const a = res[key]
          const b = target[key]
          if (isObject(b) && isObject(a)) {
            ;(res[key] as unknown) = deepMerge(a, b)
          } else {
            if (concatArray && isArray(b) && isArray(a)) {
              ;(res[key] as unknown) = [...a, ...b]
            } else (res[key] as unknown) = b
          }
        } else {
          res[key] = target[key]
        }
      } else {
        res[key] = target[key]
      }
    }
  }
  return res
}
