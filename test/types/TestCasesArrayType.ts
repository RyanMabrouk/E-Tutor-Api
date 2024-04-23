export type TestCasesArrayType = {
  it: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  path?: string;
  send?: object;
  expectedStatus: number;
  expectedResponse?: (res: any) => void;
  public?: boolean;
}[];
