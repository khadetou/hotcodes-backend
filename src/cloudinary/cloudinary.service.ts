import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImages(file: Express.Multer.File, user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: `hotcodes/orders/${user.lastName}/${user._id}`,
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );
      file.buffer && toStream(file.buffer).pipe(upload);
    });
  }
}
