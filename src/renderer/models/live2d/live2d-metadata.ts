import { MotionModelCollection } from '@models/live2d/motion-model';

export interface Live2DMetadata {
  version: string;
  model: string;
  textures: Array<string>;
  motions: MotionModelCollection;
}