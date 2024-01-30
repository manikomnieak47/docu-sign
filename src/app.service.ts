import { Injectable } from '@nestjs/common';
import { DocuSignService } from './docusign/docusign.service';

@Injectable()
export class AppService {
  constructor(private readonly docuSignService:DocuSignService){
    // docuSignService.requestSignature("Aaa")
    
  }
  getHello(): string {
    this.docuSignService.requestSignature("Aaa")
    return 'Hello World!';
  }
}
