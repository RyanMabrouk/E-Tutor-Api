import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { LoginResponseType } from '../auth/types/response.type';
import { FastifyReply } from 'fastify';
import {
  AccessTokenName,
  RefreshTokenName,
} from 'src/auth/constants/token-names';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

// @ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
    private configService: ConfigService<AllConfigType>,
  ) {}
  readonly cookiesOptions = this.configService.getOrThrow('auth.cookies', {
    infer: true,
  });

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResponseType> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);
    const response = await this.authService.validateSocialLogin(
      'google',
      socialData,
    );
    console.log(response);
    const { refreshToken, token, tokenExpires, ...rest } = response;
    void res.clearCookie(AccessTokenName);
    void res.clearCookie(RefreshTokenName);
    void res.setCookie(AccessTokenName, token, {
      ...this.cookiesOptions,
      expires: new Date(Date.now() + tokenExpires),
    });
    void res.setCookie(RefreshTokenName, refreshToken, {
      ...this.cookiesOptions,
      expires: new Date(Date.now() + tokenExpires),
    });
    return { tokenExpires, ...rest };
  }
}
