import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';
import { Observable } from 'rxjs';

@Injectable()
export class PdfFormInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      if (request.file) {
        const file = request.file;

        if (file.mimetype && file.path) {
          if (file.mimetype === 'application/pdf') {
            await new PDFExtract()
              .extract(file.path)
              .then(async (data: PDFExtractResult) => {
                if (data.meta?.info?.IsAcroFormPresent) {
                  const pdfDoc = await PDFDocument.load(
                    fs.readFileSync(file.path)
                  );
                  const form = pdfDoc.getForm();

                  if (form.getFields().length > 0) {
                    form.flatten();
                    console.log('Form Flattened');
                    const pdfBytes = await pdfDoc.save();
                    fs.writeFileSync(file.path, pdfBytes);
                  }
                } else if (data.meta?.info?.IsXFAPresent) {
                  console.log('Cannot process PDF with XFA form');
                } else {
                  console.log(
                    'PDF does not contain an AcroForm and does not needs to flattened'
                  );
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    }

    return next.handle();
  }
}
