import { MotionRaw } from './motion-raw';
import { MotionType } from './motion-type.enum';

export interface Live2DMetadata {
  version: string;
  model: string;
  textures: Array<string>;
  motions: { [key in MotionType]?: Array<MotionRaw> };
}
