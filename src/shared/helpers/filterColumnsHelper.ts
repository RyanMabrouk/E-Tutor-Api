import { omit, pick } from 'lodash';
export function filterColumnsHelper<T extends object>({
  data,
  columnsToOmit,
  columnsToPick,
}: {
  data: T;
  columnsToOmit?: (keyof T)[];
  columnsToPick?: (keyof T)[];
}): Partial<T> {
  let clonedData: Partial<T> = { ...data };
  if (columnsToOmit) {
    clonedData = omit(clonedData, columnsToOmit) as Partial<T>;
  }
  if (columnsToPick) {
    clonedData = pick(clonedData, columnsToPick);
  }
  return clonedData;
}
