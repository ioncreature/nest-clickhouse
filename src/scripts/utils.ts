export function parseCli(argv: string[]): Record<string, string> {
  const result = {};
  for (const item of argv) {
    const [k, v] = item.split('=', 2);
    result[k.replace(/-/g, '').trim()] = v;
  }
  return result;
}
