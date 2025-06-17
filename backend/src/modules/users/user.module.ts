import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from './user.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
    ],
    exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
