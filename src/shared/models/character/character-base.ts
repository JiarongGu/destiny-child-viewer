import { CharacterType } from './character-type.enum';
import { VariantBase } from './variant';

export interface CharacterBase {
  id: string;
  name: string;
  numMods: number;
  numModsNSFW: number;
  stars?: boolean;
  variants: { [key: string]: VariantBase };

  tierBoss?: number;
  tierPVE?: number;
  tierPVP?: number;
  tierRaid?: number;
  type?: CharacterType;
}