import { CharacterVariantAdditional } from './character-variant-additional';
import { CharacterType } from './character-type.enum';

export interface CharacterVariantModel extends CharacterVariantAdditional {
  characterId: string;
  variantId: string;
  
  name: string;
  stars?: boolean;
  type?: CharacterType;

  numMods?: number;
  numModsNSFW?: number;

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
}
