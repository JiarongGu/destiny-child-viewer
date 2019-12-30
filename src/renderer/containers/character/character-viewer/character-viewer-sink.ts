
import { sink, effect, state } from 'redux-sink';

import { CharacterService } from '@services/character/character-service';
import { Live2DService, Live2DRenderComponents } from '@services/live2d/live2d-service';
import { CharacterModifySink } from '../character-sinks/character-modify-sink';
import { RenderModelType, RenderModelLive2D } from '@models/data';
import { CharacterVariantPosition } from '@models/data/character-model/character-variant-position';

@sink('character-viewer', new Live2DService(), new CharacterService(), CharacterModifySink)
export class CharacterViewerSink {
  @state public live2DComponents?: Live2DRenderComponents;
  @state public position?: CharacterVariantPosition;
  @state public play: boolean = true;
  @state public icon?: string;

  constructor(
    private live2DService: Live2DService,
    private _characterService: CharacterService,
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
  public async loadCharacter(characterId: string, variantId: string) {
    this.reset();
    // this.characterModifySink.loadCharacter(id);
    const metadata = await this._characterService.getCharacterMetadata(characterId);
    try {
      const renderModel = metadata.render[variantId];

      if (renderModel.modeltype === RenderModelType.Live2D) {
        this.live2DComponents = await this.live2DService.loadComponents(characterId, variantId);
        this.icon = metadata.icon[variantId].home;

        const characterVariants = metadata.character?.variants;
        const renderPosition = this.getMetadataPosition(renderModel);
        const variantPosition = characterVariants && characterVariants[variantId]?.positions.home;

        if (variantPosition && variantPosition.refined) {
          this.position = variantPosition;
        } else {
          this.position = this.convertPosition(variantPosition || renderPosition);
        }
      }

      return this.characterModifySink.data;
    } catch (ex) {
      this.reset();
      console.warn(ex);
      console.warn(metadata);
    }
  }

  private getMetadataPosition(metadata: RenderModelLive2D): CharacterVariantPosition {
    const live2dInfo = metadata.home ? metadata.home : metadata;
    return {
      scale: live2dInfo.scale! * 1.25,
      x: live2dInfo.position!.x,
      y: live2dInfo.position!.y,
    };
  }

  private convertPosition(position: CharacterVariantPosition): CharacterVariantPosition {
    return {
      scale: position.scale * 1.25,
      x: position.x / 100,
      y: -position.y / 200
    };
  }
}
