export class MathHelper {
  public static round(value: number, digits: number) {
    const offset = Math.pow(10, digits);
    return Math.round(value * offset) / offset;
  }

  public static ceil(value: number, digits: number) {
    const offset = Math.pow(10, digits);
    return Math.ceil(value * offset) / offset;
  }

  public static floor(value: number, digits: number) {
    const offset = Math.pow(10, digits);
    return Math.floor(value * offset) / offset;
  }

  public static random(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start
  }
}