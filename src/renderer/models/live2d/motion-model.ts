import { MotionType } from './motion-type.enum';

export interface MotionModel {
  file: string;
  fade_in: number;
  fade_out: number;
}

export type MotionModelCollection = { [key in MotionType]?: Array<MotionModel> };

export type Live2DMotionCollection = { [key in MotionType]?: Array<Live2DMotion> };
