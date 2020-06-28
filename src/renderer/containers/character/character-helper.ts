import { VariantType, CharacterMetadata } from '@models';

const defaultVariants = [VariantType.EClass, VariantType.SClass, VariantType.Story];

export function getDefaultVariant(character: CharacterMetadata) {
  return defaultVariants.find(variant => character.icon[variant]) || Object.keys(character.icon)[0]
}