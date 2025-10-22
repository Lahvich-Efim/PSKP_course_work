import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
}
