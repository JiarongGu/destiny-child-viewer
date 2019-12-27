import { sink, effect, state, trigger } from 'redux-sink';

import { CharacterModel } from '@models/character/character-model';
import { Position } from '@models/position';
import { MotionData, Live2DMotionCollection, MotionModel, MotionDataCollection } from '@models/live2d/motion-model';
import { TextureModel } from '@models/live2d/texture-model';

import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { FileService, FileReadType } from '@services/file/file-service';
import { Live2DService } from '@services/live2d/live2d-service';
import { CharacterModifySink } from './character-modify-sink';
import { reduceKeys } from '@utils/reduceKeys';
import { CharacterModelType } from '@models/character/character-model-info';

@sink('character-component', new FileService(), new Live2DService(), MetadataSink, CharacterModifySink)
export class CharacterSink {
  @state public live2DComponents?: {
    motionManager: L2DMotionManager;
    motions: Live2DMotionCollection;
    textures: Array<HTMLImageElement>;
    updaters: Array<L2DUpdateParam>;
    data: ArrayBuffer;
  };
  @state public position?: Position;
  @state public animation: boolean = true;

  modelData?: ArrayBuffer;
  motions: MotionDataCollection = {};
  textures: Array<TextureModel> = [];

  constructor(
    private fileService: FileService,
    private live2DService: Live2DService,
    private metadataSink: MetadataSink,
    private characterModifySink: CharacterModifySink
  ) { }

  @effect
  public reset() {
    this.modelData = undefined;
    this.motions = {};
    this.textures = [];

    this.live2DComponents = undefined;
    this.position = undefined;
    this.animation = true;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();
    this.characterModifySink.loadCharacter(id);
    const assetPath = this.getCharacterAssetPath(id);
    const metaFileName = this.getCharacterMetaFileName(id);

    try {
      // get character metadata
      const animation = await this.fileService.get<CharacterModel>(`${assetPath}/${metaFileName}`, FileReadType.Json);

      // get motion files
      const motionKeys = Object.keys(animation.motions);
      const motions = await Promise.all(motionKeys.map(key => this.getMotionData(assetPath, animation.motions[key])));
      this.motions = reduceKeys(motionKeys, (key, index) => motions[index]);

      // get model file
      this.modelData = await this.fileService.get(`${assetPath}/${animation.model}`, FileReadType.ByteArray);

      // get textures files
      const textures = await Promise.all(
        animation.textures.map(texture => this.fileService.get(`${assetPath}/${texture}`, FileReadType.Base64))
      );
      this.textures = animation.textures.map((name, index) => ({ name, url: textures[index] }));

      this.live2DService.loadTextureImages(this.textures, images => {
        const motionManager = this.live2DService.createMotionManager();

        this.live2DComponents = {
          motionManager,
          textures: images,
          motions: this.live2DService.loadLive2DMotions(this.motions),
          data: this.modelData!,
          updaters: [motionManager]
        };
      });

      const metadata = this.metadataSink.characters[id];

      if (metadata.modeltype === CharacterModelType.Live2D) {
        if (metadata.home) {
          this.position = {
            scale: metadata.home.scale * 1.25,
            x: this.convertPosition(metadata.home.position.x, 100),
            y: this.convertPosition(metadata.home.position.y, -200)
          };
        } else {
          this.position = {
            scale: metadata.scale! * 1.25,
            x: this.convertPosition(metadata.position!.x, 100),
            y: this.convertPosition(metadata.position!.y, -300)
          };
        }
      }

      return this.characterModifySink.data;
    } catch (ex) {
      this.reset();
      console.warn(ex);
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
