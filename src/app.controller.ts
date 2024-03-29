import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {

    appService.runDocuSign()
  }

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.runDocuSign();
  }

}
