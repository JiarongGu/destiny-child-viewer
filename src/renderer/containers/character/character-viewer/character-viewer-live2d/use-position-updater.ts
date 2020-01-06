import * as React from 'react';
import * as _ from 'lodash';

import { useDragPosition, useResizeObserver } from '@hooks';
import { VariantPosition, Live2DHelper } from '@shared';
import { CharacterViewerPositionSink } from '../character-viewer-position-sink';

export function usePositionUpdater(
  characterPosition: CharacterViewerPositionSink,
  containerRef: React.RefObject<HTMLElement>
) {
  const sinkPosition = characterPosition.position;

  const [canvasSize, setCanvasSize] = React.useState(0);
  const [position, setPosition] = React.useState<VariantPosition>();

  const dispatchPosition = React.useCallback(
    _.throttle((position: VariantPosition) => (characterPosition.position = position), 100),
    []
  );

  React.useEffect(() => {
    setPosition(sinkPosition);
  }, [sinkPosition]);


  const handlers = useDragPosition(
    event => {
      const convertPosition = (value: number, base: number) => value / base;
      if (position) {
        setPosition({
          x: Live2DHelper.round(position.x + convertPosition(event.x, canvasSize)),
          y: Live2DHelper.round(position.y - convertPosition(event.y, canvasSize)),
          scale: position.scale
        });
        dispatchPosition(position);
      }
    },
    event => {
      event.persist();
      event.preventDefault();
    },
    [position, canvasSize]
  );

  const onWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (sinkPosition) {
        const value = event.deltaY / 2000;
        const scale = Live2DHelper.round(sinkPosition?.scale + value);
        characterPosition.position = { ...sinkPosition, scale };
      }
    },
    [sinkPosition]
  );

  useResizeObserver(containerRef, event => setCanvasSize(Math.min(event.height, event.width)), []);

  return { ...handlers, onWheel, canvasSize, position };
}