import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SeederService } from './services/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedsModule);
  const seeder = app.get(SeederService);
  try {
    console.log('Seeding started');
    const seedType = process.argv[2]; // Get the seeder type from command line

    switch (seedType) {
      case 'permissions':
        await seeder.seedPermissions();
        break;

      case 'role-permissions':
        await seeder.seedRolePermissions();
        break;

      case 'admin':
        await seeder.seedDefaultAdmin();
        break;

      default:
        // Run all seeds if no specific seed is specified
        await seeder.seedPermissions();
        await seeder.seedRolePermissions();
        await seeder.seedDefaultAdmin();
        console.log('All seeding completed');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
