import { CharacterFavor } from './character-favor';
import { CharacterVoice } from './character-voice';
import { VariantStatic } from './variant';

export interface CharacterStatic {
  voices?: CharacterVoice;
  favors: CharacterFavor;
  variants: {
    [key: string]: VariantStatic
  }
}