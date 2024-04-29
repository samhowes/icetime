import {Key} from "@lib/reflection";

export declare type Obj<T> = { [id: string]: T }
export declare type ObjPair<T> = { key: string, value: T }

export class ObjMaps {
  static getOrSet<T>(obj: Obj<T>, key: string, valueFunc: T): T
  static getOrSet<T>(obj: Obj<T>, key: string, valueFunc: () => T): T {
    let val = obj[key]
    if (!val) {
      if (typeof valueFunc === 'function') {
        val = valueFunc()
      } else {
        val = valueFunc
      }
      obj[key] = val
    }
    return val
  }

  static values<T>(nodes: Obj<T>): Array<T> {
    return Object.getOwnPropertyNames(nodes).map(it => nodes[it]).filter(it => !!it);
  }

  static keys<T>(nodes: Obj<T>): string[] {
    return Object.getOwnPropertyNames(nodes);
  }

  static props<T>(obj: T): Key<T>[] {
    return Object.getOwnPropertyNames(obj) as Key<T>[]
  }

  static entries<T>(obj: Obj<T>): Array<ObjPair<T>> {
    return this.keys(obj).map(k => {
      return {key: k, value: obj[k]}
    })
  }

  static get(obj: Obj<any>, key: string) {
    if (!obj) return undefined
    return obj[key]
  }

  static clear(map: Obj<any>) {
    for (const key of ObjMaps.keys(map)) {
      delete map[key]
    }
  }

  static clean(map: Obj<any>) {
    for (const entry of this.entries(map)) {
      if (entry.value === undefined) {
        delete map[entry.key]
      }
    }
  }

  static copyValues<T>(to:Obj<any>, from: Obj<any>): T {
    for (const key of this.keys(to)) {
      if (typeof to[key] === 'function') continue
      to[key] = from[key]
    }
    return to as unknown as T
  }

  static deleteKeys<T>(obj: T, ...keys: KeyOf<T>[]) {
    for (const key of keys) {
      delete obj[key]
    }
  }

  static valueKeys<T>(obj: Obj<any>) {
    return this.keys(obj).filter(k => typeof obj[k] !== 'function')
  }

  static isEmpty(children: Obj<any>) {
    for (const key in children) {
      return false
    }
    return true
  }
}

export declare type KeyOf<T> = keyof T
