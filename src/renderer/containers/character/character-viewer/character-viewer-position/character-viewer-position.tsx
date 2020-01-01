import * as React from 'react';
import { Card } from 'antd';
import { useSink } from 'redux-sink';

import { CharacterViewerSink } from '../character-viewer-sink';

export interface CharacterViewerPositionProps {
  className?: string;
}

export const CharacterViewerPosition: React.FunctionComponent<CharacterViewerPositionProps> = ({ className }) => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.position]);
  const position = characterViewSink.position;

  return (
    <Card className={className}>
      <div>x: {position?.x}</div>
      <div>y: {position?.y}</div>
      <div>scale: {position?.scale}</div>
    </Card>
  );
};
