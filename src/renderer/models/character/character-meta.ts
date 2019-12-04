import { MotionModelCollection } from '@models/live2d/motion-model';

export interface CharacterMeta {
  version: string;
  model: string;
  textures: Array<string>;
  motions: MotionModelCollection;
}
