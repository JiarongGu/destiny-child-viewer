import { FileService, FileReadType } from '@services/file-service';
import { PathService } from '@services/path-service';
import {
  MotionModel,
  MotionData,
  TextureModel,
  Live2DMetadata,
  MotionDataCollection,
  Live2DData
} from '@models/live2d';
import { reduceKeys } from '@utils';

export class Live2DRepository {
  private _fileService: FileService;
  private _pathService: PathService;

  constructor() {
    this._pathService = new PathService();
    this._fileService = new FileService();
  }

  public async getData(characterId: string, variantId: string): Promise<Live2DData> {
    const id = `${characterId}_${variantId}`;
    const assetPath = this._pathService.getAssetPath(`/character/${id}`);
    const metadataFilePath = `${assetPath}/character.DRAGME.${id}.json`;

    const metadata = await this._fileService.get<Live2DMetadata>(metadataFilePath, FileReadType.Json);

    const motionKeys = Object.keys(metadata.motions);
    const motionArray = await Promise.all(motionKeys.map(key => this.getMotionData(assetPath, metadata.motions[key])));
    const motions = reduceKeys(motionKeys, (key, index) => motionArray[index]) as MotionDataCollection;
    const textures = metadata.textures.map<TextureModel>(name => ({ name, url: `${assetPath}/${name}` }));

    const model = await this._fileService.get(`${assetPath}/${metadata.model}`, FileReadType.ByteArray);

    return {
      metadata, motions, textures, model
    }
  }

  private async getMotionData(assetPath: string, motions: Array<MotionModel>): Promise<Array<MotionData>> {
    const motionFiles = await Promise.all(
      motions.map(motion => this._fileService.get(`${assetPath}/${motion.file}`, FileReadType.ByteArray))
    );

    return motions.map((motion, index) => ({
      fadeIn: motion.fade_in,
      fadeOut: motion.fade_out,
      fileBytes: motionFiles[index]
    }));
  }
}