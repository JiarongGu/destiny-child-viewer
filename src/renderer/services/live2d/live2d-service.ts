
import { reduceKeys } from '@utils';
import { Live2DRepository } from '@repositories';
import { Live2DMotionCollection, MotionDataCollection, MotionData } from '@models/live2d';

export interface Live2DRenderComponents {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  updaters: Array<L2DUpdateParam>;
  motions: Live2DMotionCollection;
  motionManager: L2DMotionManager;
}

export class Live2DService {
  private _live2DRepository: Live2DRepository;

  constructor() {
    this._live2DRepository = new Live2DRepository();
  }

  public async loadComponents(characterId: string, variantId: string) {
    const data = await this._live2DRepository.getData(characterId, variantId);

    if (data) {
      const textures = await this.loadTextureImages(data.textures);
      const motions = this.loadLive2DMotions(data.motions);
      const motionManager = new L2DMotionManager();

      return {
        motionManager,
        motions,
        textures,
        model: data.model,
        updaters: [motionManager]
      }
    }
  }

  private loadTextureImages(textures: Array<{ name: string; url: string }>): Promise<Array<HTMLImageElement>> {
    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const images = textures.map(texture => {
        const image = new Image();
        image.src = texture.url;
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
