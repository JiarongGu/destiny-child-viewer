
export function getLive2dCanvasSize(size, offset: number): number {
  let canvasSize = 720;
  if (size) {
    if (size.minSide > offset) {
      canvasSize = size.minSide - offset;
    } else {
      canvasSize = 0;
    }
  }
  return canvasSize;
}