const modelScale = 1.1;
const modelX = 0;
const modelY = 0.1;

export function getWebGLTexture(
  context: WebGLRenderer,
  img: TexImageSource,
  live2DModel: Live2DModel
): WebGLTexture | null {
  // create empty texture
  const texture = context.createTexture();

  // a lot of WebGL things i don't understand
  if (!live2DModel.isPremultipliedAlpha()) {
    context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  }

  context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);
  context.activeTexture(context.TEXTURE0);
  context.bindTexture(context.TEXTURE_2D, texture);
  context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, img);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
  context.texParameteri(
    context.TEXTURE_2D,
    context.TEXTURE_MIN_FILTER,
    context.LINEAR_MIPMAP_NEAREST
  );
  context.generateMipmap(context.TEXTURE_2D);
  context.bindTexture(context.TEXTURE_2D, null);

  return texture;
}

export function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderer | null {
  // try different WebGl kits
  const kits = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
  const param = { alpha: true, premultipliedAlpha: true };

  for (const kit of kits) {
    try {
      const context = canvas.getContext(kit, param);

      if (context) {
        return context as WebGLRenderer;
      }
    } catch (error) {
      console.warn(error);
    }
  }
  return null;
}

export interface Live2DDrawState {
  initLive2DCompleted: boolean;
  loadLive2DCompleted: boolean;
  stopLive2D: boolean;
  textureLoadedCount: number;
}

export function drawContext(
  context: WebGLRenderer,
  motionManager: L2DMotionManager,
  live2DModel: Live2DModel,
  loadedImages: Array<TexImageSource>,
  motionIdle: Live2DMotion,
  drawState: Live2DDrawState
) {
  // clear canvas
  context.clearColor(0.0, 0.0, 0.0, 0.0);
  context.clear(context.COLOR_BUFFER_BIT);

  // check if model and textures are loaded
  if (!live2DModel || !drawState.loadLive2DCompleted) {
    return;
  }

  // check if first time drawing
  if (!drawState.initLive2DCompleted) {
    drawState.initLive2DCompleted = true;

    // apply textures to the model
    for (let i = 0; i < loadedImages.length; i++) {
      const texture = getWebGLTexture(context, loadedImages[i], live2DModel);
      live2DModel.setTexture(i, texture!);
    }

    live2DModel.setGL(context);
  }

  // something about model matrix
  const height = live2DModel.getCanvasHeight();
  const width = live2DModel.getCanvasWidth();
  const modelMatrix = new L2DModelMatrix(width, height);

  modelMatrix.setWidth(modelScale);
  modelMatrix.setCenterPosition(modelX, modelY);

  live2DModel.setMatrix(modelMatrix.getArray());

  // start idle animation
  if (motionManager.isFinished()) {
    motionManager.startMotion(motionIdle);
  }
  motionManager.updateParam(live2DModel);

  // update and draw model
  live2DModel.update();
  live2DModel.draw();
}

export function playMotion(motionManager: L2DMotionManager, motion: Live2DMotion) {
  motionManager.startMotion(motion);
}
