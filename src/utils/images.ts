import type { IFileData } from 'src/models/File';

export const readImage = (width: number, height: number) => {
  return (blob: Blob | File) => {
    return new Promise<IFileData>((resolve, reject) => {
      let fileName = 'file.jpg';
      let fileType = 'image/jpeg';

      if (blob instanceof File) {
        fileName = blob.name;
        fileType = blob.type;
        blob = new Blob([blob]);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      createImageBitmap(blob, {
        resizeHeight: height,
        resizeWidth: width,
      }).then((value) => {
        if (!ctx) {
          reject('Canvas context 2d not found');
          return;
        }

        ctx.drawImage(value, 0, 0);
        value.close();

        canvas.toBlob((vblob) => {
          if (!vblob) {
            reject("Can't convert canvas to blob");
            return;
          }

          vblob.arrayBuffer().then((value) => {
            resolve({
              file: new Uint8Array(value),
              fileName: fileName,
              contentType: fileType,
            });
          });
        });
      });
    });
  };
};
