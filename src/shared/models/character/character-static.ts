import { VariantStatic } from './variant';
import { CharacterVoiceCollection } from './character-voice-collection';

export interface CharacterStatic {
  name: string;
  voices?: CharacterVoiceCollection;

  variants: {
    [key: string]: VariantStatic
  }
}