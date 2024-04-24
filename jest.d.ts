declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNullOrType: (
        received: any,
        argument: 'object' | 'number' | 'string' | 'array',
      ) => R;
    }
  }
}
