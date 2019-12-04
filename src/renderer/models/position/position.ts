export enum PositionType {
  Home = 'home',
  Talk = 'talk',
  Ally = 'ally',
  Enemy = 'enemy',
  TalkZoom = 'talk_zoom',
  Drive = 'drive'
}

export interface BasePosition {
  x: number;
  y: number;
}

export interface Position extends BasePosition {
  x: number;
  y: number;
  scale: number;
}
