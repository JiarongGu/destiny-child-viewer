import { CharacterVoiceType } from './character-voice-type.enum';

export type CharacterVoice = {
  [key in CharacterVoiceType]?: { text: string; filePath: string; };
}