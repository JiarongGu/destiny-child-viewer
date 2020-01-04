import { CharacterType } from './character-type.enum';
import { VariantModel } from './variant';

export interface CharacterVariantModel extends VariantModel {
  characterId: string;
  variantId: string;
  type?: CharacterType;
  stars?: boolean;
}