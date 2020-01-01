import { RenderModelType } from './enums';

import { RenderModelRect, RenderModelPosition } from './models';

export interface RenderModelPNG {
  modeltype: RenderModelType.PNG;
  position: RenderModelPosition;
  wavePosition: RenderModelPosition;
  scale: number;
  waveScale: number;
  faceRect: RenderModelRect;
}
