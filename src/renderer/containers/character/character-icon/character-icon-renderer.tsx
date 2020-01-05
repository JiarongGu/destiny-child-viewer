import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';
import { GridChildComponentProps } from 'react-window';

import { VariantType } from '@models';

import { CharacterIconSink } from './character-icon-sink';

const defaultVariants = [VariantType.EClass, VariantType.SClass, VariantType.Story];

export const CharacterIconRenderer: React.FunctionComponent<GridChildComponentProps> = ({
  columnIndex,
  rowIndex,
  style
}) => {
  const characterIconSink = useSink(CharacterIconSink, sink => [sink.characters]);
  const index = rowIndex * characterIconSink.grid.column + columnIndex;

  const character = characterIconSink.characters[index];
  const [icon, setIcon] = React.useState<string>();
  const [variantId, setVariantId] = React.useState<string>();

  React.useEffect(() => {
    if (character) {
      setVariantId(defaultVariants.find(variant => character.icon[variant]) || Object.keys(character.icon)[0]);
    }
  }, [character]);

  React.useEffect(() => {
    let cancelled = false;
    if (character && variantId) {
      characterIconSink.getIcon(character.id, variantId, 'home').then(icon => !cancelled && setIcon(icon));
    }
    return () => {
      cancelled = true;
    };
  }, [character, variantId]);

  if (!character) return null;

  return (
    <div style={style}>
      <Link to={`/character/view/${character.id}/${variantId}`}>
        <img key={character.id} src={icon} />
      </Link>
    </div>
  );
};
