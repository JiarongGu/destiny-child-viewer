import { reduceKeys } from '@utils/reduceKeys';
import { Live2DMotionCollection, MotionDataCollection, MotionData } from '@models/live2d/motion-model';

export class Live2DService {
  public loadTextureImages(
    textures: Array<{ name: string; url: string }>,
    callback: (images: Array<HTMLImageElement>) => void
  ) {
    let loadedCount = 0;
    const images = textures.map(texture => {
      const image = new Image();
      image.src = texture.url;
      image.onload = function() {
        loadedCount++;
        if (loadedCount === textures.length) {
          // completed
          callback(images);
        }
      };
      image.onerror = function() {
        console.error(`Failed to load texture: ${texture.name}`);
      };
      return image;
    });
    return images;
  }

  public loadLive2DMotion(data: ArrayBuffer, fadeIn: number, fadeOut: number): Live2DMotion {
    const motion = Live2DMotion.loadMotion(new DataView(data));
    motion._$eo = fadeIn;
    motion._$dP = fadeOut;
    return motion;
  }

  public createMotionManager() {
    return new L2DMotionManager();
  }

  public loadLive2DMotions(motions: MotionDataCollection): Live2DMotionCollection {
    const live2DMotions = reduceKeys(Object.keys(motions), key => {
      return motions[key].map((motion: MotionData) =>
        this.loadLive2DMotion(motion.fileBytes, motion.fadeIn, motion.fadeOut)
      );
    });
    return live2DMotions;
  }
}
