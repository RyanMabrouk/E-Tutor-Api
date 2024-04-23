export const replacePaylaodPlaceholders = (
  object: object,
  payloadPlaceholderIds: { [key: string]: number | string | null },
) => {
  const objectClone = { ...object };
  for (const key in objectClone) {
    if (
      typeof objectClone[key] === 'object' &&
      !Array.isArray(objectClone[key])
    ) {
      objectClone[key] = {
        ...replacePaylaodPlaceholders(objectClone[key], payloadPlaceholderIds),
      };
    }
    if (
      typeof objectClone[key] === 'string' &&
      objectClone[key].includes(':')
    ) {
      const placeholder = payloadPlaceholderIds[objectClone[key].substring(1)];
      if (placeholder === undefined) {
        throw new Error(`Payload placeholder ${objectClone[key]} not found`);
      }
      objectClone[key] = placeholder;
    }
  }
  return objectClone;
};
