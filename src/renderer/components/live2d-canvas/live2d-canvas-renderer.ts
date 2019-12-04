import { Position } from '@models/position';

export function drawCanvas(
  context: WebGLRenderer,
  model: Live2DModel,
  motionManager: L2DMotionManager,
  motionDefault: Live2DMotion,
  position: Position
) {
  // clear canvas
  context.clearColor(0.0, 0.0, 0.0, 0.0);
  context.clear(context.COLOR_BUFFER_BIT);

  const height = model.getCanvasHeight();
  const width = model.getCanvasWidth();
  const modelMatrix = new L2DModelMatrix(width, height);

  modelMatrix.setWidth(position.scale);
  modelMatrix.setCenterPosition(position.x, position.y);
  model.setMatrix(modelMatrix.getArray());

  // start idle animation
  if (motionManager.isFinished()) {
    motionManager.startMotion(motionDefault);
  }
  motionManager.updateParam(model);

  // update and draw model
  model.update();
  model.draw();
}

export function getTexture(context: WebGLRenderer, source: TexImageSource, model: Live2DModel): WebGLTexture | null {
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
}

export function getRendererContext(canvas: HTMLCanvasElement): WebGLRenderer | null {
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
}
