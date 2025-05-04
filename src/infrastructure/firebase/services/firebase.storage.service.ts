import { UserService } from '../../../modules/users/services/user.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { extname } from 'path';

@Injectable()
export class FirebaseStorageService {
  private storage: any;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.storage = getStorage(firebaseApp);
  }

  async uploadProfilePicture(file: Express.Multer.File, userId: string) {
    const path = `users/profile-picture/${userId}${extname(file.originalname)}`;
    const bucket = this.storage.bucket();
    const fileRef = bucket.file(path);
    try {
      await fileRef.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
      });
      return `https://storage.googleapis.com/${bucket.name}/${path}`;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Error uploading profile picture');
    }
  }
}
