import { Injectable, Inject } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseStorageService {
  private storage: any;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
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
  async uploadFile(file: Buffer, path: string, metadata?: any) {
    const bucket = this.storage.bucket();
    const fileRef = bucket.file(path);
    await fileRef.save(file, {
      metadata: metadata,
      contentType: metadata?.contentType || 'application/octet-stream',
    });
    return fileRef;
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
