import { sink, effect, state } from 'redux-sink';

import { CharacterModel } from '@models/character/character-model';
import { MotionData, Live2DMotionCollection, MotionModel, MotionDataCollection } from '@models/live2d/motion-model';
import { TextureModel } from '@models/live2d/texture-model';

import { GameDataSink } from '@sinks/game-data/game-data-sink';
import { FileService, FileReadType } from '@services/file/file-service';
import { Live2DService } from '@services/live2d/live2d-service';
import { reduceKeys } from '@utils/reduceKeys';
import { CharacterModelType } from '@models/character/character-model-info';

@sink('character', new FileService(), new Live2DService(), GameDataSink)
export class CharacterSink {
  @state public id?: string;
  @state public modelData?: ArrayBuffer;
  @state public motions: MotionDataCollection = {};
  @state public textures: Array<TextureModel> = [];
  @state public live2DComponents?: {
    motions: Live2DMotionCollection;
    textures: Array<HTMLImageElement>;
  };
  @state public texturesLoaded: boolean = false;
  @state public position?: { scale: number; x: number; y: number };

  constructor(
    private fileService: FileService,
    private live2DService: Live2DService,
    private gameDataSink: GameDataSink
  ) {}

  @effect
  public reset() {
    this.id = undefined;
    this.modelData = undefined;
    this.live2DComponents = undefined;
    this.motions = {};
    this.textures = [];
    this.texturesLoaded = false;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();
    this.id = id;

    const assetPath = this.getCharacterAssetPath(id);
    const metaFileName = this.getCharacterMetaFileName(id);

    // get character metadata
    const metadata = await this.fileService.get<CharacterModel>(`${assetPath}/${metaFileName}`, FileReadType.Json);

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

    const info = this.gameDataSink.characters[id];

    if (info.modeltype === CharacterModelType.Live2D) {
      this.position = {
        scale: info.home.scale,
        x: this.convertPosition(info.home.position.x, 100),
        y: this.convertPosition(info.home.position.y, -200)
      };
    }
  }

  private convertPosition(value: number, base: number) {
    const scale = value / base;
    return scale;
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
