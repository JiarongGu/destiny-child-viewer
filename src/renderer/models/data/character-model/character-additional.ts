import { CharacterVariantAdditional } from './character-variant-additional';
import { CharacterType } from './character-type.enum';

export interface CharacterAdditional {
  id: string;
  name?: string;
  numMods?: number;
  numModsNSFW?: number;
  stars?: boolean;
  variants?: { [key: string]: CharacterVariantAdditional };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: CharacterType;
}
