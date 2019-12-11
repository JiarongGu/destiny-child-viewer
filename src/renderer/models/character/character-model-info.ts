import { SelectRect } from './select-rect';
import { BasePosition, PositionType } from '@models/position';

export enum CharacterModelType {
  Live2D = 'live2d',
  MMD = 'mmd',
  PNG = 'png'
}

export enum CharacterContentType {
  None = 'none',
  AreaLeft = 'area_left',
  AreaRight = 'area_right'
}

export interface CharacterPositionModel {
  position: BasePosition;
  scale: number;
  flip: boolean;
  not_fov_scale?: boolean;
}

export interface CharacterModelInfoCollection {
  [key: string]: CharacterLive2DInfo | CharacterPNGInfo;
}

export type CharacterPositionInfo = { [key in PositionType]: CharacterPositionModel };

export type CharacterContentInfo = { [key in CharacterContentType]?: CharacterPositionModel };

export interface CharacterLive2DInfo extends CharacterPositionInfo {
  modeltype: CharacterModelType.Live2D | CharacterModelType.MMD;
  selectRect: Array<SelectRect>;
  contents?: CharacterContentInfo;
  position?: BasePosition;
  wavePosition?: BasePosition;
  scale?: number;
  waveScale?: number;
}

export interface CharacterPNGInfo {
  modeltype: CharacterModelType.PNG;
  position: Position;
  wavePosition: Position;
  scale: number;
  waveScale: number;
  faceRect: SelectRect;
}
