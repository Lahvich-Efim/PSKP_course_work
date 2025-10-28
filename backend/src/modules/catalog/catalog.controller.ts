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
import { UserData } from '../../domain/entities/user.entity';
import { CatalogResponseDto } from './dto/catalog-response.dto';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalog } from '../../domain/entities/catalog.entity';
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
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current_user.decorator';
import { ParseJsonDtoPipe } from '../../common/pipe/parse_json.pipe';
import { CatalogFilterDto } from './dto/catalog-filter.dto';

const PaginatedCatalogDto = PaginatedResponseDto(CatalogResponseDto);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get()
    @ApiOperation({ summary: 'Get all actual catalogs' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual catalogs',
        type: PaginatedCatalogDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getAllActualityCatalogs(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
        @Query('filter', new ParseJsonDtoPipe(CatalogFilterDto))
        filterDto: CatalogFilterDto,
    ): Promise<InstanceType<typeof PaginatedCatalogDto>> {
        const { offset, limit } = params;
        return this.catalogService.getActualityCatalogs(
            user,
            offset,
            limit,
            filterDto,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an actual catalog by ID' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual catalog',
        type: CatalogResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Catalog not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getActualityCatalog(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.getActualityCatalog(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new catalog' })
    @ApiCreatedResponse({
        description: 'The catalog has been successfully created.',
        type: CatalogResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createCatalog(
        @Body() dto: CreateCatalogDto,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.createCatalog(dto, user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing catalog' })
    @ApiOkResponse({
        description: 'The catalog has been successfully updated.',
        type: CatalogResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Catalog not found' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async updateCatalog(
        @Param('id') id: number,
        @Body() dto: UpdateCatalogDto,
        @CurrentUser() user: UserData,
    ): Promise<CatalogResponseDto> {
        return this.catalogService.updateCatalog({ id, ...dto }, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a catalog' })
    @ApiOkResponse({
        description: 'The catalog has been successfully deleted.',
    })
    @ApiNotFoundResponse({ description: 'Catalog not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async deleteCatalog(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<Catalog> {
        return this.catalogService.deleteCatalog(id, user);
    }
}
