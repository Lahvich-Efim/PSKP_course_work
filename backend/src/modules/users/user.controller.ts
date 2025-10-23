import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto } from './dto/user.dto';

import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserFilter } from '../../domain/repositories/user.interface';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiOkResponse({ description: 'User found successfully', type: UserDto })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUser(@Param('id') id: string) {
        return this.usersService.getUserById(Number(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({
        description: 'Successfully retrieved users',
        type: [UserDto],
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getUsers(
        @Query() filter: UserFilter,
        @Query('offset') offset?: string,
        @Query('limit') limit?: string,
    ) {
        return this.usersService.getUsers(
            filter,
            offset ? Number(offset) : undefined,
            limit ? Number(limit) : undefined,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiCreatedResponse({
        description: 'The user has been successfully created.',
        type: UserDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.createUser(createUserDto);
    }
}
