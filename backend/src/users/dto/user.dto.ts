import { User } from '../../core/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
    MaxLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UserDto {
    @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
    id: number;

    @ApiProperty({ description: 'User`s username', example: 'username123' })
    username: string;

    @ApiProperty({
        description: 'User`s email address',
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User`s role',
        example: 'PARTICIPANT',
        enum: Role,
    })
    role: 'PARTICIPANT' | 'COORDINATOR';

    static fromEntity(entity: User): UserDto {
        const dto = new UserDto();
        dto.id = entity.id;
        dto.username = entity.username;
        dto.email = entity.email;
        dto.role = entity.role;
        return dto;
    }
}

export class CreateUserDto {
    @ApiProperty({ description: 'User`s username', example: 'new_user' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    username: string;

    @ApiProperty({
        description: 'User`s email address',
        example: 'new_user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User`s password',
        example: 'strongpassword',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'User`s role',
        example: 'PARTICIPANT',
        enum: Role,
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: 'PARTICIPANT' | 'COORDINATOR';
}
