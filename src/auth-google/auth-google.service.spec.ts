import { AuthGoogleService } from './auth-google.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Client } from 'google-auth-library';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';

describe('AuthGoogleService', () => {
  let service: AuthGoogleService;
  let google: OAuth2Client;
  let configService: ConfigService<AllConfigType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGoogleService,
        {
          provide: OAuth2Client,
          useValue: {
            verifyIdToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthGoogleService>(AuthGoogleService);
    google = module.get<OAuth2Client>(OAuth2Client);
    configService = module.get<ConfigService<AllConfigType>>(ConfigService);
  });

  it('should be defined', () => {
    console.log(google, configService);
    expect(service).toBeDefined();
  });
});
