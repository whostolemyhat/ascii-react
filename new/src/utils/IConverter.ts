import { Options } from './types';

export interface IConverter {
  worker?: Worker;
  toAscii(pixels: ImageData, options: Options): void;
}
