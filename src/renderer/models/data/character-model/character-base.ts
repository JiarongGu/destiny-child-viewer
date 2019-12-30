import { CharacterType } from './character-type.enum';
import { CharacterVariant } from './character-variant';

export interface CharacterBase {
  id: string;
  name: string;
  numMods: number;
  numModsNSFW: number;
  stars?: boolean;
  variants: { [key: string]: CharacterVariant };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: CharacterType;
}