export const mutable = <T extends readonly any[] | Record<string, unknown>>(val: T) => val as Mutable<typeof val>
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

export type HTMLElementCustomized<T> = HTMLElement & T

/**
 * @deprecated stop to use null
 * @see {@link https://github.com/sindresorhus/meta/discussions/7}
 */
export type Nullable<T> = T | null

export type Arrayable<T> = T | T[]
export type Awaitable<T> = Promise<T> | T

export type MergeObject<A, B, C = B> = A extends object ? (B extends object ? DeepMerge<A, B> : B) : C
export type DeepMerge<A, B> = { [AK in keyof A]: A[AK] } & { [BK in keyof B]: B[BK] } & {
  [P in keyof A & keyof B]: MergeObject<A[P], B[P]>
}
export type ConcatArray<A, B> = A extends Array<infer AK> ? (B extends Array<infer BK> ? Array<AK & BK> : B) : B
export type DeepMergeArray<A, B> = { [AK in keyof A]: A[AK] } & { [BK in keyof B]: B[BK] } & {
  [P in keyof A & keyof B]: MergeObject<A[P], B[P], ConcatArray<A[P], B[P]>>
}
