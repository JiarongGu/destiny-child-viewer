import { RenderModelPositionType, RenderModelPosition } from '@models/data';

export interface CharacterVariant {
  title: string;
  positions: { [key in RenderModelPositionType]: RenderModelPosition };
}
