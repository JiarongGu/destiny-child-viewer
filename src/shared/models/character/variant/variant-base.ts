import { RenderModelPositionType } from '@shared/models';
import { VariantPosition } from './variant-position';

export interface VariantBase {
  title?: string;
  positions: { [key in RenderModelPositionType]?: VariantPosition };
}
