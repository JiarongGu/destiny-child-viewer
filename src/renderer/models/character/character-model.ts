import { MotionModelCollection } from '@models/live2d/motion-model';

export interface CharacterModel {
  version: string;
  model: string;
  textures: Array<string>;
  motions: MotionModelCollection;
}
