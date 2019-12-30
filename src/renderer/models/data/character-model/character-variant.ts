import { RenderModelPositionType } from '@models/data';
import { CharacterVariantPosition } from './character-variant-position';

export interface CharacterVariant {
  title: string;
  positions: { [key in RenderModelPositionType]: CharacterVariantPosition };
}
