import * as _ from 'lodash';
import { sink, effect, state, trigger } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { Live2DHelper } from '@shared/utils';
import { RenderModelType, RenderModelLive2D, CharacterVariantPosition, RenderModelPositionType } from '@shared/models';
import { Live2DService, Live2DRenderComponents } from '@services/live2d/live2d-service';
import { CharacterService } from '@services/character/character-service';

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
  @state public current?: { characterId: string, variantId: string };

  @state public play: boolean = true;
  @state public loading: boolean = false;
  @state public positionUpdated: boolean = false;

  private originalPosition?: CharacterVariantPosition;

  constructor(
    private _live2DService: Live2DService,
    private _characterService: CharacterService
  ) { }

  @effect
  public clear() {
    this.loading = false;
    this.components = undefined;
    this.metadata = undefined;
    this.current = undefined;
    this.play = true;

    this.position = undefined;
    this.originalPosition = undefined;
    this.positionUpdated = false;
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
    this.originalPosition = this.getPosition(variantId, this.metadata);
    this.position = this.originalPosition;

    if (renderModel?.modeltype === RenderModelType.Live2D) {
      try {
        this.components = await this._live2DService.loadComponents(characterId, variantId);
      } catch (ex) {
        console.warn(ex);
        console.warn(this.metadata);
      }
    }
    this.loading = false;
  }

  @effect
  public async savePosition() {
    if (this.current && this.position) {
      await this._characterService.savePosition(
        this.current.characterId,
        this.current.variantId,
        RenderModelPositionType.Home,
        this.position
      );
      this.metadata = await this._characterService.getCharacterMetadata(this.current.characterId);
      this.originalPosition = this.position;
      this.positionUpdated = false;
    }
  }

  @effect 
  public async resetPosition() {
    this.position = this.originalPosition;
  }

  @trigger('character-viewer/position')
  public onPositionChanged(position: CharacterVariantPosition) {
    if (this.originalPosition) {
      this.positionUpdated = !_.isEqual(this.originalPosition, position);
    }
  }

  private getPosition(variantId: string, metadata: CharacterMetadata) {
    const renderModel = this.metadata?.render[variantId];
    if (renderModel?.modeltype === RenderModelType.Live2D) {
      const characterVariants = metadata.character?.variants;
      const renderPosition = this.getMetadataPosition(renderModel);
      const variantPosition = characterVariants && characterVariants[variantId]?.positions?.home;

      if (variantPosition && variantPosition.refined) {
        return variantPosition;
      }
      return this.convertPosition(renderPosition);
    }
  }

  private getMetadataPosition(model: RenderModelLive2D): CharacterVariantPosition {
    const live2dInfo = model.home ? model.home : model;
    return {
      scale: live2dInfo.scale!,
      x: live2dInfo.position!.x,
      y: live2dInfo.position!.y,
    };
  }

  private convertPosition(position: CharacterVariantPosition): CharacterVariantPosition {
    return {
      scale: Live2DHelper.round(position.scale),
      x: Live2DHelper.round(position.x / 150),
      y: Live2DHelper.round(-position.y / 300)
    };
  }
}
