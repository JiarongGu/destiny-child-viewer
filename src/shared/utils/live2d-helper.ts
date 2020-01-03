import { MathHelper } from './math-helper';

export class Live2DHelper {
  private static readonly ACCURACY = 3;
  private static readonly PERCENTAGE_ACCURACY = 1;

  public static percentage(actualValue: number) {
    return MathHelper.round(MathHelper.round(actualValue, this.ACCURACY) * 100, this.PERCENTAGE_ACCURACY);
  }

  public static actual(percentageValue: number) {
    return MathHelper.round(percentageValue / 100, this.ACCURACY);
  }

  public static round(value: number) {
    return MathHelper.round(value, this.ACCURACY);
  }
}