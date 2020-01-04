import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import {
  BaseRenderModelCollection,
  RenderModel,
  RenderModelCollection,
  reduceKeys,
  reduceMap,
} from '@shared';
import { IRenderRepository } from '@shared/remote';
import { FileLocator } from '../common';

export class RenderRepository implements IRenderRepository {
  private readonly _modelAdapter: lowdb.AdapterAsync<BaseRenderModelCollection>;

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.RENDER_MODEL_INFO);
  }

  public async getCollection(): Promise<RenderModelCollection> {
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

  public async getRender(characterId: string, variantId: string): Promise<RenderModel> {
    const modelKey = `${characterId}_${variantId}`;
    return (await this.modelLowdb).get(modelKey).value();
  }

  public async getRendersByCharacterId(characterId: string) {
    const models = await this.getCollection();
    return models[characterId];
  }

  private get modelLowdb() {
    return lowdb(this._modelAdapter);
  }
}
