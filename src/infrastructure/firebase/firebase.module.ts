import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseStorageService } from './services/firebase.storage.service';
import { firebaseProvider } from './firebase.provider';
import { UserService } from '@/modules/users/services/user.service';
import { UserModule } from '@/modules/users/user.module';
@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  providers: [firebaseProvider, FirebaseStorageService],
  exports: [firebaseProvider, FirebaseStorageService],
})
export class FirebaseModule {}
