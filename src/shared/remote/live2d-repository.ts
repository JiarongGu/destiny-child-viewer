import { Live2DModel } from '@shared/models';

export interface ILive2DRepository {
  getData(characterId: string, variantId: string): Promise<Live2DModel>;
}