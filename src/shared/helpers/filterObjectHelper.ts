import { omit, pick } from 'lodash';
export function filterObjectHelper<T extends object>({
  data,
  Omit,
  Pick,
}: {
  data: T;
  Omit?: (keyof T)[];
  Pick?: (keyof T)[];
}): Partial<T> {
  let clonedData: Partial<T> = { ...data };
  if (Omit) {
    clonedData = omit(clonedData, Omit) as Partial<T>;
  }
  if (Pick) {
    clonedData = pick(clonedData, Pick);
  }
  return clonedData;
}
