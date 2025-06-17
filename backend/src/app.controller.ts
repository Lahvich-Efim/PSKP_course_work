import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiCookieAuth()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
}
