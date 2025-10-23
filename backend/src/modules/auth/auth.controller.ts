import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { LoginDto, RegisterUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokensDto } from './dto/auth-token.dto';
import { UserDto } from '../users/dto/user.dto';
import { Cookie } from '../../shared/decorators/cookies.decorator';
import { Public } from '../../shared/decorators/public.decorator';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiOkResponse({
        description: 'User registered successfully',
        type: UserDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid registration data' })
    async register(@Body() registerDto: RegisterUserDto) {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user and set refresh token cookie' })
    @ApiOkResponse({
        description: 'User logged in successfully',
        type: AuthTokensDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid login credentials' })
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const tokens = await this.authService.login(loginDto);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const refreshExp: number = ms(
            this.configService.get('JWT_REFRESH_EXPIRE', '60d'),
        );

        if (!tokens) {
            throw new BadRequestException('No token provided');
        }

        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.cookie('refreshtoken', tokens.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
            expires: new Date(Date.now() + refreshExp),
        });
        res.status(HttpStatus.OK).send({ access_token: tokens.accessToken });
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiOkResponse({
        description: 'Access token refreshed successfully',
        type: AuthTokensDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid refresh token' })
    async refreshToken(
        @Cookie('refreshtoken') refreshToken: string,
        @Res() res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(refreshToken);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const refreshExp: number = ms(
            this.configService.get('JWT_REFRESH_EXPIRE', '60d'),
        );
        const isProd = this.configService.get('NODE_ENV') === 'production';
        res.cookie('refreshtoken', tokens.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
            expires: new Date(Date.now() + refreshExp),
        });
        res.status(HttpStatus.OK).send({
            access_token: tokens.accessToken,
        });
    }

    @Get('logout')
    @ApiOperation({ summary: 'Logout a user by clearing refresh token cookie' })
    @ApiOkResponse({ description: 'User logged out successfully' })
    logout(@Cookie('refreshtoken') refreshToken: string, @Res() res: Response) {
        if (refreshToken) {
            res.cookie('refreshtoken', '', {
                httpOnly: true,
                secure: true,
                expires: new Date(),
            });
        }
        res.sendStatus(HttpStatus.OK);
    }
}
