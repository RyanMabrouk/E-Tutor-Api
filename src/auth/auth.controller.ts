import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType, SuccessResponseType } from './types/response.type';
import { NullableType } from '../utils/types/nullable.type';
import { successResponse } from './constants/response';
import { User as ReqUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/routes/users/domain/user';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { AccessTokenName, RefreshTokenName } from './constants/token-names';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { FastifyReply } from 'fastify';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private configService: ConfigService<AllConfigType>,
  ) {}
  readonly cookiesOptions = this.configService.getOrThrow('auth.cookies', {
    infer: true,
  });

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResponseType> {
    const { refreshToken, token, tokenExpires, ...rest } =
      await this.service.validateLogin(loginDto);
    // Set cookies
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
    // Return response
    return { tokenExpires, ...rest };
  }

  @Post('email/register')
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<SuccessResponseType> {
    console.log('createUserDto', createUserDto);
    await this.service.register(createUserDto);
    return {
      ...successResponse,
    };
  }

  @Post('email/confirm')
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<SuccessResponseType> {
    await this.service.confirmEmail(confirmEmailDto.hash);
    return {
      ...successResponse,
    };
  }

  @Post('forgot/password')
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<SuccessResponseType> {
    await this.service.forgotPassword(forgotPasswordDto.email);
    return {
      ...successResponse,
    };
  }

  @Post('reset/password')
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<SuccessResponseType> {
    await this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
    return {
      ...successResponse,
    };
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(@ReqUser() user: JwtPayloadType): Promise<NullableType<User>> {
    return this.service.me(user);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @ReqUser() user: JwtRefreshPayloadType,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    const { refreshToken, token, tokenExpires } =
      await this.service.refreshToken({
        sessionId: user.sessionId,
        hash: user.hash,
      });
    // Set cookies
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
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  public async logout(
    @ReqUser() user: JwtPayloadType,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<SuccessResponseType> {
    await this.service.logout({
      sessionId: user.sessionId,
    });
    // Clear cookies
    void res.clearCookie(AccessTokenName);
    void res.clearCookie(RefreshTokenName);
    // Return response
    return {
      ...successResponse,
    };
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public update(
    @ReqUser() user: JwtPayloadType,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(user, userDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  public async delete(
    @ReqUser() user: JwtPayloadType,
  ): Promise<SuccessResponseType> {
    await this.service.softDelete(user.id);
    return {
      ...successResponse,
    };
  }
}
