import { sink, effect, state } from 'redux-sink';

import { Position } from '@models/position';
import { CharacterModelType } from '@models/character/character-model-info';

import { Live2DDataService } from '@services/data/live2d-data-service';
import { Live2DService, Live2DRenderComponents } from '@services/live2d/live2d-service';
import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { CharacterModifySink } from './character-modify-sink';

@sink('character-component', new Live2DService(), MetadataSink,  CharacterModifySink)
export class CharacterSink {
  @state public live2DComponents?: Live2DRenderComponents;
  @state public position?: Position;
  @state public play: boolean = true;

  constructor(
    private live2DService: Live2DService,
    private metadataSink: MetadataSink,
    private characterModifySink: CharacterModifySink
  ) { }

  @effect
  public reset() {
    this.live2DComponents = undefined;
    this.position = undefined;
    this.play = true;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();
    this.characterModifySink.loadCharacter(id);

    try {
      this.live2DComponents = await this.live2DService.loadComponents(id);

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
