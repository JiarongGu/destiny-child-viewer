export interface CharacterTitle {
  name: string;

  variants: {
    [key: string]: {
      name?: string;
      title?: string;
      description?: string;
    }
  }
}