export enum MotionType {
  Attack = 'attack',
  Hit = 'hit',
  Idle = 'idle'
}

export interface MotionModel {
  file: string;
  fade_in: number;
  fade_out: number;
}

export interface MotionData {
  fadeIn: number;
  fadeOut: number;
  fileBytes: ArrayBuffer;
}

export type MotionModelCollection = { [key in MotionType]?: Array<MotionModel> };

export type MotionDataCollection = { [key in MotionType]?: Array<MotionData> };

export type Live2DMotionCollection = { [key in MotionType]?: Array<Live2DMotion> };
