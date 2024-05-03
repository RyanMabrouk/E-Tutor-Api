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

  //   it('should get profile by token', async () => {
  //     const dto: AuthGoogleLoginDto = {
  //       idToken: 'testToken.test.test',
  //     };
  //     const data = {
  //       sub: '123',
  //       email: 'test@example.com',
  //       given_name: 'John',
  //       family_name: 'Doe',
  //       picture: 'testPicture',
  //     };
  //     const generatedIDToken = jest.fn(
  //       () => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
  //     )
  //     // jest.spyOn(service.google, 'verifyIdToken').mockResolvedValue({
  //     //   getPayload: () => data,
  //     // } as never);

  //     // const result = await service.getProfileByToken({idToken: generatedIDToken()});
  //     expect(service.getProfileByToken).toHaveBeenCalled();

  //     expect(result).toEqual({
  //       id: '123',
  //       email: 'test@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       picture: 'testPicture',
  //     });
  //   });

  //   it('should throw an exception if token is wrong', async () => {
  //     const dto: AuthGoogleLoginDto = {
  //       idToken: 'testToken,.azrazr.azrazr',
  //     };
  //     // jest.spyOn(service.google, 'verifyIdToken').mockResolvedValue({
  //     //   getPayload: () => null,
  //     // } as never);

  //     await expect(service.getProfileByToken(dto)).rejects.toThrow(
  //       new HttpException(
  //         {
  //           status: HttpStatus.UNPROCESSABLE_ENTITY,
  //           errors: {
  //             user: 'wrongToken',
  //           },
  //         },
  //         HttpStatus.UNPROCESSABLE_ENTITY,
  //       ),
  //     );
  //   });
});
