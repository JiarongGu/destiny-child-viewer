import * as _ from 'lodash';
import { sink, effect, state } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { RenderModelType } from '@shared';
import { Live2DService, Live2DRenderComponents, CharacterService } from '@services';
import { CharacterViewerPositionSink } from './character-viewer-position-sink';
import { getDefaultVariant } from '../character-helper';

export interface CurrentCharacterView {
  characterId: string;
  variantId: string;
  activeMotion?: string;
}

@sink('character-viewer', new Live2DService(), new CharacterService(), CharacterViewerPositionSink)
export class CharacterViewerSink {
  @state public components?: Live2DRenderComponents;
  @state public metadata?: CharacterMetadata;
  @state public current?: { characterId: string; variantId: string };
  @state public loading: boolean = false;

  constructor(private _live2DService: Live2DService, private _characterService: CharacterService) {}

  @effect
  public reset() {
    this.loading = false;
    this.components = undefined;
    this.metadata = undefined;
    this.current = undefined;
  }

  @effect
  public async loadCharacterByIndex(index: number) {
    const characters = await this._characterService.listAll();
    const character = characters[index];

    if (character) {
      const defaultVariant = getDefaultVariant(character);
      await this.loadCharacter(character.id, defaultVariant);
    }
  }

  @effect
  public async loadCharacter(characterId: string, variantId: string) {
    if (!characterId || !variantId) {
      return;
    }
    this.reset();

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
    }
    this.loading = false;
  }
}
