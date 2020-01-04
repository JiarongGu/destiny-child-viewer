import { Live2DModel } from '@shared/models';

export interface ILive2DRepository {
  getLive2D(characterId: string, variantId: string): Promise<Live2DModel>;
}