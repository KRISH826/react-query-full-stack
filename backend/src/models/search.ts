export interface SearchParams {
  keyword?  : string;
  gender?   : string;
  brand?    : string;
  size?     : string;
  min_price?: number;
  max_price?: number;
  rating?   : number;
  page?     : number;
  limit?    : number;
}