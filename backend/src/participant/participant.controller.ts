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
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { CurrentUser } from '../core/decorators/current_user.decorator';
import { Participant } from '../core/entities/participant.entity';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../core/dto/pagination.dto';
import { UserData } from '../core/entities/user.entity';
import { ParticipantResponseDto } from './dto/participant-response.dto';
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

const PaginatedParticipantDto = PaginatedResponseDto(ParticipantResponseDto);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
    constructor(private readonly participantService: ParticipantService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new participant' })
    @ApiCreatedResponse({
        description: 'The participant has been successfully created.',
        type: ParticipantResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createParticipant(
        @Body() dto: CreateParticipantDto,
        @CurrentUser() user: UserData,
    ): Promise<Participant> {
        return this.participantService.createParticipant(
            {
                id: user.id,
                ...dto,
            },
            user,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Get all participants' })
    @ApiOkResponse({
        description: 'Successfully retrieved participants',
        type: PaginatedParticipantDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getParticipants(
        @Query() params: PaginationDto,
    ): Promise<InstanceType<typeof PaginatedParticipantDto>> {
        const { limit, offset } = params;
        return this.participantService.getParticipants({}, offset, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an participant by ID' })
    @ApiOkResponse({
        description: 'Successfully retrieved participant',
        type: ParticipantResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Participant not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getParticipant(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ParticipantResponseDto> {
        const participant = this.participantService.getParticipant(id, user);
        console.log(id, participant);
        return participant;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing participant' })
    @ApiOkResponse({
        description: 'The participant has been successfully updated.',
        type: ParticipantResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Participant not found' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async updateParticipant(
        @Param('id') id: number,
        @Body() updateParticipant: UpdateParticipantDto,
        @CurrentUser() user: UserData,
    ): Promise<Participant> {
        return this.participantService.updateParticipant(
            { id, ...updateParticipant },
            user,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a participant' })
    @ApiOkResponse({
        description: 'The participant has been successfully deleted.',
    })
    @ApiNotFoundResponse({ description: 'Participant not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async deleteParticipant(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<Participant> {
        return this.participantService.deleteParticipant(id, user);
    }
}
