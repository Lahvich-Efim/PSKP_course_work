import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductionPlanService } from './production-plan.service';
import { CreateProductionPlanDto } from './dto/create-production-plan.dto';
import { ProductionPlanResponseDto } from './dto/production-plan-response.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { UserData } from '../../domain/entities/user.entity';
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

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Production Plans')
@Controller('plans')
export class ProductionPlanController {
    constructor(
        private readonly productionPlanService: ProductionPlanService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get the last production plan' })
    @ApiOkResponse({
        description: 'Successfully retrieved the last production plan',
        type: ProductionPlanResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    @ApiNotFoundResponse({ description: 'Production plan not found' })
    async getActualityProductionPlan(
        @Query() { offset, limit }: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto | null> {
        return await this.productionPlanService.getLastProductionPlan(
            user,
            offset,
            limit,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create a new production plan' })
    @ApiCreatedResponse({
        description: 'The production plan has been successfully created.',
        type: ProductionPlanResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createProductionPlan(
        @Body() params: CreateProductionPlanDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto | null> {
        return await this.productionPlanService.createProductionPlan(
            params,
            user,
        );
    }

    @Get('calculate')
    @ApiOperation({ summary: 'Calculate the production plan' })
    @ApiOkResponse({
        description: 'Production plan calculated successfully',
        type: ProductionPlanResponseDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    @ApiBadRequestResponse({
        description: 'Plan already calculated or invalid state',
    })
    async calculateProductionPlan(
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto | null> {
        return await this.productionPlanService.calculateProductionPlan(user);
    }
}
