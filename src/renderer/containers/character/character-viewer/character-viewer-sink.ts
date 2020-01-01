
import { sink, effect, state } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { MathHelper } from '@utils';
import { RenderModelType, RenderModelLive2D, CharacterVariantPosition } from '@models/data';
import { MotionType } from '@models/live2d';
import { Live2DService, Live2DRenderComponents } from '@services/live2d-service';
import { CharacterService } from '@services/character-service';

export interface CurrentCharacterView { 
  characterId: string; 
  variantId: string; 
  activeMotion?: string 
}

@sink('character-viewer', new Live2DService(), new CharacterService())
export class CharacterViewerSink {
  @state public components?: Live2DRenderComponents;
  @state public position?: CharacterVariantPosition;
  @state public metadata?: CharacterMetadata;
  @state public current?:  { characterId: string, variantId: string };

  @state public play: boolean = true;
  @state public loading: boolean = false;

  constructor(
    private _live2DService: Live2DService,
    private _characterService: CharacterService
  ) { }

  @effect
  public clear() {
    this.components = undefined;
    this.position = undefined;
    this.current = undefined;
    this.play = true;
    this.loading = false;
    this.metadata = undefined;
  }

  @effect
  public async loadCharacter(characterId: string, variantId: string) {
    this.loading = true;

    if (this.current?.characterId !== characterId || !this.metadata) {
      this.metadata = await this._characterService.getCharacterMetadata(characterId);
    }

    if (!this.metadata) {
      this.loading = false;
      return;
    }
    
    this.current = { characterId, variantId };

    const renderModel = this.metadata?.render[variantId];
    if (renderModel?.modeltype === RenderModelType.Live2D) {
      try {
        this.components = await this._live2DService.loadComponents(characterId, variantId);
      } catch (ex) {
        console.warn(ex);
        console.warn(this.metadata);
      }

      const characterVariants = this.metadata.character?.variants;
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
      x: MathHelper.round(position.x / 150, 3),
      y: MathHelper.round(-position.y / 300, 3)
    };
  }
}
