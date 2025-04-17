import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { PermissionSeederService } from './services/permission-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);

  try {
    const seeder = app.get(PermissionSeederService);
    await seeder.seed();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
