import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { PDFExtract, PDFExtractOptions } from 'pdf.js-extract';

@Injectable()
export class PdfService {
  async isFillablePDF(bytes: ArrayBuffer): Promise<boolean> {
    if (bytes && bytes?.byteLength > 0) {
      const pdfDoc = await PDFDocument.load(bytes);
      const form = pdfDoc.getForm();

      if (form) {
        return true;
      }
    }
    return;
  }

  async isFillablePDFFromPath(path: string): Promise<boolean> {
    if (path) {
      const buffer = fs.readFileSync(path).buffer;
      const pdf = await PDFDocument.load(buffer);
      const form = pdf.getForm();

      if (form) {
        const fields = form.getFields();
        if (fields.length > 0) {
          return true;
        }
      }

      return false;
    }
  }

  async isFillabePDFFromMetadata(path: string): Promise<boolean> {
    if (path) {
      const pdfExtract = new PDFExtract();
      pdfExtract
        .extract(path)
        .then((data) => {
          return true;
        })
        .catch((err) => console.log(err));
    }

    return false;
  }

  getPDFMetadata;
}
