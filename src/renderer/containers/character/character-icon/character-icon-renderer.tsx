import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';
import { GridChildComponentProps } from 'react-window';

import { CharacterIconSink } from './character-icon-sink';

export const CharacterIconRenderer: React.FunctionComponent<GridChildComponentProps> = ({
  columnIndex,
  rowIndex,
  style
}) => {
  const sink = useSink(CharacterIconSink);
  const index = rowIndex * sink.grid.column + columnIndex;

  const character = sink.characters[index];
  if (!character) {
    return null;
  }
  return (
    <div style={style}>
      <Link to={{ pathname: `/character/view/${character.id}`, state: { character } }}>
        <img key={character.id} src={character.live2dDefault.icon} />
      </Link>
    </div>
  );
};
