import typedKeys from 'common/typedKeys';

interface BaseIndexableObj {
  id: number;
}

type RestrictedTable<T, E> = {
  [Key in keyof E]: E[Key] extends T ? E[Key] : never;
};

type IndexedRestrictedTable<
  ValueT extends BaseIndexableObj,
  Map extends RestrictedTable<ValueT, any>,
> = RestrictedTable<ValueT, Map> & Record<number, ValueT>;

const indexById = <
  ValueT extends BaseIndexableObj,
  Map extends RestrictedTable<ValueT, any>,
>(
  arg: Map,
): IndexedRestrictedTable<ValueT, Map> => {
  const indexedByNameAndId: IndexedRestrictedTable<ValueT, Map> = { ...arg };
  typedKeys(arg).forEach((key) => {
    const value = arg[key];

    indexedByNameAndId[value.id] = value;
  });
  return indexedByNameAndId;
};

export default indexById;
