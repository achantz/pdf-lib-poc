import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';

@Injectable()
export class PdfService {
  async flattenPDF(path: string): Promise<void> {
    if (path && fs.existsSync(path)) {
      const pdfExtract = await new PDFExtract()
        .extract(path)
        .then((data: PDFExtractResult) => {
          return data;
        })
        .catch((err) => {
          console.log(err);
        });

      if (pdfExtract) {
        // flatten pdf if is acroForm
        if (pdfExtract.meta?.info?.IsAcroFormPresent) {
          const pdfDoc = await PDFDocument.load(fs.readFileSync(path));
          const form = pdfDoc.getForm();

          if (form.getFields().length > 0) {
            form.flatten();
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(path + '.pdf', pdfBytes);
          }
        }
      }
    }
  }
}
