import { VariantStatic } from './variant-static';
import { VariantBase } from './variant-base';

export interface VariantAdditional extends Partial<VariantBase> , Partial<VariantStatic> {

}