import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.option';

@Controller('api/image')
export class ImageController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // 파일 인터셉터
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return `http://localhost:${process.env.SERVER_PORT}/uploads/images/diary/${file.filename}`;
  }
}
