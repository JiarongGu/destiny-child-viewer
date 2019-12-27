import { PositionType, Position } from '@models/position';

export interface ChildVariant {
  title: string;
  positions: { [key in PositionType]: Position };
}
