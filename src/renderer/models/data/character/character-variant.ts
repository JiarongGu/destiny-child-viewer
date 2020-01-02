import { RenderModelPositionType } from '@models/data';
import { CharacterVariantPosition } from './character-variant-position';

export interface CharacterVariant {
  name?: string;
  title?: string;
  description?: string;
  positions: { [key in RenderModelPositionType]: CharacterVariantPosition };
}
