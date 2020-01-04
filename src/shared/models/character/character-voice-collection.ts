import { CharacterVoiceType } from './character-voice-type.enum';
import { CharacterVoice } from './character-voice';

export type CharacterVoiceCollection = {
  [key in CharacterVoiceType]?: CharacterVoice;
}