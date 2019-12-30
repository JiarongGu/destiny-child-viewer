import { CharacterVariant } from './character-variant';

export interface CharacterVariantAdditional extends CharacterVariant {
  icon?: {
    regular: string;
    battle: string;
    spa: string;
  }
}