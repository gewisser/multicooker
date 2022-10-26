export interface IImageList {
  url: string;
  fileName: string;
}

export interface IImageData {
  homeImgUrl: string | undefined;
  images: IImageList[];
}
