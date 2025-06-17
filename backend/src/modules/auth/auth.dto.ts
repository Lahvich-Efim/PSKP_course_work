import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}

export class RegisterUserDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(Role, { message: 'Такая роль не существует!' })
    @IsNotEmpty()
    role: Role;
}
