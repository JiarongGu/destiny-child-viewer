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

  private cancellation?: () => void;

  constructor(
    private _characterViewer: CharacterViewerSink,
    private _blobService: BlobService
  ) { }

  @effect
  public reset() {
    this.play = true;
    this.positionUpdated = false;
    this.voice = undefined;
    if (this.cancellation) this.cancellation();
  }

  @effect
  public async playRandomMotion() {
    if (this.current && this.components) {
      const motion = this.getRandom(_.pickBy(this.components?.motions, (_, key) =>
        !key.startsWith('idle') && !key.startsWith('banner')
      ));
      if (motion) {
        this.playRandomVoice().then(() => {
          this._characterViewer.components?.motionManager.startMotion(motion[0]);
        });
      };
    }
  }

  @effect
  public async playRandomVoice() {
    if (this.voices) {
      const voiceInfo = this.getRandom(this.voices); 

      if (voiceInfo) {
        let cancelled = false;
        this.cancellation = () => cancelled = true;
        const voiceUrl =  await this._blobService.read(voiceInfo.filePath, BlobReadType.URL);

        if (!cancelled) {
          this.voice = {
            url: voiceUrl,
            text: voiceInfo.text
          }
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