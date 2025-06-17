import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductionPlanService } from './production-plan.service';
import { CreateProductionPlanDto } from './dto/create-production-plan.dto';
import { ProductionPlanResponseDto } from './dto/production-plan-response.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { UserData } from '../users/user.entity';

@Controller('production-plans')
export class ProductionPlanController {
    constructor(
        private readonly productionPlanService: ProductionPlanService,
    ) {}

    @Get()
    async getActualityProductionPlan(
        @Query() { offset, limit }: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto> {
        const planData = await this.productionPlanService.getLastProductionPlan(
            user,
            offset,
            limit,
        );
        return plainToInstance(ProductionPlanResponseDto, {
            ...planData,
            period: planData.period.toISOString(),
        });
    }

    @Post()
    async createProductionPlan(
        @Body() params: CreateProductionPlanDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto> {
        const plan = await this.productionPlanService.createProductionPlan(
            params,
            user,
        );
        return {
            ...plan,
            period: plan.period.toISOString(),
        };
    }

    @Get('calculate')
    async calculateProductionPlan(
        @CurrentUser() user: UserData,
    ): Promise<ProductionPlanResponseDto> {
        const plan =
            await this.productionPlanService.calculateProductionPlan(user);
        return {
            ...plan,
            period: plan.period.toISOString(),
        };
    }
}
