import { IImageData } from 'src/models/Gallery';

export interface IDish {
  id: string;
  imageData: IImageData;
  title: string;
  ingredients: string;
  stars: number;
  description: string;
  auto_heating: boolean;
  cooking_temperature: number;
  auto_heating_temp: number;
  total_cooking_time: number;
  heating_cooking_time: number;
}

export interface ICookingProcess {
  id: string;
  current_temperature: number;
  start_cooking_time: number;
  start_total_time: number;
  auto_heating: boolean;
  cooking_temperature: number;
  auto_heating_temp: number;
}

export type TDishStatus = 'waiting' | 'cooking' | 'heat';
export type TDishSources = 'saved_dish' | 'new_dish';
