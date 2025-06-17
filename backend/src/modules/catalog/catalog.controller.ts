import {
    Controller,
    Param,
    Get,
    Query,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../shared/dto/pagination.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { UserData } from '../users/user.entity';
import { CatalogResponseDto } from './dto/catalog-response.dto';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog } from './catalog.entity';

const PaginatedCatalogDto = PaginatedResponseDto(CatalogResponseDto);

@Controller('catalogs')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get()
    async getAllActualityCatalogs(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedCatalogDto>> {
        const { offset, limit } = params;
        return this.catalogService.getActualityCatalogs(user, offset, limit);
    }

    @Get(':id')
    async getActualityCatalog(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.getActualityCatalog(id, user);
    }

    @Post()
    async createCatalog(
        @Body() dto: CreateCatalogDto,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.createCatalog(dto, user);
    }

    @Patch(':id')
    async updateCatalog(
        @Param('id') id: number,
        @Body() dto: UpdateCatalogDto,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.updateCatalog({ id, ...dto }, user);
    }

    @Delete(':id')
    async deleteCatalog(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<Catalog> {
        return this.catalogService.deleteCatalog(id, user);
    }
}
