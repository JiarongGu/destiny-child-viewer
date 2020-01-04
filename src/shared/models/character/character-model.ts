import { CharacterBase } from './character-base';
import { CharacterStatic } from './character-static';
import { VariantModel } from './variant';

export interface CharacterModel extends Omit<CharacterBase, 'variants'>, Omit<CharacterStatic, 'variants'> {
  variants: {
    [key: string]: VariantModel
  }
}