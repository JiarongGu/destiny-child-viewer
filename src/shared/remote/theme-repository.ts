import { ThemeCollection, MusicModel } from '@shared';

export interface IThemeRepository {
  getMusicCollection(): Promise<{ [key: number]: MusicModel }>;
  getMusic(id: number): Promise<MusicModel>;
}