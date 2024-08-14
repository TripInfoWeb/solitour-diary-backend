import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ImageController],
})
export class ImageModule {}
