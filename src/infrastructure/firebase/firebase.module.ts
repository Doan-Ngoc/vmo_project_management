import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseStorageService } from './services/firebase.storage.service';
import { firebaseProvider } from './firebase.provider';
@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseStorageService],
  exports: [firebaseProvider, FirebaseStorageService],
})
export class FirebaseModule {}
