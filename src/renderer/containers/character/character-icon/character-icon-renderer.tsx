import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';
import { GridChildComponentProps } from 'react-window';
import { Tooltip } from 'antd';

import { CharacterIconSink } from './character-icon-sink';
import { CharacterVariantType } from '@services/character/character-variant-type.enum';
import { PathService } from '@services';

export const CharacterIconRenderer: React.FunctionComponent<GridChildComponentProps> = ({
  columnIndex,
  rowIndex,
  style
}) => {
  const sink = useSink(CharacterIconSink);
  const getAssetPath = React.useCallback((path) => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);
  
  const index = rowIndex * sink.grid.column + columnIndex;

  const character = sink.characters[index];
  if (!character) {
    return null;
  }

  const icon = character.icon[CharacterVariantType.Default] || character.icon[Object.keys(character.icon)[0]];
  
  return (
    <div style={style}>
      <Link to={{ pathname: `/character/view/${character.id}`, state: { character } }}>
        <img key={character.id} src={getAssetPath(icon.home)} />
      </Link>
    </div>
  );
};
