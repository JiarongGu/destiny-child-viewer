import { sink, effect, state } from 'redux-sink';

import { Position } from '@models/position';
import { Live2DData, Live2DMotionCollection } from '@models/live2d';
import { CharacterModelType } from '@models/character/character-model-info';

import { Live2DDataService } from '@services/data/live2d-data-service';
import { Live2DService } from '@services/live2d/live2d-service';
import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { CharacterModifySink } from './character-modify-sink';

@sink('character-component', new Live2DDataService(), new Live2DService(), MetadataSink,  CharacterModifySink)
export class CharacterSink {
  @state public live2DComponents?: {
    motionManager: L2DMotionManager;
    motions: Live2DMotionCollection;
    textures: Array<HTMLImageElement>;
    updaters: Array<L2DUpdateParam>;
    model: ArrayBuffer;
  };
  @state public position?: Position;
  @state public animation: boolean = true;

  data?: Live2DData;

  constructor(
    private live2DDataService: Live2DDataService,
    private live2DService: Live2DService,
    private metadataSink: MetadataSink,
    private characterModifySink: CharacterModifySink
  ) { }

  @effect
  public reset() {
    this.data = undefined;
    this.live2DComponents = undefined;
    this.position = undefined;
    this.animation = true;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();
    this.characterModifySink.loadCharacter(id);

    try {
      this.data = await this.live2DDataService.getCharacterData(id);

      if (!this.data) {
        return;
      }

      this.live2DService.loadTextureImages(this.data.textures, images => {
        const motionManager = this.live2DService.createMotionManager();

        this.live2DComponents = {
          motionManager,
          textures: images,
          motions: this.live2DService.loadLive2DMotions(this.data!.motions),
          model: this.data!.model,
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
}
