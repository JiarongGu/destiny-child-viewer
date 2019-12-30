import { RenderModelPosition } from './render-model-position';

export interface RenderModelInfo {
  position: RenderModelPosition;
  scale: number;
  flip: boolean;
  not_fov_scale?: boolean;
}