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

const PaginatedSupplyDto = PaginatedResponseDto(SupplyResponseDto);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Supplies')
@Controller('supplies')
export class SupplyController {
    constructor(private readonly supplyService: SupplyService) {}

    @Get()
    @ApiOperation({ summary: 'Get all actual supplies' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual supplies',
        type: PaginatedSupplyDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getActualitySupplies(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedSupplyDto>> {
        const { offset, limit } = params;
        return this.supplyService.getActualitySupplies(user, offset, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an actual supply by ID' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual supply',
        type: SupplyResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Supply not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getActualitySupply(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.getSupply(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new supply' })
    @ApiCreatedResponse({
        description: 'The supply has been successfully created.',
        type: SupplyResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data or supply already exists',
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createSupply(
        @Body() dto: CreateSupplyDto,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.createSupply(dto, user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing supply' })
    @ApiOkResponse({
        description: 'The supply has been successfully updated.',
        type: SupplyResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Supply not found' })
    @ApiBadRequestResponse({
        description: 'Invalid input data or supply conflict',
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async updateSupply(
        @Param('id') id: number,
        @Body() dto: UpdateSupplyDto,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.updateSupply({ id, ...dto }, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a supply' })
    @ApiOkResponse({
        description: 'The supply has been successfully deleted.',
        type: SupplyResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Supply not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async deleteSupply(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<SupplyResponseDto> {
        return this.supplyService.deleteSupply(id, user);
    }
}
