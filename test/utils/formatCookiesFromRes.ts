export function formatCookiesFromRes(cookies: string[]) {
  return cookies.reduce(
    (acc, c) => acc + c.substring(0, c.indexOf(' ') + 1),
    '',
  );
}
