import { getCharacterId } from '@utils';
import { sink, effect, state } from 'redux-sink';

import { ChildDataService } from '@services/data/child-data-service';

import { Position } from '@models/position';
import { CharacterModelType, CharacterLive2DInfo } from '@models/character/character-model-info';

import { Live2DService, Live2DRenderComponents } from '@services/live2d/live2d-service';
import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { CharacterModifySink } from '../character-sinks/character-modify-sink';

@sink('character-viewer', new Live2DService(), new ChildDataService(), MetadataSink, CharacterModifySink)
export class CharacterViewerSink {
  @state public live2DComponents?: Live2DRenderComponents;
  @state public position?: Position;
  @state public play: boolean = true;
  @state public icon?: string;

  constructor(
    private live2DService: Live2DService,
    private childDataService: ChildDataService,
    private metadataSink: MetadataSink,
    private characterModifySink: CharacterModifySink
  ) { }

  @effect
  public reset() {
    this.live2DComponents = undefined;
    this.position = undefined;
    this.icon = undefined;
    this.play = true;
  }

  @effect
  public async loadCharacter(id: string) {
    this.reset();
    this.characterModifySink.loadCharacter(id);

    try {
      const metadata = this.metadataSink.characters[id];
      const variant = this.childDataService.getVariant(id);
      const ids = getCharacterId(id);

      if (metadata.modeltype === CharacterModelType.Live2D) {
        this.live2DComponents = await this.live2DService.loadComponents(id);
        this.icon = this.metadataSink.iconPortrait[ids.character][ids.variant];

        const metadataPosition = this.getMetadataPosition(metadata);
        const variantPosition = variant.positions.home;

        if (variantPosition.refined) {
          this.position = variantPosition;
        } else {
          this.position = this.convertPosition(variantPosition || metadataPosition);
        }
      }

      return this.characterModifySink.data;
    } catch (ex) {
      this.reset();
      console.warn(ex);
    }
  }

  private getMetadataPosition(metadata: CharacterLive2DInfo): Position {
    const live2dInfo = metadata.home ? metadata.home : metadata;
    return {
      scale: live2dInfo.scale! * 1.25,
      x: live2dInfo.position!.x,
      y: live2dInfo.position!.y,
    };
  }

  private convertPosition(position: Position): Position {
    return {
      scale: position.scale * 1.25,
      x: position.x / 100,
      y: -position.y / 200
    };
  }
}
