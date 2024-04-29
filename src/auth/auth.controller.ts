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
import { LoginResponseType } from './types/response.type';
import { NullableType } from '../utils/types/nullable.type';
import { User as ReqUser } from '../shared/decorators/user.decorator';
import { User } from '../routes/users/domain/user';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { AccessTokenName, RefreshTokenName } from './constants/token-names';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { FastifyReply } from 'fastify';
import { UsersService } from 'src/routes/users/users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
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
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    await this.service.register(createUserDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResponseType> {
    const response = await this.service.confirmEmail(confirmEmailDto.hash);
    console.log(response);
    const { refreshToken, token, tokenExpires, ...rest } = response;
    console.log(refreshToken, token);
    void res.clearCookie(RefreshTokenName);
    void res.clearCookie(AccessTokenName);

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

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    await this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    await this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
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
  @HttpCode(HttpStatus.OK)
  public async logout(
    @ReqUser() user: JwtPayloadType,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    await this.service.logout({
      sessionId: user.sessionId,
    });
    // Clear cookies
    void res.clearCookie(AccessTokenName);
    void res.clearCookie(RefreshTokenName);
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
  @HttpCode(HttpStatus.OK)
  public async delete(@ReqUser() user: JwtPayloadType): Promise<void> {
    await this.service.softDelete(user.id);
  }
}
