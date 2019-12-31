import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services/path-service';
import { BaseRenderModelCollection, RenderModel, RenderModelCollection } from '@models/data';
import { reduceKeys, getCacheContext, reduceMap } from '@utils';

import { AssetFiles } from '../common';
import { memorizeAsync } from '@decorators';

export class RenderModelRepository {
  public static cacheName = 'render-model-repository';

  private readonly _modelAdapter: lowdb.AdapterAsync<BaseRenderModelCollection>;

  constructor() {
    this._modelAdapter = new FileAsync(new PathService().getAssetPath(AssetFiles.LIVE2D_MODEL_INFO));
  }

  @memorizeAsync(getCacheContext(RenderModelRepository.cacheName))
  public async listRenderModels(): Promise<RenderModelCollection> {
    const models = (await this.modelLowdb).value();
    const modelKeys = Object.keys(models);

    const characterIds = modelKeys.map(modelKey => {
      const ids = modelKey.split('_');
      const characterId = ids[0];
      const variantId = ids[1];
      return { characterId, variantId, modelKey };
    })

    const characterGroups = _.groupBy(characterIds, (ids => ids.characterId));
    const characterInfos = reduceKeys(Object.keys(characterGroups), key => {
      const characterGroup = characterGroups[key];
      return reduceMap(characterGroup, group => group.variantId, group => models[group.modelKey])
    });
    return characterInfos;
  }

  @memorizeAsync(getCacheContext(RenderModelRepository.cacheName))
  public async getRenderModel(characterId: string, variantId: string): Promise<RenderModel> {
    const modelKey = `${characterId}_${variantId}`;
    return (await this.modelLowdb).get(modelKey).value();
  }

  @memorizeAsync(getCacheContext(RenderModelRepository.cacheName))
  public async getCharacterRenderModel(characterId: string) {
    const models = await this.listRenderModels();
    return models[characterId];
  }

  private get modelLowdb() {
    return lowdb(this._modelAdapter);
  }
}
