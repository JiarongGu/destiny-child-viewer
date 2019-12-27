import { MotionDataCollection } from './motion-data';
import { Live2DMetadata } from './live2d-metadata';
import { TextureModel } from './texture-model';

export interface Live2DData {
  metadata: Live2DMetadata;
  model: ArrayBuffer;
  textures: Array<TextureModel>;
  motions: MotionDataCollection;
}