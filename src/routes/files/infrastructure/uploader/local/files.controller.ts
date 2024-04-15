import * as fs from 'fs';
import * as path from 'path';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesLocalService } from './files.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { join } from 'path';
import { appRoot } from 'src/main';
import { createReadStream } from 'fs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
@Controller({
  path: 'files',
  version: '1',
})
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  async uploadFile(@Req() request: FastifyRequest & any) {
    if (!request.isMultipart()) {
      throw new BadRequestException('No files in request');
    }
    const data = await request.file();
    if (!data) {
      throw new BadRequestException('File upload failed');
    }
    if (!data.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw new BadRequestException('Unsupported file type');
    }
    const filename = `${randomStringGenerator()}.${data.filename.split('.').pop()?.toLowerCase()}`;
    data.filename = filename;

    const filepath = path.join('./files', filename);

    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filepath);
      data.file.pipe(writeStream);
      data.file.on('end', () => resolve());
      data.file.on('error', (error) => reject(error));
    });
    return this.filesService.create(filename);
  }

  @Get(':path')
  download(@Param('path') path: string, @Response() res: FastifyReply) {
    try {
      const filePath = join(appRoot, 'files', path); // Adjust the path as needed
      const stream = createReadStream(filePath);
      void res.send(stream);
    } catch (err) {
      throw new BadRequestException("File doesn't exist");
    }
  }
}
