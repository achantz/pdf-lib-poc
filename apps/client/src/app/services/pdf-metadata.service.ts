import { Injectable } from '@angular/core';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfMetadataService {
  pdfMimeType = 'application/pdf';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async readMetadata(file: File) {
    if (file) {
      if (file.type === this.pdfMimeType) {
        return new Promise((res) => {
          GlobalWorkerOptions.workerSrc =
            '//cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.js';
          const reader = new FileReader();
          reader.onload = async (e: any) => {
            const buffer = e.target.result;
            const bytes = new Uint8Array(buffer);
            const pdfDocument = await getDocument(bytes).promise.then((doc) => {
              return doc;
            });
            const metadata = await pdfDocument.getMetadata();
            res(metadata);
          };

          reader.readAsArrayBuffer(file);
        });
      }

      return Promise.reject('File is not a pdf');
    }
  }
}
