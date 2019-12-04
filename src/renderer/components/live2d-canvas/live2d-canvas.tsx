import * as React from 'react';

const modelScale = 1.1;
const modelX = 0;
const modelY = 0.1;

export interface Live2DViewer2Props {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  motionDefault: Live2DMotion;
  motionActive?: Live2DMotion;
}

export class Live2DCanvas extends React.Component<Live2DViewer2Props> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private motionManager = new L2DMotionManager();

  public componentDidMount() {
    const canvas = this.canvasRef.current!;
    const context = this.getRendererContext(canvas)!;

    Live2D.init();
    Live2D.setGL(context);

    const model = Live2DModelWebGL.loadModel(this.props.model);
    const textures = this.props.textures;
    const motionDefault = this.props.motionDefault;
    const motionManager = this.motionManager;

    // initialize texture
    textures.forEach((texture, index) => {
      const webTexture = this.getWebGLTexture(context, texture, model);
      if (webTexture) {
        model.setTexture(index, webTexture);
      }
    });
    model.setGL(context);

    const tick = () => {
      this.draw(context, model, motionManager, motionDefault);
      requestAnimationFrame(tick);
    };

    tick();
  }

  public componentWillUnmount() {
    Live2D.dispose();
  }

  private draw = (
    context: WebGLRenderer,
    model: Live2DModel,
    motionManager: L2DMotionManager,
    motionDefault: Live2DMotion
  ) => {
    // clear canvas
    context.clearColor(0.0, 0.0, 0.0, 0.0);
    context.clear(context.COLOR_BUFFER_BIT);

    const height = model.getCanvasHeight();
    const width = model.getCanvasWidth();
    const modelMatrix = new L2DModelMatrix(width, height);

    modelMatrix.setWidth(modelScale);
    modelMatrix.setCenterPosition(modelX, modelY);
    model.setMatrix(modelMatrix.getArray());

    // start idle animation
    if (motionManager.isFinished()) {
      motionManager.startMotion(motionDefault);
    }
    motionManager.updateParam(model);

    // update and draw model
    model.update();
    model.draw();
  };

  private getWebGLTexture = (
    context: WebGLRenderer,
    source: TexImageSource,
    model: Live2DModel
  ): WebGLTexture | null => {
    // create empty texture
    const texture = context.createTexture();

    // a lot of WebGL things i don't understand
    if (!model.isPremultipliedAlpha()) {
      context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    }

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, source);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_NEAREST);
    context.generateMipmap(context.TEXTURE_2D);
    context.bindTexture(context.TEXTURE_2D, null);
    return texture;
  };

  private getRendererContext = (canvas: HTMLCanvasElement): WebGLRenderer | null => {
    // try different WebGl kits
    const kits = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    const param = { alpha: true, premultipliedAlpha: true };

    for (const kit of kits) {
      const context = canvas.getContext(kit, param);
      if (context) {
        return context as WebGLRenderer;
      }
    }
    return null;
  };

  private playActiveMotion = () => {
    if (this.props.motionActive && this.motionManager) {
      this.motionManager.startMotion(this.props.motionActive);
    }
  };

  public render() {
    return <canvas ref={this.canvasRef} onClick={this.playActiveMotion} width={800} height={800} />;
  }
}
