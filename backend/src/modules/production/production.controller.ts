import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current_user.decorator';
import { UserData } from '../../domain/entities/user.entity';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../common/dto/pagination.dto';
import { ProductionResponseDto } from './dto/production-response.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { CreateProductionDto } from './dto/create-production.dto';

const PaginatedProductionDto = PaginatedResponseDto(ProductionResponseDto);

@Controller('productions')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) {}

    @Get()
    @ApiOperation({ summary: 'Get all productions' })
    async getProductions(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedProductionDto>> {
        const { limit, offset } = params;
        return await this.productionService.getProductions(user, offset, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get production by id' })
    async getProduction(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductionResponseDto> {
        return await this.productionService.getProduction(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new production' })
    async createProduction(
        @Body() params: CreateProductionDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionResponseDto> {
        return this.productionService.createProduction(params, user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing production' })
    async updateProduction(
        @Param('id') id: number,
        @Body() params: UpdateProductionDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionResponseDto> {
        return this.productionService.updateProduction(
            {
                id,
                ...params,
            },
            user,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a production' })
    async deleteProduction(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductionResponseDto> {
        return this.productionService.deleteProduction(id, user);
    }
}
