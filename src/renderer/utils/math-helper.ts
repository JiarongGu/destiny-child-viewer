export class MathHelper {
  public static round(value: number, digits: number) {
    const offset = Math.pow(10, digits);
    return Math.round(value * offset) / offset;
  }
}