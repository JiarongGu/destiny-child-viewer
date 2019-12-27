import { ChildType } from './child-type.enum';
import { ChildVariant } from './child-variant';

export interface ChildVariantAdditional extends ChildVariant {
  icon?: {
    regular: string;
    battle: string;
    spa: string;
  }
}

export interface ChildDataAdditional {
  id: string;
  name?: string;
  numMods?: number;
  numModsNSFW?: number;
  stars?: boolean;
  variants?: { [key: string]: ChildVariantAdditional };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: ChildType;
}
