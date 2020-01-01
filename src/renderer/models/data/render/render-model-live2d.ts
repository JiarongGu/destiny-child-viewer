import { RenderModelType, RenderModelContentType, RenderModelPositionType } from './enums';
import { RenderModelPosition, RenderModelInfo, RenderModelRect } from './models';

type RenderModelLive2DBase = { [key in RenderModelPositionType]?: RenderModelInfo };

export interface RenderModelLive2D extends RenderModelLive2DBase {
  modeltype: RenderModelType.Live2D | RenderModelType.MMD;
  selectRect: Array<RenderModelRect>;
  contents?: { [key in RenderModelContentType]?: RenderModelInfo };
  position?: RenderModelPosition;
  wavePosition?: RenderModelPosition;
  scale?: number;
  waveScale?: number;
}