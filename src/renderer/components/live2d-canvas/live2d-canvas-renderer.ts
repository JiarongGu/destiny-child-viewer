export function createDraw(
  canvas: HTMLCanvasElement,
  modelData: ArrayBuffer,
  textures: Array<HTMLImageElement>,
  updaters: Array<L2DUpdateParam> = [],
  onDraw?: (model: Live2DModel) => void
) {
  const context = getRendererContext(canvas)!;

  Live2D.init();
  Live2D.setGL(context);

  const model = Live2DModelWebGL.loadModel(modelData);

  // initialize texture
  textures.forEach((texture, index) => {
    const webTexture = getTexture(context, texture, model);
    if (webTexture) {
      model.setTexture(index, webTexture);
    }
  });
  model.setGL(context);

  return (width: number, height: number, x: number, y: number, scale: number) => {
    context.viewport(0, 0, width, height);
    if (onDraw) {
      onDraw(model);
    }
    drawCanvas(context, model, updaters, x, y, scale);
  };
}

export function drawCanvas(
  context: WebGLRenderer,
  model: Live2DModel,
  updaters: Array<L2DUpdateParam>,
  x: number, 
  y: number, 
  scale: number
) {
  // clear canvas
  context.clearColor(0.0, 0.0, 0.0, 0.0);
  context.clear(context.COLOR_BUFFER_BIT);

  const height = model.getCanvasHeight();
  const width = model.getCanvasWidth();
  const modelMatrix = new L2DModelMatrix(width, height);

  modelMatrix.setWidth(scale);
  modelMatrix.setCenterPosition(x, y);
  model.setMatrix(modelMatrix.getArray());

  updaters.forEach(updater => updater.updateParam(model));

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
