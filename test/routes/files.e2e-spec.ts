import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FileEntity } from '../../src/routes/files/infrastructure/persistence/relational/entities/file.entity';
import { FilesLocalController } from '../../src/routes/files/infrastructure/uploader/local/files.controller';
import { FilesLocalService } from '../../src/routes/files/infrastructure/uploader/local/files.service';

describe('FilesLocalController', () => {
  let controller: FilesLocalController;
  let service: FilesLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesLocalController],
      providers: [
        FilesLocalService,
        {
          provide: FilesLocalService,
          useValue: {
            uploadFile: jest.fn(),
            downloadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesLocalController>(FilesLocalController);
    service = module.get<FilesLocalService>(FilesLocalService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      // Mock request and file data
      const mockRequest = {
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({ filename: 'test.jpg' }),
      } as unknown as FastifyRequest;

      // Mock service behavior
      const fileEntity = new FileEntity() as any;
      jest.spyOn(service, 'uploadFile').mockResolvedValue(fileEntity);

      // Call controller method
      const result = await controller.uploadFile(mockRequest);

      // Assertions
      expect(mockRequest.isMultipart).toHaveBeenCalled();
      expect(mockRequest.file).toHaveBeenCalled();
      expect(service.uploadFile).toHaveBeenCalledWith({ filename: 'test.jpg' });
      expect(result).toEqual(fileEntity);
    });
    it('should throw BadRequestException if no file in request', async () => {
      const mockRequest = {
        isMultipart: jest.fn().mockReturnValue(false),
      } as unknown as FastifyRequest;

      await expect(controller.uploadFile(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for unsupported file types', async () => {
      const mockRequest = {
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({ filename: 'test.txt' }),
      } as unknown as FastifyRequest;

      await expect(controller.uploadFile(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('download', () => {
    it('should download file', () => {
      const mockPath = 'example.jpg';
      const mockResponse = {
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockStream = {} as any;

      jest.spyOn(service, 'downloadFile').mockReturnValue(mockStream);

      controller.download(mockPath, mockResponse);

      expect(service.downloadFile).toHaveBeenCalledWith(mockPath);
      expect(mockResponse.send).toHaveBeenCalledWith(mockStream);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
