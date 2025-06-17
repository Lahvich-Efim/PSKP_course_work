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
import { SupplyService } from './supply.service';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../shared/dto/pagination.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { SupplyResponseDto } from './dto/supply-response.dto';
import { UserData } from '../users/user.entity';

const PaginatedSupplyDto = PaginatedResponseDto(SupplyResponseDto);

@Controller('supplies')
export class SupplyController {
    constructor(private readonly supplyService: SupplyService) {}

    @Get()
    async getAllActualitySupplies(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedSupplyDto>> {
        const { offset, limit } = params;
        return this.supplyService.getActualitySupplies(user, offset, limit);
    }

    @Get(':id')
    async getActualitySupplies(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.getSupply(id, user);
    }

    @Post()
    async createSupply(
        @Body() dto: CreateSupplyDto,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.createSupply(dto, user);
    }

    @Patch(':id')
    async updateSupply(
        @Param('id') id: number,
        @Body() dto: UpdateSupplyDto,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.updateSupply({ id, ...dto }, user);
    }

    @Delete(':id')
    async deleteSupply(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.deleteSupply(id, user);
    }
}
