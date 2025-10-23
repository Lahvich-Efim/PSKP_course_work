import { Body, Controller, Post } from '@nestjs/common';
import { CoordinatorDto, CreateCoordinatorDto } from './dto/coordinator.dto';
import { CurrentUser } from '../core/decorators/current_user.decorator';
import { CoordinatorService } from './coordinator.service';
import { UserData } from '../core/entities/user.entity';
import {
    ApiBearerAuth,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Coordinators')
@Controller('coordinators')
export class CoordinatorController {
    constructor(private readonly coordinatorService: CoordinatorService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new coordinator' })
    @ApiCreatedResponse({
        description: 'The coordinator has been successfully created.',
        type: CoordinatorDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createCoordinator(
        @Body() dto: CreateCoordinatorDto,
        @CurrentUser() user: UserData,
    ): Promise<CoordinatorDto> {
        return this.coordinatorService.createCoordinator({
            ...dto,
            id: user.id,
        } as CreateCoordinatorDto & { id: number });
    }
}
