import { RenderModelCollection, BaseRenderModelCollection, RenderModel } from '@shared/models';

export interface IRenderRepository {
  listRenderModels(): Promise<RenderModelCollection>;
  getRenderModel(characterId: string, variantId: string): Promise<RenderModel>;
  getCharacterRenderModel(characterId: string): Promise<BaseRenderModelCollection>;
}
