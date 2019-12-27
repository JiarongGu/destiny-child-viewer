import { MotionType } from './motion-type.enum';

export interface MotionData {
  fadeIn: number;
  fadeOut: number;
  fileBytes: ArrayBuffer;
}

export type MotionDataCollection = { [key in MotionType]?: Array<MotionData> };
