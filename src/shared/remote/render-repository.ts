import { RenderModelCollection, BaseRenderModelCollection, RenderModel } from '@shared/models';

export interface IRenderRepository {
  getCollection(): Promise<RenderModelCollection>;
  getRender(characterId: string, variantId: string): Promise<RenderModel>;
  getRendersByCharacterId(characterId: string): Promise<BaseRenderModelCollection>;
}
