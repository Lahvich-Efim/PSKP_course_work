import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto } from './dto/user.dto';

import { UserFilter } from './user.interface';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(Number(id));
    }

    @Get()
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
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.createUser(createUserDto);
    }
}
