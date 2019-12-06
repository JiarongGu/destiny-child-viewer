export function generateId() {
  const part1 = Date.now().toString(32);
  const part2 = Math.random()
    .toString(32)
    .replace('0.', '');
  return `${part1}${part2}`.toUpperCase();
}
