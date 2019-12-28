import * as React from 'react';
import { useSink } from 'redux-sink';
import { GridChildComponentProps } from 'react-window';

import { CharacterIconSink } from './character-icon-sink';

export const CharacterIconRenderer: React.FunctionComponent<GridChildComponentProps> = ({
  columnIndex,
  rowIndex,
  style,
  data,
  isScrolling
}) => {
  const sink = useSink(CharacterIconSink);
  const index = rowIndex * sink.grid.column + columnIndex;

  const character = sink.characters[index];
  if (!character) {
    return null;
  }
  return <img style={style} key={character.id} src={character.icon} />;
};
