import { MotionType } from '@shared/models';

export interface MotionData {
  fadeIn: number;
  fadeOut: number;
  fileBytes: ArrayBuffer;
}

export type MotionDataCollection = { [key in MotionType]?: Array<MotionData> };
