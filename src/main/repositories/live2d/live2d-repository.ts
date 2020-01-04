import { FileReadType, Live2DModel, Live2DMetadata, TextureModel, MotionModel, MotionRaw } from '@shared/models';
import { ILive2DRepository } from '@shared/remote';
import { reduceKeys } from '@shared';

import { FileLocator } from '../common';
import { FileService, PathService } from '../../services';

export class Live2DRepository implements ILive2DRepository {
  private _fileService = new FileService();
  private _pathService = new PathService();

  public async getLive2D(characterId: string, variantId: string): Promise<Live2DModel> {
    const id = `${characterId}_${variantId}`;
    const assetPath = `${FileLocator.CHARACTER_DIRECTORY}/${id}`;
    const assetRelative = this._pathService.relativeResourcePath(assetPath);

    const metadataFilePath = `${assetPath}/character.DRAGME.${id}.json`;
    const metadata = await this._fileService.get<Live2DMetadata>(metadataFilePath, FileReadType.Json);

    const motions = reduceKeys<Array<MotionModel>, string>(Object.keys(metadata.motions), key => {
      const motionRaws = metadata.motions[key] as Array<MotionRaw>;
      return motionRaws.map(motionRaw => ({
        fadeIn: motionRaw.fade_in,
        fadeOut: motionRaw.fade_out,
        file: `${assetRelative}/${motionRaw.file}`
      }));
    });
    const textures = metadata.textures.map<TextureModel>(name => ({
      name, url: `${assetRelative}/${name}`
    }));

    const modelPath = `${assetRelative}/${metadata.model}`;

    return { metadata, textures, motions, modelPath };
  }
}