import { Injectable } from '@nestjs/common';
import { DocuSignService } from './docusign/docusign.service';

@Injectable()
export class AppService {
  constructor(private readonly docuSignService:DocuSignService){
    // docuSignService.requestSignature("Aaa")
    
  }
  async runDocuSign(): Promise<string> {
    
    // CREATE / UPDATE
    // this.docuSignService.requestSignature({
    //     recipient: {
    //       email: 'manik@omniesolutions.com',
    //       firstName: 'manik',
    //       lastName: 'rangar',
    //     },
    //     // identity:'ab192153-b16a-44d1-ac74-184d3004f89e'
    //   })
    
    // DOWNLOAD
    // const downloadResult  = await this.docuSignService.downloadDocument('50f950fc-e345-43f5-bd36-6e62d10af52a')
    // console.log("downloadResult = ", downloadResult)

    // CANCEL REQUEST
    // this.docuSignService.cancelRequest('ef464bc5-37c6-4146-ade4-bff1006d386d')

    //  GET ENVELOP INFO
    // this.docuSignService.getEnvelopStatus('a57274ba-9ef0-4183-acc4-82d4366a323d')
    return 'This is DOCU_SIGN POC';
  }
}
