import { ConversionOptions } from './types';

export interface IConverter {
  worker?: Worker;
  toAscii(pixels: ImageData, options: ConversionOptions): void;
}
