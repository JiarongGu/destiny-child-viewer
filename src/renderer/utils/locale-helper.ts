export class LocaleHelper {
  public static formatText(text) {
    return text && text.replace(/\r/g, '').replace(/\_/g, ' ').trim();
  }

  public static getLines(file: string): Array<string> {
    return file.split('\n').filter(line => line && line.indexOf('\/\/') < 0);
  }

  public static formatFile<T>(text: string, formatter: (blocks: Array<string>) => T) {
    return LocaleHelper.getLines(text).map(line => {
      const blocks = line.split('\t');
      return formatter(blocks.map(this.formatText));
    })
  }
}