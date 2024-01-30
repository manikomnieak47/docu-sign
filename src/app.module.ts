import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocuSignService } from './docusign/docusign.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,DocuSignService],
})
export class AppModule {}
