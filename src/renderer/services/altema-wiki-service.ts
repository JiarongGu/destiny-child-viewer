import axios from 'axios';

import { CharacterRepository } from '@repositories';

export class AltemaWikiService {
  private readonly _altemaIdRegex = new RegExp(`chara\/(?<altemaId>[0-9]*).*`);
  private readonly _characterRepository = new CharacterRepository();


  public async getAltemaIdByTitle(title: string) {
    const result = await axios.get(`https://altema.jp/destinychild/searchresults?q=${title.replace(/\s/g, '')}`);
    const matches = this._altemaIdRegex.exec(result.data);
    return matches?.groups?.altemaId;
  }

  public async listAltemaDetails() {
    
  }
}