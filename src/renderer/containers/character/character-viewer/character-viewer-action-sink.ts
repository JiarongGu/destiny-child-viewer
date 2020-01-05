import { sink, state, effect, trigger } from 'redux-sink';
import * as _ from 'lodash';

import { MathHelper } from '@shared';
import { BlobService, BlobReadType } from '@services';
import { CharacterViewerSink } from './character-viewer-sink';

@sink('character-viewer-action', CharacterViewerSink, new BlobService())
export class CharacterViewerActionSink {
  @state public play: boolean = true;
  @state public positionUpdated: boolean = false;

  @state public voice?: { url: string, text: string };
  @state public volume: number = 50;

  constructor(
    private _characterViewer: CharacterViewerSink,
    private _blobService: BlobService
  ) { }

  @effect
  public reset() {
    this.play = true;
    this.positionUpdated = false;
    this.voice = undefined;
  }

  @effect
  public async playRandomMotion() {
    if (this.current && this.components) {
      const motion = this.getRandom(_.pickBy(this.components?.motions, (model, key) =>
        !key.startsWith('idle') && !key.startsWith('banner')
      ));
      if (motion) {
        this._characterViewer.components?.motionManager.startMotion(motion[0]);
        this.playRandomVoice();
      };
    }
  }

  @effect
  public async playRandomVoice() {
    if (this.voices) {
      const voice = this.getRandom(this.voices);
      if (voice) {
        this.voice = {
          url: await this._blobService.read(voice.filePath, BlobReadType.URL),
          text: voice.text
        }
      }
    }
  }

  private getRandom<T extends _.Dictionary<K>, K>(model?: T) {
    if (!model) return;
    const values = _.values<T>(model);
    return values[MathHelper.random(0, values.length - 1)];
  }

  private get voices() {
    if (this.current && this.metadata) {
      const character = this.metadata.character;
      const variantId = this.current.variantId;
      return character.variants[variantId].voices || character.voices;
    }
  }

  private get current() {
    return this._characterViewer.current;
  }

  private get components() {
    return this._characterViewer.components;
  }

  private get metadata() {
    return this._characterViewer.metadata;
  }
}