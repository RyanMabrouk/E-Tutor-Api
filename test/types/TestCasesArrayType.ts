export type TestCasesArrayType = {
  describe: string;
  testCases: {
    it: string;
    method: 'get' | 'post' | 'patch' | 'delete';
    expect: number;
    expectResponse?: (res: any) => void;
  }[];
}[];
