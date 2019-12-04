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

export interface CharacterMeta {
  version: string;
  model: string;
  textures: Array<string>;
  motions: {
    [key in MotionType]: Array<MotionModel>;
  };
}
