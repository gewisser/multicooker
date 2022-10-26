import { IImageData } from 'src/models/Gallery';

export interface IDish {
  id: string;
  imageData: IImageData;
  description: string;
  cooking_temperature: number;
  cooking_time: number;
  auto_heating: boolean;
  auto_heating_temp: number;
}
