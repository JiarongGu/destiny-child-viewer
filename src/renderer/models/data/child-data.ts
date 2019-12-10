import { ChildType } from './child-type.enum';
import { ChildDataVariant } from './child-data-variant';

export interface ChildData {
  id: string;
  name: string;
  numMods: number;
  numModsNSFW: number;
  stars?: boolean;
  variants: { [key: string]: ChildDataVariant };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: ChildType;
}
