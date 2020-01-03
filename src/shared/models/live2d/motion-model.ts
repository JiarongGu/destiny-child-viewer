import { MotionType } from './motion-type.enum';

export interface MotionModel {
  file: string;
  fadeIn: number;
  fadeOut: number;
}

export type MotionModelCollection = { [key in MotionType]?: Array<MotionModel> };