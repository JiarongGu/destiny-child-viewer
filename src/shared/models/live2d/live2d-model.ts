import { Live2DMetadata } from './live2d-metadata';
import { TextureModel } from './texture-model';
import { MotionModelCollection } from './motion-model';

export interface Live2DModel {
  metadata: Live2DMetadata;
  modelPath: string;
  textures: Array<TextureModel>;
  motions: MotionModelCollection;
}