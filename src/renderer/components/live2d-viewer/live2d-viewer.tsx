import axios from 'axios';
import * as React from 'react';

import { drawContext, getWebGLContext, Live2DDrawState, playMotion } from './web-gl-utils';

export class Live2DViewer extends React.Component {
  private viewRef = React.createRef<HTMLCanvasElement>();
  private motionManager = new L2DMotionManager();
  private drawState: Live2DDrawState = {
    initLive2DCompleted: false,
    loadLive2DCompleted: false,
    stopLive2D: false,
    textureLoadedCount: 0
  };
  private requestID?: number;
  private motionAttack?: Live2DMotion;

  public componentDidMount() {
    Live2D.init();
    this.initialize(this);
  }

  public async loadMotion(path: string) {
    const motionData = await axios.get(path, { responseType: 'arraybuffer' });
    const motion = Live2DMotion.loadMotion(motionData.data);
    motion._$eo = 0;
    motion._$dP = 0;
    return motion;
  }

  public async initialize(component: Live2DViewer) {
    if (!this.viewRef.current) return;

    const character = (await axios.get('/assets/c429_88/character.json')).data;
    // initLive2d(character, this.viewRef.current);

    const model = (
      await axios.get(`/assets/c429_88/${character.model}`, { responseType: 'arraybuffer' })
    ).data;
    const motionIdle = await this.loadMotion(`/assets/c429_88/${character.motions.idle[0].file}`);
    this.motionAttack = await this.loadMotion(
      `/assets/c429_88/${character.motions.attack[0].file}`
    );

    const context = getWebGLContext(this.viewRef.current);

    if (!context) {
      console.error('Failed to create WebGl context!');
      return;
    }
    Live2D.setGL(context);

    const live2DModel = Live2DModelWebGL.loadModel(model);

    const loadedImages = [] as Array<HTMLImageElement>;

    for (let i = 0; i < character.textures.length; i++) {
      // create new image
      loadedImages[i] = new Image();
      loadedImages[i].src = `/assets/c429_88/${character.textures[i]}`;
      loadedImages[i].onload = function() {
        component.drawState.textureLoadedCount++;
        if (component.drawState.textureLoadedCount === character.textures.length) {
          component.drawState.loadLive2DCompleted = true;
        }
      };
      loadedImages[i].onerror = function() {
        console.error(`Failed to load texture: ${character.textures[i]}`);
      };
    }

    (function tick() {
      drawContext(
        context,
        component.motionManager,
        live2DModel,
        loadedImages,
        motionIdle,
        component.drawState
      );

      if (component.viewRef.current) {
        component.requestID = requestAnimationFrame(tick);
      }
    })();
  }

  public render() {
    return (
      <div>
        <h1>Live 2D</h1>
        <canvas
          ref={this.viewRef}
          onClick={() => {
            if (this.motionAttack) {
              playMotion(this.motionManager, this.motionAttack);
            }
          }}
          width="800"
          height="800"
        />
      </div>
    );
  }
}
