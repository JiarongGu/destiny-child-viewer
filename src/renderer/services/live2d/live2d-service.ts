import { Live2DMotionCollection, MotionDataCollection, MotionData } from '@models/live2d';
import { RemoteService, ILive2DRepository, RemoteServiceType } from '@shared/remote';
import { MotionModelCollection, MotionModel, reduceKeys, reduceKeysAsync } from '@shared';

import { BlobService, BlobReadType } from '../blob';

export interface Live2DRenderComponents {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  updaters: Array<L2DUpdateParam>;
  motions: Live2DMotionCollection;
  motionManager: L2DMotionManager;
}

export class Live2DService {
  private _live2DRepository = new RemoteService<ILive2DRepository>(RemoteServiceType.Live2D);
  private _blobService = new BlobService();

  public async loadComponents(characterId: string, variantId: string) {
    const data = await this._live2DRepository.invoke('getLive2D', characterId, variantId);

    if (data) {
      const [textures, model, motions] = await Promise.all([
        await this.loadTextureImages(data.textures),
        await this._blobService.read(data.modelPath, BlobReadType.ByteArray),
        await this.loadMotionData(data.motions)
      ]);

      const motionManager = new L2DMotionManager();

      return {
        motionManager,
        textures,
        model,
        motions: this.loadLive2DMotions(motions),
        updaters: [motionManager]
      }
    }
  }

  private loadMotionData(motions: MotionModelCollection): Promise<MotionDataCollection> {
    return reduceKeysAsync(Object.keys(motions), async key => this.getMotionData(motions[key]));
  }

  private async getMotionData(motions: Array<MotionModel>): Promise<Array<MotionModel>> {
    const motionFiles = await Promise.all(
      motions.map(motion => this._blobService.read(motion.file, BlobReadType.ByteArray))
    );
    return motions.map((motion, index) => ({
      ...motion,
      fileBytes: motionFiles[index]
    }));
  }

  private async loadTextureImages(textures: Array<{ name: string; url: string }>): Promise<Array<HTMLImageElement>> {
    const textureUrls = await Promise.all(textures.map(async texture =>
      await this._blobService.read(texture.url, BlobReadType.URL)
    ));

    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const images = textures.map((texture, index) => {
        const image = new Image();
        image.src = textureUrls[index];
        image.onload = function () {
          loadedCount++;
          if (loadedCount === textures.length) {
            // completed
            resolve(images);
          }
        };
        image.onerror = function () {
          reject(`Failed to load texture: ${texture.name}`);
        };
        return image;
      });
    })
  }

  private loadLive2DMotion(data: ArrayBuffer, fadeIn: number, fadeOut: number): Live2DMotion {
    const motion = Live2DMotion.loadMotion(new DataView(data));
    motion._$eo = fadeIn;
    motion._$dP = fadeOut;
    return motion;
  }

  private loadLive2DMotions(motions: MotionDataCollection): Live2DMotionCollection {
    const live2DMotions = reduceKeys(Object.keys(motions), key => {
      return motions[key].map((motion: MotionData) =>
        this.loadLive2DMotion(motion.fileBytes, motion.fadeIn, motion.fadeOut)
      );
    });
    return live2DMotions;
  }
}
