
import { sink, effect, state } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { RenderModelType, RenderModelLive2D, CharacterVariantPosition } from '@models/data';
import { Live2DService, Live2DRenderComponents } from '@services/live2d-service';
import { CharacterService } from '@services/character-service';

@sink('character-viewer', new Live2DService(), new CharacterService())
export class CharacterViewerSink {
  @state public components?: Live2DRenderComponents;
  @state public position?: CharacterVariantPosition;
  @state public metadata?: CharacterMetadata;
  @state public current?: { characterId: string, variantId: string };

  @state public play: boolean = true;
  @state public loading: boolean = false;

  constructor(
    private _live2DService: Live2DService,
    private _characterService: CharacterService
  ) { }

  @effect
  public reset() {
    this.components = undefined;
    this.position = undefined;
    this.current = undefined;
    this.metadata = undefined;
    this.play = true;
    this.loading = false;
  }

  @effect
  public async loadCharacter(characterId: string, variantId: string) {
    this.reset();
    this.loading = true;
    this.current = { characterId, variantId };
    this.metadata = await this._characterService.getCharacterMetadata(characterId);

    try {
      const renderModel = this.metadata.render[variantId];

      if (renderModel.modeltype === RenderModelType.Live2D) {
        this.components = await this._live2DService.loadComponents(characterId, variantId);

        const characterVariants = this.metadata.character?.variants;
        const renderPosition = this.getMetadataPosition(renderModel);
        const variantPosition = characterVariants && characterVariants[variantId]?.positions.home;

        if (variantPosition && variantPosition.refined) {
          this.position = variantPosition;
        } else {
          this.position = this.convertPosition(variantPosition || renderPosition);
        }
      }
    } catch (ex) {
      console.warn(ex);
      console.warn(this.metadata);
      this.reset();
    }

    this.loading = false;
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
