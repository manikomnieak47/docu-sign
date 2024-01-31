import { Injectable } from '@nestjs/common';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class DocxService {
  async convertToBuffer(filename: string): Promise<Buffer> {
    try {
      const filePath = path.join(
        process.cwd(),
        '/src/libs/' + filename + '.docx',
      );
      console.log('filePath = ', filePath);
      return await readFileSync(filePath);
    } catch (error) {
      console.error('Error converting DOCX to buffer:', error);
      throw error;
    }
  }

  async convertToFiler(filename: string, buffer) {
    try {
      const filePath = path.join(
        process.cwd(),
        '/src/libs/' + 'result_' + filename + '.pdf',
      );
      console.log('filePath = ', filePath);
      writeFile(filePath, buffer, 'binary', (err) => {
        if (err) console.log('error occured');
        console.log('success');
      });
    } catch (error) {
      console.error('Error converting DOCX to buffer:', error);
      throw error;
    }
  }
}
