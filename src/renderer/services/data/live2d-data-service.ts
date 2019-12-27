import { FileService, PathService, FileReadType } from '@services';
import {
  MotionModel,
  MotionData,
  TextureModel,
  Live2DMetadata,
  MotionDataCollection,
  Live2DData
} from '@models/live2d';
import { reduceKeys } from '@utils/reduceKeys';

export class Live2DDataService {
  private _fileService: FileService;
  private _pathService: PathService;

  constructor() {
    this._pathService = new PathService();
    this._fileService = new FileService();
  }

  public async getCharacterData(id: string): Promise<Live2DData> {
    const assetPath = this._pathService.getAssetPath(`/character/${id}`);
    const metaFileName = `character.DRAGME.${id}.json`;

    const metadata = await this._fileService.get<Live2DMetadata>(`${assetPath}/${metaFileName}`, FileReadType.Json);

    const motionKeys = Object.keys(metadata.motions);
    const motionArray = await Promise.all(motionKeys.map(key => this.getMotionData(assetPath, metadata.motions[key])));
    const motions = reduceKeys(motionKeys, (key, index) => motionArray[index]) as MotionDataCollection;

    const textureArray = await Promise.all(
      metadata.textures.map(texture => this._fileService.get(`${assetPath}/${texture}`, FileReadType.Base64))
    );
    const textures = metadata.textures.map<TextureModel>((name, index) => ({ name, url: textureArray[index] }));

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