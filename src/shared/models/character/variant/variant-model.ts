import { VariantBase } from './variant-base';
import { VariantStatic } from './variant-static';
import { VariantAdditional } from './variant-additional';


export interface VariantModel
  extends VariantBase, VariantStatic, Omit<VariantAdditional, 'positions'> { }