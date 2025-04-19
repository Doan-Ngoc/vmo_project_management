import { UserService } from '@/modules/users/services/user.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { extname } from 'path';

@Injectable()
export class FirebaseStorageService {
  private storage: any;

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: app.App,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.storage = getStorage(firebaseApp);
  }

  // Create a reference to a file
  getFileRef(path: string) {
    const bucket = this.storage.bucket();
    return bucket.file(path);
  }

  // Create a reference to a folder
  getFolderRef(path: string) {
    const bucket = this.storage.bucket();
    return bucket.file(path);
  }

  // Upload a file
  async uploadProfilePicture(file: Express.Multer.File, userId: string) {
    const path = `users/profile-picture/${userId}${extname(file.originalname)}`;
    const bucket = this.storage.bucket();
    const fileRef = bucket.file(path);
    try {
      await fileRef.save(file.buffer, {
        metadata: {
          userId,
          originalName: file.originalname,
        },
        contentType: file.mimetype,
        public: true,
      });
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
      return this.userService.uploadProfilePictureToDatabase(publicUrl, userId);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Error uploading profile picture');
    }
  }

  // Get download URL for a file
  async getDownloadUrl(path: string) {
    const bucket = this.storage.bucket();
    const fileRef = bucket.file(path);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    });
    return url;
  }
}
