import * as _ from 'lodash';
import { sink, effect, state, trigger } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { 
  Live2DHelper, 
  RenderModelType, 
  RenderModelLive2D, 
  RenderModelPositionType,
  VariantPosition, 
  CharacterVoiceType, 
  MathHelper
} from '@shared';
import { Live2DService, Live2DRenderComponents, CharacterService, BlobReadType, BlobService } from '@services';

export interface CurrentCharacterView {
  characterId: string;
  variantId: string;
  activeMotion?: string
}

@sink('character-viewer', new Live2DService(), new CharacterService(), new BlobService())
export class CharacterViewerSink {
  @state public components?: Live2DRenderComponents;
  @state public position?: VariantPosition;
  @state public metadata?: CharacterMetadata;
  @state public current?: { characterId: string, variantId: string };

  @state public play: boolean = true;
  @state public loading: boolean = false;
  @state public positionUpdated: boolean = false;

  @state public voice?: { url: string, text: string };

  private originalPosition?: VariantPosition;

  constructor(
    private _live2DService: Live2DService,
    private _characterService: CharacterService,
    private _blobService: BlobService
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
    this.voice = undefined;
  }

  @effect
  public async loadCharacter(characterId: string, variantId: string) {
    if (!characterId || !variantId) {
      return;
    }
    this.clear();
    
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

  @effect
  public async playRandomVoice() {
    const voices = this.getVoices();

    if (!voices) return;
    
    const types = Object.keys(voices);
    const randomType = types[MathHelper.random(0, types.length - 1)];

    this.playVoice(randomType as CharacterVoiceType);
  }

  @effect 
  public async playVoice(type: CharacterVoiceType) {
    const voices = this.getVoices();
    
    if (!voices || !voices[type]) return;

    const voice = voices[type]!;

    this.voice = { 
      url: await this._blobService.read(voice.filePath, BlobReadType.URL),
      text: voice.text
    }
  }

  @trigger('character-viewer/position')
  public onPositionChanged(position: VariantPosition) {
    if (this.originalPosition) {
      this.positionUpdated = !_.isEqual(this.originalPosition, position);
    }
  }

  private getVoices() {
    if(!this.current || !this.metadata) return; 
    return this.metadata.character.variants[this.current.variantId].voices || this.metadata.character.voices!;
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
