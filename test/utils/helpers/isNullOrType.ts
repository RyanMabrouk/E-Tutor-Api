export const isNullOrType = (
  received: any,
  argument: 'object' | 'number' | 'string' | 'array',
) => {
  if (received === null) {
    return {
      message: () => `expected ${received} not to be null`,
      pass: true,
    };
  }
  if (argument === 'array' && Array.isArray(received)) {
    return {
      message: () => `expected ${received} not to be an array`,
      pass: true,
    };
  } else if (typeof received === argument) {
    return {
      message: () => `expected ${received} not to be type ${argument}`,
      pass: true,
    };
  }
  return {
    message: () => `expected ${received} to be null or type ${argument}`,
    pass: false,
  };
};
