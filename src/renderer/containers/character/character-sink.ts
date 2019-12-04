import { sink, effect, state } from 'redux-sink';

import { CharacterMeta } from '@models/character/character-meta';
import { MotionData, Live2DMotionCollection, MotionModel, MotionDataCollection } from '@models/live2d/motion-model';
import { TextureModel } from '@models/live2d/texture-model';

import { FileService, FileReadType } from '@services/file/file-service';
import { Live2DService } from '@services/live2d/live2d-service';
import { reduceKeys } from '@utils/reduceKeys';

@sink('character', new FileService(), new Live2DService())
export class CharacterSink {
  @state public modelData?: ArrayBuffer;
  @state public motions: MotionDataCollection = {};
  @state public textures: Array<TextureModel> = [];

  @state public live2DComponents?: {
    motions: Live2DMotionCollection;
    textures: Array<HTMLImageElement>;
  };
  @state public texturesLoaded: boolean = false;

  constructor(private fileService: FileService, private live2DService: Live2DService) {}

  @effect
  public reset() {
    this.modelData = undefined;
    this.live2DComponents = undefined;
    this.motions = {};
    this.textures = [];
    this.texturesLoaded = false;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();

    const assetPath = this.getCharacterAssetPath(id);
    const metaFileName = this.getCharacterMetaFileName(id);

    // get character metadata
    const metadata = await this.fileService.get<CharacterMeta>(`${assetPath}/${metaFileName}`, FileReadType.Json);

    // get motion files
    const motionKeys = Object.keys(metadata.motions);
    const motions = await Promise.all(motionKeys.map(key => this.getMotionData(assetPath, metadata.motions[key])));
    this.motions = reduceKeys(motionKeys, (key, index) => motions[index]);

    // get model file
    this.modelData = await this.fileService.get(`${assetPath}/${metadata.model}`, FileReadType.ByteArray);

    // get textures files
    const textures = await Promise.all(
      metadata.textures.map(texture => this.fileService.get(`${assetPath}/${texture}`, FileReadType.Base64))
    );
    this.textures = metadata.textures.map((name, index) => ({ name, url: textures[index] }));

    this.live2DComponents = {
      textures: this.live2DService.loadTextureImages(this.textures, () => (this.texturesLoaded = true)),
      motions: this.live2DService.loadLive2DMotions(this.motions)
    };
  }

  private async getMotionData(assetPath: string, motions: Array<MotionModel>): Promise<Array<MotionData>> {
    const motionFiles = await Promise.all(
      motions.map(motion => this.fileService.get(`${assetPath}/${motion.file}`, FileReadType.ByteArray))
    );

    return motions.map((motion, index) => ({
      fadeIn: motion.fade_in,
      fadeOut: motion.fade_out,
      fileBytes: motionFiles[index]
    }));
  }

  private getCharacterAssetPath(id: string) {
    return `asset/character/${id}`;
  }

  private getCharacterMetaFileName(id: string) {
    return `character.DRAGME.${id}.json`;
  }
}
