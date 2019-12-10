import { PositionType, Position } from '@models/position';

import { ChildType } from './child-type.enum';

export interface ChildDataModel {
  id: string;
  variant?: string;
  name: string;
  title: string;
  stars?: boolean;
  type?: ChildType;
  positions: { [key in PositionType]: Position };

  numMods?: number;
  numModsNSFW?: number;

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
}
