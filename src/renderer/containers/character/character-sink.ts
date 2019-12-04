import { MotionType } from './../../models/character/character-meta';

import { sink, effect, state } from 'redux-sink';

import { FileService, FileReadType } from '@services/file/file-service';
import { CharacterMeta, MotionModel } from '@models/character/character-meta';
import { reduceKeys } from '@utils/reduceKeys';

export interface Motion extends MotionModel {
  fileBytes: ArrayBuffer;
}

function loadLive2DMotion(data: ArrayBuffer, fadeIn: number, fadeOut: number): Live2DMotion {
  const motion = Live2DMotion.loadMotion(new DataView(data));
  motion._$eo = fadeIn;
  motion._$dP = fadeOut;
  return motion;
}

function getLive2DComponents(sink: CharacterSink) {
  const motions = reduceKeys(Object.keys(sink.motions), key => {
    const motion = sink.motions[key][0];
    return loadLive2DMotion(motion.fileBytes, motion.fade_in, motion.fade_out);
  });

  let loadedCount = 0;
  const textures = sink.textures.map(texture => {
    const image = new Image();
    image.src = texture.url;
    image.onload = function() {
      loadedCount++;

      if (loadedCount === sink.textures.length) {
        sink.texturesLoaded = true;
      }
    };
    image.onerror = function() {
      console.error(`Failed to load texture: ${texture.name}`);
    };
    return image;
  });

  return {
    motions,
    textures
  };
}

@sink('character', new FileService())
export class CharacterSink {
  @state public motions: { [key in MotionType]?: Motion } = {};
  @state public character?: ArrayBuffer;
  @state public textures: Array<{ name: string; url: string }> = [];
  @state public live2DComponents?: {
    motions: { [key in MotionType]?: Live2DMotion };
    textures: Array<HTMLImageElement>;
  };
  @state public texturesLoaded: boolean = false;
  constructor(private fileService: FileService) {}

  @effect
  public async loadCharacter(id: string) {
    const assetPath = this.getCharacterAssetPath(id);
    const metaFileName = this.getCharacterMetaFileName(id);

    const metadata = await this.fileService.get<CharacterMeta>(`${assetPath}/${metaFileName}`, FileReadType.Json);
    const motionKeys = Object.keys(metadata.motions);

    const motions = await Promise.all(motionKeys.map(key => this.getMotions(assetPath, metadata.motions[key])));

    this.motions = motionKeys.reduce((model, key, index) => {
      model[key] = motions[index];
      return model;
    }, {});

    const [character, textures] = await Promise.all([
      this.fileService.get(`${assetPath}/${metadata.model}`, FileReadType.ByteArray),
      await Promise.all(
        metadata.textures.map(texture => this.fileService.get(`${assetPath}/${texture}`, FileReadType.Base64))
      )
    ]);
    this.character = character;
    this.textures = metadata.textures.map((name, index) => ({ name, url: textures[index] }));
    this.live2DComponents = getLive2DComponents(this);
  }

  private async getMotions(assetPath: string, motions: Array<MotionModel>): Promise<Array<Motion>> {
    const motionFiles = await Promise.all(
      motions.map(motion => this.fileService.get(`${assetPath}/${motion.file}`, FileReadType.ByteArray))
    );

    return motions.map((motion, index) => ({
      ...motion,
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
