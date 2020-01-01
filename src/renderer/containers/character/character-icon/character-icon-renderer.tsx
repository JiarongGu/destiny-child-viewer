import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';
import { GridChildComponentProps } from 'react-window';

import { CharacterVariantType } from '@models';
import { PathService } from '@services/path-service';

import { CharacterIconSink } from './character-icon-sink';

export const CharacterIconRenderer: React.FunctionComponent<GridChildComponentProps> = ({
  columnIndex,
  rowIndex,
  style
}) => {
  const sink = useSink(CharacterIconSink, sink => [sink.characters]);
  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const index = rowIndex * sink.grid.column + columnIndex;

  const character = sink.characters[index];
  if (!character) {
    return null;
  }

  let variant: string = CharacterVariantType.Default;
  let icon = character.icon[variant];

  if (!icon) {
    variant = Object.keys(character.icon)[0];
    icon = character.icon[variant];
  }

  return (
    <div style={style}>
      <Link to={`/character/view/${character.id}/${variant}`}>
        <img key={character.id} src={getAssetPath(icon.home)} />
      </Link>
    </div>
  );
};
