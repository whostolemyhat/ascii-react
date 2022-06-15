export type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Pixels = {
  data: Array<Pixel>;
  width: number;
  height: number;
};

export enum Converter {
  None,
  Single,
  Pool,
}

export type Options = {
  resolution?: number;
  whitespace?: string;
  invert?: boolean;
  colour?: boolean;
  numWorkers?: number;
};

export enum AppState {
  UPLOAD,
  PREVIEW,
  LOADING,
  RESULT,
}
