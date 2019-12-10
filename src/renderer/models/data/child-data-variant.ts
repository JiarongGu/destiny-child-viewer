import { PositionType, Position } from '@models/position';

export interface ChildDataVariant {
  title: string;
  positions: { [key in PositionType]: Position };
}
