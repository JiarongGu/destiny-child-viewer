import * as _ from 'lodash';

import { PathService } from '@services';
import { RenderModelRepository } from '@repositories';
import { FileHelper, reduceMap, reduceKeys, FileStatsCollection } from '@utils';
import { RenderModelCollection, BaseRenderModelCollection, RenderModelType, IconModelCollection } from '@models/data';

import { AssetFiles } from '../common';

interface CharacterFolderInfo {
  characterId: string;
  variants: BaseRenderModelCollection;
  folderId: string;
}

interface VariantFolderInfo {
  characterId: string;
  folderId: string;
  variantIds: Array<string>;
}

interface IconInfo {
  characterId: string;
  folderId: string;
  variantId: string;
  fileId: number;
}

export class IconCollectionInitializer {
  private readonly _renderModelRepository: RenderModelRepository;

  private readonly _pathService = new PathService();

  private readonly _homeIconDirectory: string;
  private readonly _battleIconDirectory: string;
  private readonly _spaIconDirectory: string;

  constructor() {
    this._pathService = new PathService();
    this._homeIconDirectory = this._pathService.getAssetPath(AssetFiles.PORTRAIT_ICON_DIRECTORY);
    this._battleIconDirectory = this._pathService.getAssetPath(AssetFiles.BATTLE_ICON_DIRECTORY);
    this._spaIconDirectory = this._pathService.getAssetPath(AssetFiles.SPA_ICON_DIRECTORY);

    this._renderModelRepository = new RenderModelRepository;
  }

  public async createDefaultCollection() {
    const modelCollection = await this._renderModelRepository.listRenderModels();
    const iconInfos = this.mapToIconInfos(modelCollection);
    const modelIcons = await this.mapToIconModels(iconInfos);

    const characterIconGroups = _.groupBy(modelIcons, modelIcon => modelIcon.characterId);

    return reduceKeys(Object.keys(characterIconGroups), characterKey => {
      const characterIconGroup = characterIconGroups[characterKey];
      return reduceMap(characterIconGroup, group => group.variantId, group => {
        const { characterId, variantId, ...icons } = group;
        return icons;
      })
    }) as IconModelCollection;
  }

  private async mapToIconModels(iconInfos: Array<IconInfo>) {
    // get icon asset files
    const spaIcons = await this.readDirectory(this._spaIconDirectory);
    const homeIcons = await this.readDirectory(this._homeIconDirectory);
    const battleIcons = await this.readDirectory(this._battleIconDirectory);

    // filter out spa models
    const characterIconInfos = iconInfos.filter(x => !x.characterId.startsWith('s'));
    const spaIconInfos = iconInfos.filter(x => x.characterId.startsWith('s'));;

    // local helper functions
    const getInfoKey = (info: IconInfo) => `${info.characterId}_${info.variantId}`;
    const getIconPath = (fileCollection: FileStatsCollection, folderId: string, filename: string) => {
      const files = fileCollection[folderId]?.files;
      if (files && files[filename]) {
        return this._pathService.relativeAssetPath(files[filename].path);
      };
    }
    const getIconFileName = (fileIndex: number) => `${fileIndex.toString().padStart(8, '0')}.png`;

    // create spa dictionary
    const spaIconInfosDictionary = reduceMap(spaIconInfos, getInfoKey, info => info);

    return characterIconInfos.map(info => {
      const filename = getIconFileName(info.fileId);

      // get spa details
      const spaKey = `s${getInfoKey(info)}`; // spa key with leading 's'
      const spaInfo = spaIconInfosDictionary[spaKey];
      const spaFilename = spaInfo && getIconFileName(spaInfo.fileId);
      const spaIcon = spaInfo && getIconPath(spaIcons, spaInfo.folderId, spaFilename);
      const battleIcon = getIconPath(battleIcons, info.folderId, filename);
      const homeIcon = getIconPath(homeIcons, info.folderId, filename);

      return {
        characterId: info.characterId,
        variantId: info.variantId,
        battle: battleIcon,
        home: homeIcon,
        spa: spaIcon,
      };
    });
  }

  private mapToIconInfos(modelCollection: RenderModelCollection): Array<IconInfo> {
    const characterFolderInfos = this.mapToCharacterFolderInfos(modelCollection);
    const characterFolderGroups = _.groupBy(characterFolderInfos, (folderInfo) => folderInfo.folderId);

    const characterFolders = Object.keys(characterFolderGroups).flatMap(folderId => {
      const characterFolderGroup = characterFolderGroups[folderId];
      
      return characterFolderGroup
        .flatMap(folderInfo => this.mapToVariantFolderInfo(folderInfo))
        .flatMap((variantInfo, index) => variantInfo.variantIds.map(variantId => ({
          variantId,
          characterId: variantInfo.characterId,
          folderId: variantInfo.folderId,
          fileId: index
        })));
    });
    return characterFolders;
  }

  private mapToVariantFolderInfo(folderInfo: CharacterFolderInfo): Array<VariantFolderInfo> {
    const variantIds = Object.keys(folderInfo.variants);
    const isPNGVariant = variantIds.every(variantId =>
      folderInfo.variants[variantId].modeltype === RenderModelType.PNG
    );
    const baseInfo = { characterId: folderInfo.characterId, folderId: folderInfo.folderId };

    if (isPNGVariant) {
      return [Object.assign({}, baseInfo, { variantIds })];
    }
    
    return variantIds
      .map(variantId => Object.assign({}, baseInfo, { variantIds: [variantId] }))
      .sort((a, b) => parseInt(a.variantIds[0], 10) - parseInt(b.variantIds[0], 10));
  }

  private mapToCharacterFolderInfos(modelCollection: RenderModelCollection): Array<CharacterFolderInfo> {
    const characterIds = Object.keys(modelCollection);
    return characterIds.map(characterId => {
      const folderInfo = this.mapToFolderInfo(characterId);
      return {
        ...folderInfo,
        variants: modelCollection[characterId]
      }
    });
  }

  private mapToFolderInfo(characterId: string) {
    const matches = /(?<folder>[a-zA-z]*[0-9])(?<index>.*)/.exec(characterId);
    const folderId = matches?.groups?.folder || '';
    return { characterId, folderId };
  }

  private async readDirectory(filePath: string) {
    return await FileHelper.readDirectoryDeep(filePath);
  }
}