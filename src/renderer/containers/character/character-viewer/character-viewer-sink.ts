
import { sink, effect, state } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { RenderModelType, RenderModelLive2D, CharacterVariantPosition } from '@models/data';
import { Live2DService, Live2DRenderComponents } from '@services/live2d-service';
import { CharacterService } from '@services/character-service';

@sink('character-viewer', new Live2DService(), new CharacterService())
export class CharacterViewerSink {
  @state public components?: Live2DRenderComponents;
  @state public position?: CharacterVariantPosition;
  @state public current?: { characterId: string, variantId: string, metadata: CharacterMetadata };

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
    this.play = true;
    this.loading = false;
  }

  @effect
  public async loadCharacter(characterId: string, variantId: string) {
    this.reset();
    this.loading = true;
    const metadata = await this._characterService.getCharacterMetadata(characterId);
    this.current = { characterId, variantId, metadata };

    const renderModel = metadata.render[variantId];

    if (renderModel.modeltype === RenderModelType.Live2D) {
      try {
        this.components = await this._live2DService.loadComponents(characterId, variantId);
      } catch (ex) {
        console.warn(ex);
        console.warn(metadata);
        this.reset();
      }

      const characterVariants = metadata.character?.variants;
      const renderPosition = this.getMetadataPosition(renderModel);
      const variantPosition = characterVariants && characterVariants[variantId]?.positions.home;

      if (variantPosition && variantPosition.refined) {
        this.position = variantPosition;
      } else {
        this.position = this.convertPosition(renderPosition);
      }
    }

    this.loading = false;
  }

  private getMetadataPosition(metadata: RenderModelLive2D): CharacterVariantPosition {
    const live2dInfo = metadata.home ? metadata.home : metadata;
    return {
      scale: live2dInfo.scale!,
      x: live2dInfo.position!.x,
      y: live2dInfo.position!.y,
    };
  }

  private convertPosition(position: CharacterVariantPosition): CharacterVariantPosition {
    return {
      scale: position.scale,
      x: position.x / 150,
      y: -position.y / 300
    };
  }
}
