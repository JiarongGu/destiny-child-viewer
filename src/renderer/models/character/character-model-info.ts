import { SelectRect } from './select-rect';
import { Position } from './position';

export enum CharacterModelType {
  Live2D = 'live2d',
  MMD = 'mmd',
  PNG = 'png'
}

export enum CharacterPositionType {
  Home = 'home',
  Talk = 'talk',
  Ally = 'ally',
  Enemy = 'enemy',
  TalkZoom = 'talk_zoom',
  Drive = 'drive'
}

export enum CharacterContentType {
  None = 'none',
  AreaLeft = 'area_left',
  AreaRight = 'area_right'
}

export interface CharacterPositionModel {
  position: Position;
  scale: number;
  flip: boolean;
  not_fov_scale?: boolean;
}

export interface CharacterModelInfoCollection {
  [key: string]: CharacterLive2DInfo | CharacterPNGInfo;
}

export type CharacterPositionInfo = { [key in CharacterPositionType]: CharacterPositionModel };

export type CharacterContentInfo = { [key in CharacterContentType]?: CharacterPositionModel };

export interface CharacterLive2DInfo extends CharacterPositionInfo {
  modeltype: CharacterModelType.Live2D | CharacterModelType.MMD;
  selectRect: Array<SelectRect>;
  contents?: CharacterContentInfo;
}

export interface CharacterPNGInfo {
  modeltype: CharacterModelType.PNG;
  position: Position;
  wavePosition: Position;
  scale: number;
  waveScale: number;
  faceRect: SelectRect;
}
