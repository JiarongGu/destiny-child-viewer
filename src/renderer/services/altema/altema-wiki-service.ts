import axios from 'axios';

export class AltemaWikiService {
  private readonly _altemaIdRegex = new RegExp(`chara\/(?<altemaId>[0-9]*).*`);
  
  public async getAltemaIdByTitle(title: string) {
    const result = await axios.get(`https://altema.jp/destinychild/searchresults?q=${title.replace(/\s/g, '')}`);
    const matches = this._altemaIdRegex.exec(result.data);
    return matches?.groups?.altemaId;
  }

  public async listAltemaDetails() {
    
  }
}