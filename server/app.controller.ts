import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/columns')
  getColumns(): any {
    return this.appService.getColumns();
  }

  @Post('/api/chat')
  getHello(): any {
    return this.appService.getHello();
  }

  @Post('/api/vector/set')
  setVector(): any {
    return this.appService.setVector();
  }

  @Post('/api/vector/get')
  getVector(@Body() body: Record<string, any>): any {
    return this.appService.getVector(body);
  }
}
