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
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files-local')
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
    const extension = extname(data.filename).toLowerCase();
    if (!extension.match(/\.(jpg|jpeg|png|gif|mp4)$/i)) {
      throw new BadRequestException(
        'Unsupported file type must be jpg, jpeg, png, gif or mp4',
      );
    }
    return this.filesService.uploadFile(data);
  }

  @Get(':path')
  download(@Param('path') path: string, @Response() res: FastifyReply) {
    const stream = this.filesService.downloadFile(path);
    return void res.send(stream);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/data/:path')
  getOne(@Param('path') path: string) {
    return this.filesService.getOne(path);
  }
}
