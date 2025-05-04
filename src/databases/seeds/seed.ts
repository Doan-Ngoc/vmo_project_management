import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SeedsService } from './services/seeds.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SeedsModule);
  const seeder = app.get(SeedsService);
  const logger = new Logger(bootstrap.name);
  try {
    logger.log('Starting database seeding...');
    const seedType = process.argv[2];

    switch (seedType) {
      case 'permissions':
        await seeder.seedPermissions();
        break;

      case 'roles':
        await seeder.seedRoles();
        break;

      case 'role-permissions':
        await seeder.seedRolePermissions();
        break;

      case 'admin':
        await seeder.seedDefaultAdmin();
        break;

      default:
        // Run all seeds if no specific seed is specified
        logger.log('Running all seeds...');
        await seeder.seedPermissions();
        await seeder.seedRoles();
        await seeder.seedRolePermissions();
        await seeder.seedDefaultAdmin();
        logger.log('All seeding operations completed successfully');
    }
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
