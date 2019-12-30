import { CharacterType } from './character-type.enum';
import { CharacterVariant } from './character-variant';

export interface CharacterVariantModel extends CharacterVariant {
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
