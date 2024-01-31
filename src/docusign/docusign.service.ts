// import { InformedLogger } from '@informed/common';
// import { IDocuSignConfig } from '@informed/env';
import * as docusign from 'docusign-esign';
import { DocxService } from 'src/buffer/buffer.service';
// import { ISignatureMetadata } from '../model';
// import { ISignable } from '../model/signable';
// import { SignatureRequest } from '../model/signature-requests';
// import { "CustomFieldReferenceName", CustomFieldSignatureIdName, EnvelopeStatus } from './docusign';

export class DocuSignService {
  config;
  logger;

  constructor(
    config,
    logger,
    private readonly docxService: DocxService,
  ) {
    this.config = {
      tenantId: 'libera',
      integrationKey: '76d62a30-4ba4-4530-b8d8-e2c94ac9749e',
      accountId: '7831bbae-8882-4c1c-b075-9a4f582f6d9e',
      userId: '21433082-0f09-453c-b8d0-df1809c33ea0',
      basePath: 'https://demo.docusign.net/restapi',
      oAuthBasePath: 'account-d.docusign.com',
      anchorString: '/signature/',
      anchorYOffsetInPixels: 30,
      privateKey:
        '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAiARkpRymcFJxinNJRSwcPvorIqThqo8LkqaWKZwpga4cntAo\nOAhd4hhe//E9E8ryGLmD0I0qnlxr+fjkScGLrlkYq5CuZu3v8CHFAgQcnU72RBbN\ngiQJDIQQ/PfTUcWQUJufQ7G1K+82X7M0a6zKXg+VnRLuc61OG3ofSBf/AvNN79tY\nI00SltzWa4okLgIZ5MaOQsn25t+azvCaZ/zHNUtLws199umb6dbp0drCoEzTS8M8\nb7a9Not4sBrITOVoiCpH9cMYXPXoB6p156ktYnQe0rgHC1tRtiUIRnhYxeVOrgif\nWcP8tZXoMFdQmP+XvklY7sEJgzEze+dvI3pD3QIDAQABAoIBAALIcOUQ9ECC61L4\nH2UUgo0bp24eyLA+8NoYDE//I46ank114wYceQvzJYnKk45Cs4KOfymGozsuFxZ8\nVsgXN0atXiwaensIKMXgHFdkIqVpqW/EtgE7lVolyfGHF5I01DUAriOfhfOyF18i\nEUiXto9HSy91eklbH9M/mSwWM5qe51PgLA4dB3GUE2NTtw+1EqtosZXstneDy8Ov\nA7+p+xqDMFlwuEyY66a5CygN710J5mpiVhbNRwlKpC5jPSIAdCpm8ztb5/2qBOo1\n0kku0bzfW2swa6RNqsZGzedpRIRVPPMogZgu5wddBS4BAIDZIONi3mkpZTCCbgB3\nQJBNizkCgYEAu8l3FFDWkxJF0DaLFHRlNZIEjidyruM4Hx1kfN891UeTLIb3TH8i\nupTta+IGZEqjbZa8FyHWFwHqErsg5JPd/WqAl41lzgn8XXxsRBuf+np0s/hl1DwP\n6vVQ2fJEQC4/0Y91j7HFQ8OZLt881GPJRDjUzb4ZMrt314QQ68eJaYUCgYEAuWzK\nk4m1YKYbin9OT+cm7jDNGzW90quDWNsIpu0rrucwL4hAtZ2JMwP9rB6N450XxTSX\nDWnfN2oZqdpsKebEqXYAj6+5WwQDkKQk2fWy45OciCpMDs++opFfIcx+kPnzS8GP\nVnsljIXbVmcae9rKCGTOvd84U2bUCY+VBh/1FHkCgYEAgtXKJphv98YqZ/gojJbQ\nETPsApMPfzQGXP9gjPQJI7kbnFFoqZ6GttKeXKT86RFrriXwZHmJrTwDNwuzzi4L\n4805TN4SSSyB7SyMTiOlIaIB/4YYhHdYa86Bh2gZD1Jp2nsGYJhuJVl5N8QHoL7p\ncqPZ+ILzEXq1860rEOtUHPUCgYBSLLiKMhlDv9msw0Z9er9yCAad7G83kfMfydJH\nyAv381UTe5rR4gMPrNEbGl9fZBtItknLFARsloTRFY+h8jdtsnIFO6c1gs3hqBz8\nyzqASMayQax7U+30NeCnJe1haqQ8Cofvl5vIbvoJjJ/cC9ZFageFdguMSqHlqtAs\narU+YQKBgQCTdIazZN66N1YlO7lWsNohSHgU9HtFDGpKk+nbylaJlI3keMERZUKf\nM322ScA+4nFT8vflFi75ymO9MZZlLqPdsLfcnmzPCR58dlwCPPS4v3Esd8HGC+8r\nR14KVwZQIl7mnrEogyd4Whwyww1Xb3VSgJ57x9wA3H1CiDsy9WxxGg==\n-----END RSA PRIVATE KEY-----',
      apiCredentials: { username: 'api', password: 'test' },
    };
  }

  async downloadDocument(id: string): Promise<Buffer> {
    try {
      const envelopeApi = await this.getEnvelopApi();
      await envelopeApi.signature;
      const docData = await envelopeApi.getDocument(
        this.config.accountId,
        id,
        '1', //documentId
        null,
      );
      const buffer = Buffer.from(docData, 'binary');
      await new DocxService().convertToFiler('sample_result', buffer);
      return buffer;
    } catch (exception) {
      console.log({
        line: 'DocuSign error',
        data: exception?.response || exception,
      });
      throw exception;
    }
  }

  async requestSignature(req): Promise<string> {
    try {
      const envelopeApi = await this.getEnvelopApi();
      const envelope = await this.makeEnvelope(
        req.recipient.email,
        `${req.recipient.firstName} ${req.recipient.lastName}`,
        req.document,
        req.metadata,
      );

      const envelopeOptions = {
        envelopeDefinition: await envelope,
      };

      const result = req.identity
        ? await envelopeApi.update(this.config.accountId, req.identity, {
            ...envelopeOptions,
            resendEnvelope: 'true',
          })
        : await envelopeApi.createEnvelope(
            this.config.accountId,
            envelopeOptions,
          );

      console.log('result = ', result);
      return result.envelopeId;
    } catch (exception) {
      console.log({
        line: 'DocuSign error',
        data: exception?.response || exception,
      });
      throw exception;
    }
  }

  async cancelRequest(id: string): Promise<void> {
    try {
      const envelopesApi = await this.getEnvelopApi();
      const env = await new docusign.Envelope();
      env.status = 'voided';
      env.voidedReason = 'Counselor decision';
      env.envelopId = id;
      envelopesApi.update(
        this.config.accountId,
        id,
        { envelope: env },
        (err, data) => {
          if (err) console.log('err', err);
          console.log('data = ', data);
        },
      );
      // console.log("cancel request = ", result)
    } catch (exception) {
      console.log({
        line: 'DocuSign error',
        data: exception?.response || exception,
      });
      throw exception;
    }
  }

  async getEnvelopStatus(id: string): Promise<void> {
    try {
      const envelopesApi = await this.getEnvelopApi();

      const status = await envelopesApi.getEnvelope(this.config.accountId, id);
      return status;
    } catch (exception) {
      console.log({
        line: 'DocuSign error',
        data: exception?.response || exception,
      });
      throw exception;
    }
  }

  // Helper used in creation
  private async makeEnvelope(
    email: string,
    name: string,
    documentBuffer: Buffer,
    metadata: any,
  ) {
    const document = docusign.Document.constructFromObject({
      documentBase64: (await this.convertToBuffer())?.toString('base64'),
      name: 'plan-agreement',
      fileExtension: 'docx',
      documentId: 1,
    });

    const signHere1 = docusign.SignHere.constructFromObject({
      anchorString: this.config.anchorString,
      anchorYOffset: this.config.anchorYOffsetInPixels,
      anchorUnits: 'pixels',
    });

    const signer1 = docusign.Signer.constructFromObject({
      email: email,
      name: name,
      recipientId: 1,
      routingOrder: '1',
      tabs: docusign.Tabs.constructFromObject({
        signHereTabs: [signHere1],
      }),
    });

    const recipients = docusign.Recipients.constructFromObject({
      signers: [signer1],
    });

    const customFields = docusign.CustomFields.constructFromObject({
      textCustomFields: [
        docusign.TextCustomField.constructFromObject({
          name: 'CustomFieldSignatureIdName',
          required: 'true',
          show: 'false',
          value: metadata?.id,
        }),
        docusign.TextCustomField.constructFromObject({
          name: 'CustomFieldReferenceName',
          required: 'true',
          show: 'false',
          value: JSON.stringify(metadata?.reference),
        }),
      ],
    });

    return docusign.EnvelopeDefinition.constructFromObject({
      emailSubject: 'Authorization Signature',
      documents: [document],
      status: 'sent',
      undefined,
      recipients,
      customFields,
    });
  }

  // Helper
  private async getEnvelopApi() {
    const api = await this.getApiClient();

    const result = new docusign.EnvelopesApi(api);
    console.log('result  =', result);
    return result;
  }

  // Helper Used Helper in envelop creation
  private async getApiClient() {
    const apiClient = new docusign.ApiClient({
      basePath: this.config.basePath,
      oAuthBasePath: this.config.oAuthBasePath,
    });
    apiClient.setBasePath(this.config.basePath);
    apiClient.setOAuthBasePath(this.config.oAuthBasePath);
    const accessToken = await this.getAccessToken(apiClient);

    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    return apiClient;
  }

  // Helper Used in Get Api Client
  private async getAccessToken(apiClient): Promise<string> {
    const jwtLifeSec = 10 * 60;
    return await apiClient
      .requestJWTUserToken(
        this.config.integrationKey,
        this.config.userId,
        ['signature'],
        this.config.privateKey,
        jwtLifeSec,
      )
      .then((val) => val.body.access_token);
  }

  // Converts Documents to buffer
  async convertToBuffer() {
    return await new DocxService().convertToBuffer('sample');
  }
}
