/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IFileData } from 'src/models/File';

export const getFileData = (
  event: Event,
  readerFn: (blob: Blob | File) => Promise<IFileData>
) => {
  return new Promise<IFileData>(async (resolve, reject) => {
    const files = (event.target as HTMLInputElement).files;

    if (!files || !files.length) {
      reject('Files not found');
      return;
    }

    const file = files.item(0);

    if (!file) {
      reject('File not exist');
      return;
    }

    if (typeof readerFn !== 'function') {
      reject('readerFn is not a function');
    }

    resolve(await readerFn(file));
  });
};

export const readFile = () => {
  return (file: File) => {
    return new Promise<IFileData>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve({
          file: new Uint8Array(event.target?.result as ArrayBuffer),
          fileName: file.name,
          contentType: file.type,
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };
};
