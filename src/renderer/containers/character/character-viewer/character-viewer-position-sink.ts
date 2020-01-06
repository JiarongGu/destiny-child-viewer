import { sink, state, effect, trigger } from 'redux-sink';
import * as _ from 'lodash';

import { VariantPosition, RenderModelType, RenderModelLive2D, Live2DHelper, RenderModelPositionType } from '@shared';

import { CharacterService } from '@services';

@sink('character-viewer-position', new CharacterService())
export class CharacterViewerPositionSink {
  @state public position?: VariantPosition;
  @state public positionUpdated: boolean = false;
  @state public saving: boolean = false;

  private current?: { characterId: string, variantId: string };
  private defaultPosition?: VariantPosition;
  
  constructor(
    private _characterService: CharacterService
  ) { }

  @effect
  public reset() {
    this.position = undefined;
    this.positionUpdated = false;
    this.saving = false;

    this.current = undefined;
    this.defaultPosition = undefined;
  }

  @effect
  public async loadPosition(characterId: string, variantId: string) {
    this.defaultPosition = await this.getPosition(characterId, variantId);
    this.position = this.defaultPosition;
    this.current = { characterId, variantId };
  }

  @effect 
  public resetPosition() {
    this.position = this.defaultPosition;
  }

  @effect
  public async savePosition() {
    if (this.current && this.position && this.positionUpdated) {
      this.saving = true;

      await this._characterService.savePosition(
        this.current.characterId,
        this.current.variantId,
        RenderModelPositionType.Home,
        this.position
      );
      this.defaultPosition = this.position;
      this.positionUpdated = false;
      this.saving = false;
    }
  }

  @trigger('character-viewer-position/position')
  public onPositionChanged(position: VariantPosition) {
    if (this.defaultPosition) {
      this.positionUpdated = !_.isEqual(this.defaultPosition, position);
    }
  }

  private async getPosition(characterId: string, variantId: string) {
    const metadata = await this._characterService.getCharacterMetadata(characterId);
    const renderModel = metadata.render[variantId];

    if (renderModel.modeltype === RenderModelType.Live2D) {
      const characterVariants = metadata.character?.variants;
      const renderPosition = this.getMetadataPosition(renderModel);
      const variantPosition = characterVariants && characterVariants[variantId]?.positions?.home;

      if (variantPosition && variantPosition.refined) {
        return variantPosition;
      }
      return this.convertPosition(renderPosition);
    }
  }

  private getMetadataPosition(model: RenderModelLive2D): VariantPosition {
    const live2dInfo = model.home ? model.home : model;
    return {
      scale: live2dInfo.scale!,
      x: live2dInfo.position!.x,
      y: live2dInfo.position!.y,
    };
  }

  private convertPosition(position: VariantPosition): VariantPosition {
    return {
      scale: Live2DHelper.round(position.scale),
      x: Live2DHelper.round(position.x / 150),
      y: Live2DHelper.round(-position.y / 300)
    };
  }
}