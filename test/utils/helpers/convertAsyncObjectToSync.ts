export const convertAsyncObjectToSync = async (
  cookies: string,
  asyncObject?: {
    [key: string]: (cookies: string) => Promise<number | string | null>;
  },
): Promise<{ [key: string]: number | string | null }> => {
  if (!asyncObject) return {};
  const syncObject: { [key: string]: number | string | null } = {};

  for (const key in asyncObject) {
    syncObject[key] = await asyncObject[key](cookies);
  }

  return syncObject;
};
