/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3 } from '@aws-sdk/client-s3';
import type { IFileData } from 'src/models/File';

const endpointUrl = import.meta.env.VITE_S3_URL;
const s3Bucket = import.meta.env.VITE_S3_BUCKET;

interface IPutObject {
  Bucket: string;
  Key: string;
  Body: Uint8Array;
  ContentType: string;
}

function getRoute(route: string) {
  route = route.replace(/\\/g, '/');

  if (route.slice(-1) !== '/') route += '/';
  if (route[0] === '/') route = route.slice(1);

  return route;
}

const awss3 = () => {
  const s3 = new S3({
    endpoint: endpointUrl,
    credentials: {
      accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
    },
    region: import.meta.env.VITE_S3_REGION,
  });

  function Upload(data: IFileData, route: string) {
    return new Promise<string>((resolve, reject) => {
      if (!data || !data.file) {
        reject('Data or file undef');
        return;
      }

      const uploadRoute = getRoute(route);
      const Key = `${uploadRoute}${data.fileName}`;

      let params: IPutObject | undefined = {
        Bucket: s3Bucket,
        Key,
        Body: data.file,
        ContentType: data.contentType,
      };

      s3.putObject(params, (err: any) => {
        params = undefined;

        if (err) {
          reject(err);
        }

        resolve(`${endpointUrl}/${s3Bucket}${route}${data.fileName}`);
      });
    });
  }

  function Delete(fileName: string, route: string) {
    return new Promise((resolve, reject) => {
      const uploadRoute = getRoute(route);
      const Key = `${uploadRoute}${fileName}`;

      const params = {
        Bucket: s3Bucket,
        Key: Key,
      };

      s3.deleteObject(params, (err: any) => {
        if (err) {
          reject(err);
        }

        reject();
      });
    });
  }

  return {
    Upload,
    Delete,
  };
};

export default awss3;
