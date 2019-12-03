export interface ActiveRoute {
  queryParams: { [key: string]: string | null };
  params: { [key: string]: any };
  keys: Array<string>;
  url: string;
  name: string;
}
