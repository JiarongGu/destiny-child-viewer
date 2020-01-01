import { LocaleType } from './locale-type.enum';

export type LocaleModel = { [key in LocaleType]: string; };