import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
    HasLowercase,
    HasNumber,
    HasSpecialChar,
    HasUppercase,
} from '../auth.validator';

export class LoginDto {
    @ApiProperty({ description: 'User username', example: 'john_doe' })
    @IsString({ message: 'Username должен быть строкой' })
    @Length(3, 20, { message: 'Username должен содержать от 3 до 20 символов' })
    @IsNotEmpty({ message: 'Username обязателен' })
    username: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    @IsNotEmpty({ message: 'Пароль обязателен' })
    password: string;
}

export class RegisterUserDto {
    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    @IsNotEmpty({ message: 'Пароль обязателен' })
    @HasUppercase({
        message: 'Пароль должен содержать хотя бы одну заглавную букву',
    })
    @HasLowercase({
        message: 'Пароль должен содержать хотя бы одну строчную букву',
    })
    @HasNumber({ message: 'Пароль должен содержать хотя бы одну цифру' })
    @HasSpecialChar({
        message: 'Пароль должен содержать хотя бы один специальный символ',
    })
    password: string;

    @ApiProperty({ description: 'User username', example: 'john_doe' })
    @IsString({ message: 'Username должен быть строкой' })
    @Length(3, 20, { message: 'Username должен содержать от 3 до 20 символов' })
    @IsNotEmpty({ message: 'Username обязателен' })
    username: string;

    @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
    @IsEmail({}, { message: 'Некорректная почта' })
    @IsNotEmpty({ message: 'Почта обязательна' })
    email: string;

    @ApiProperty({
        description: 'User role',
        enum: Role,
        example: Role.PARTICIPANT,
    })
    @IsEnum(Role, { message: 'Такая роль не существует!' })
    @IsNotEmpty({ message: 'Роль обязательна' })
    role: Role;

    @ApiProperty({ description: 'Name for user profile', example: 'John Doe' })
    @IsString({ message: 'Имя должно быть строкой' })
    @Length(2, 50, { message: 'Имя должно содержать от 2 до 50 символов' })
    @IsNotEmpty({ message: 'Имя обязательно' })
    name: string;

    @ApiProperty({
        description: 'Description (only for participants)',
        required: false,
    })
    @ValidateIf((o: RegisterUserDto) => o.role === Role.PARTICIPANT)
    @IsString({ message: 'Описание должно быть строкой' })
    @Length(0, 1000, {
        message: 'Описание должно содержать до 1000 символов',
    })
    description?: string;
}
