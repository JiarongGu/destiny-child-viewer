import { ChildType } from './child-type.enum';
import { ChildVariantAdditional } from './child-data-additional';

export interface ChildVariantModel extends ChildVariantAdditional {
  id: string;
  variant?: string;
  name: string;
  stars?: boolean;
  type?: ChildType;

  numMods?: number;
  numModsNSFW?: number;

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
}
