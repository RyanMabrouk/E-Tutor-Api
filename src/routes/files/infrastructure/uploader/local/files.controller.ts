import * as fs from 'fs';
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
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
import { createReadStream } from 'fs';
@Controller({
  path: 'files',
  version: '1',
})
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  async uploadFile(@Req() request: FastifyRequest) {
    if (!request.isMultipart()) {
      throw new BadRequestException('No files in request');
    }
    const data = await request.file();
    if (!data) {
      throw new BadRequestException('File upload failed');
    }
    if (!data.filename.match(/\.(jpg|jpeg|png|gif|mp4)$/i)) {
      throw new BadRequestException(
        'Unsupported file type must be jpg, jpeg, png, gif or mp4',
      );
    }
    return this.filesService.uploadFile(data);
  }

  @Get(':path')
  download(@Param('path') path: string, @Response() res: FastifyReply) {
    const filePath = join(process.cwd(), 'files', path);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException("File doesn't exist");
    }
    try {
      const stream = createReadStream(filePath);
      void res.send(stream);
    } catch (err) {
      throw new InternalServerErrorException('Could not read the file');
    }
  }
}
