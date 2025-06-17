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
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { Participant } from './participant.entity';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../shared/dto/pagination.dto';
import { UserData } from '../users/user.entity';
import { ParticipantResponseDto } from './dto/participant-response.dto';

const PaginatedParticipantDto = PaginatedResponseDto(ParticipantResponseDto);

@Controller('participants')
export class ParticipantController {
    constructor(private readonly participantService: ParticipantService) {}

    @Post()
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
    async getParticipants(
        @Query() params: PaginationDto,
    ): Promise<InstanceType<typeof PaginatedParticipantDto>> {
        const { limit, offset } = params;
        return this.participantService.getParticipants({}, offset, limit);
    }

    @Patch(':id')
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
    async deleteParticipant(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<Participant> {
        return this.participantService.deleteParticipant(id, user);
    }
}
