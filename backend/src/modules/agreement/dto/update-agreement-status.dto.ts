import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgreementStatusDto {
    @ApiProperty({
        description: 'Действие над соглашением',
        enum: ['accept', 'cancel'],
        example: 'accept',
    })
    @IsEnum(['accept', 'cancel'])
    @IsNotEmpty()
    action: 'accept' | 'cancel';
}
