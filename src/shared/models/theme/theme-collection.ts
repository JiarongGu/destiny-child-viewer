import { MusicModel } from './music-model';

export interface ThemeCollection { 
  musics: { [key: number]: MusicModel };
  images: { [key: number]: string } 
};