import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.option';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // 파일 인터셉터
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return `http://localhost:3000/uploads/images/diary/${file.filename}`;
  }
}
