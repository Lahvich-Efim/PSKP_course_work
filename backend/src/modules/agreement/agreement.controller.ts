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
import { AgreementService } from './agreement.service';
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
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { AgreementResponseDto } from './dto/agreement-response.dto';
import { UpdateAgreementStatusDto } from './dto/update-agreement-status.dto';

const PaginatedAgreementDto = PaginatedResponseDto(AgreementResponseDto);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Agreements')
@Controller('agreements')
export class AgreementController {
    constructor(private readonly agreementService: AgreementService) {}

    @Get()
    @ApiOperation({ summary: 'Получить все соглашения' })
    @ApiOkResponse({
        description: 'Успешно получены соглашения',
        type: PaginatedAgreementDto,
    })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async getAgreements(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedAgreementDto>> {
        const { offset, limit } = params;
        return this.agreementService.getAgreements(user, offset, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить соглашение по ID' })
    @ApiOkResponse({
        description: 'Успешно получено соглашение',
        type: AgreementResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Соглашение не найдено' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async getAgreement(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<AgreementResponseDto> {
        return this.agreementService.getAgreement(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Создать новое соглашение' })
    @ApiCreatedResponse({
        description: 'Соглашение успешно создано',
        type: AgreementResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Неверные входные данные или продукты несовместимы',
    })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async createAgreement(
        @Body() dto: CreateAgreementDto,
        @CurrentUser() user: UserData,
    ): Promise<AgreementResponseDto> {
        return this.agreementService.createAgreement(dto, user);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Обновить статус соглашения (принять/отклонить)' })
    @ApiOkResponse({
        description: 'Статус соглашения успешно обновлен',
        type: AgreementResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Соглашение не найдено' })
    @ApiBadRequestResponse({ description: 'Неверные входные данные' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async updateAgreementStatus(
        @Param('id') id: number,
        @Body() dto: UpdateAgreementStatusDto,
        @CurrentUser() user: UserData,
    ): Promise<AgreementResponseDto> {
        return this.agreementService.updateAgreementStatus(
            id,
            dto.action,
            user,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить соглашение' })
    @ApiOkResponse({
        description: 'Соглашение успешно удалено',
        type: AgreementResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Соглашение не найдено' })
    @ApiUnauthorizedResponse({ description: 'Не авторизован' })
    @ApiForbiddenResponse({ description: 'Доступ запрещен' })
    async deleteAgreement(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<AgreementResponseDto> {
        return this.agreementService.deleteAgreement(id, user);
    }
}
