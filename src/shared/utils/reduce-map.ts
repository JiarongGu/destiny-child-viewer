type ReduceMapResult<K extends string | number, T> = { [key in K]: T };

export function reduceMap<V, T, K extends string | number = string>(
  array: Array<V>,
  selectKey: (value: V, index: number) => K,
  selectValue: (value: V, index: number) => T
): ReduceMapResult<K, T> {
  return array.reduce((accumulate, element, index) => {
    const key = selectKey(element, index);
    const value = selectValue(element, index);
    accumulate[key] = value;
    return accumulate;
  }, {} as ReduceMapResult<K, T>);
}

export async function reduceMapAsync<V, T, K extends string | number = string>(
  array: Array<V>,
  selectKey: (value: V, index: number) => K,
  selectValue: (value: V, index: number) => Promise<T>
): Promise<ReduceMapResult<K, T>> {
  const keys = array.map(selectKey);
  const values = await Promise.all(array.map(selectValue));

  return keys.reduce((accumulate, key, index) => {
    accumulate[key] = values[index];
    return accumulate;
  }, {} as ReduceMapResult<K, T>);
}