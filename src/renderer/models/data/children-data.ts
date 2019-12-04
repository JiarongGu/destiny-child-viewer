import { PositionType, Position } from '@models/position';

export enum ChildType {
  Attacker = 'attacker',
  Support = 'support',
  Tank = 'tank'
}

export interface ChildInfo {
  id: string;
  name: string;
  numMods: number;
  numModsNSFW: number;
  stars?: boolean;
  variants: { [key: string]: ChildInfoVariant };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: ChildType;
}

export interface ChildInfoVariant {
  title: string;
  positions: { [key in PositionType]: Position };
}

export interface ChildrenData {
  [key: string]: ChildInfo;
}
