import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { LoginDto, RegisterUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '../../shared/decorators/cookies.decorator';
import { Public } from '../../shared/decorators/public.decortor';
import * as ms from 'ms';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const tokens = await this.authService.login(loginDto);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const refreshExp: number = ms(
            this.configService.get('JWT_REFRESH_EXPIRE', '60d'),
        );

        if (!tokens) {
            throw new BadRequestException('No token provided');
        }
        res.cookie('refreshtoken', tokens.refreshToken, {
            httpOnly: true,
            secure:
                this.configService.get('MODE', 'developmment') === 'production',
            sameSite: 'lax',
            path: '/',
            expires: new Date(Date.now() + refreshExp),
        });
        res.status(HttpStatus.OK).send({ access_token: tokens.accessToken });
    }

    @Post('refresh')
    async refreshToken(
        @Cookie('refreshtoken') refreshToken: string,
        @Res() res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(refreshToken);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const refreshExp: number = ms(
            this.configService.get('JWT_REFRESH_EXPIRE', '60d'),
        );

        res.cookie('refreshtoken', tokens.refreshToken, {
            httpOnly: true,
            secure:
                this.configService.get('NODE_ENV', 'development') ===
                'production',
            sameSite: 'lax',
            path: '/',
            expires: new Date(Date.now() + refreshExp),
        });
        res.status(HttpStatus.OK).send({
            access_token: tokens.accessToken,
        });
    }

    @Get('logout')
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
