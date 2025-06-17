import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParticipantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string | null;
}
