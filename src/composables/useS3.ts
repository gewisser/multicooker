/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3 } from '@aws-sdk/client-s3';
import type { IFileData } from 'src/models/File';

const endpointUrl = 'https://storage.yandexcloud.net';

interface IPutObject {
  Bucket: string;
  Key: string;
  Body: Uint8Array;
  ContentType: string;
}

const awss3 = () => {
  const s3 = new S3({
    endpoint: endpointUrl,
    credentials: {
      accessKeyId: 'YCAJEhwYJhqJHFhr_BKUPeD5N',
      secretAccessKey: 'YCMNhhhqiaLHwQMylCE2RTAvHfy-aD9Lm5g-lFHx',
    },
    region: 'ru-central1-a',
  });

  function Upload(data: IFileData, route: string) {
    return new Promise<string>((resolve, reject) => {
      if (!data || !data.file) {
        reject('Data or file undef');
        return;
      }

      route = route.replace(/\\/g, '/');

      if (route.slice(-1) !== '/') route += '/';
      if (route[0] === '/') route = route.slice(1);

      const uploadRoute = route;
      const Key = `${uploadRoute}${data.fileName}`;

      let params: IPutObject | undefined = {
        Bucket: 'multicooker',
        Key,
        Body: data.file,
        ContentType: data.contentType,
      };

      s3.putObject(params, (err: any) => {
        params = undefined;

        if (err) {
          reject(err);
        }

        resolve(`${endpointUrl}/multicooker/${route}${data.fileName}`);
      });
    });
  }

  return {
    Upload,
  };
};

export default awss3;
