import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ProductionRelationService } from './production-relation.service';
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
import { CurrentUser } from '../../common/decorators/current_user.decorator';
import { UserData } from '../../domain/entities/user.entity';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../common/dto/pagination.dto';
import { CreateProductionRelationDto } from './dto/create-production-relation.dto';
import { ProductionRelationResponseDto } from './dto/production-relation-response.dto';

const PaginatedProductionRelationDto = PaginatedResponseDto(
    ProductionRelationResponseDto,
);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Production Relations')
@Controller('production-relations')
export class ProductionRelationController {
    constructor(
        private readonly productionRelationService: ProductionRelationService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Получить все производственные связи' })
    @ApiOkResponse({
        description: 'Успешно получены производственные связи',
        type: PaginatedProductionRelationDto,
    })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async getProductionRelations(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedProductionRelationDto>> {
        const { limit, offset } = params;
        return this.productionRelationService.getProductionRelations(
            user,
            offset,
            limit,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить производственную связь по ID' })
    @ApiOkResponse({
        description: 'Успешно получена производственная связь',
        type: ProductionRelationResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Связь не найдена' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async getProductionRelation(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductionRelationResponseDto> {
        return this.productionRelationService.getProductionRelation(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Создать новую производственную связь' })
    @ApiCreatedResponse({
        description: 'Производственная связь успешно создана',
        type: ProductionRelationResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Неверные входные данные' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async createProductionRelation(
        @Body() dto: CreateProductionRelationDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductionRelationResponseDto> {
        return this.productionRelationService.createProductionRelation(
            dto,
            user,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить производственную связь' })
    @ApiOkResponse({
        description: 'Производственная связь успешно удалена',
        type: ProductionRelationResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Связь не найдена' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async deleteProductionRelation(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductionRelationResponseDto> {
        return this.productionRelationService.deleteProductionRelation(
            id,
            user,
        );
    }
}
