import { Body, Controller, Post } from '@nestjs/common';
import { CoordinatorDto, CreateCoordinatorDto } from './dto/coordinator.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { CoordinatorService } from './coordinator.service';
import { UserData } from '../users/user.entity';

@Controller('coordinators')
export class CoordinatorController {
    constructor(private readonly coordinatorService: CoordinatorService) {}

    @Post()
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
