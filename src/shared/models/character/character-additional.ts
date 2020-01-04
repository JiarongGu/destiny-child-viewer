import { CharacterStatic } from './character-static';
import { CharacterBase } from './character-base';
import { VariantAdditional } from './variant';


export interface CharacterAdditional extends Omit<Partial<CharacterBase>, 'variants'>, Omit<Partial<CharacterStatic>, 'variants'> {
  variants: {
    [key: string]: VariantAdditional
  }
}