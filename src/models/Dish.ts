import { IImageData } from 'src/models/Gallery';

export interface IDish {
  id: string;
  imageData: IImageData;
  title: string;
  description: string;
  auto_heating: boolean;
  cooking_temperature: number;
  auto_heating_temp: number;
  total_time: number;
  saved_cooking_time: number;
}

export interface ICookingProcess {
  current_temperature: number;
  cooking_time: number;
}
