import { BadRequestException } from '@nestjs/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as fs from 'fs';
import { Multer } from 'multer';
import { PDFDocument } from 'pdf-lib';
import { PDFExtract } from 'pdf.js-extract';
import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable()
export class PDFInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    if (context.getType() === 'http') {
      // switch to http context
      const req = context.switchToHttp().getRequest();

      // if has file
      if (req.file) {
        const file = req.file as Express.Multer.File;

        // ensure file exists
        if (fs.existsSync(file.path)) {
          // check if if is pdf file from mimetype
          if (file.mimetype === 'application/pdf' && file.path) {
            // create extraction object
            const extract = new PDFExtract();

            // retrive metadata
            const meta = await extract.extract(file.path);

            if (meta) {
              // throw exeption if there is XFA form data detected
              // this should be evaulated on the client and not allowed to be send to the server if present
              if (meta.meta?.info?.IsXFAPresent) {
                throw new BadRequestException(
                  'Cannot process PDF files with XFA form data as they cannot be flattened.'
                );
              }

              if (meta.meta?.info?.IsAcroFormPresent) {
                const buffer = await fs.readFileSync(file.path);
                const pdfDoc = await PDFDocument.load(buffer);
                const form = pdfDoc.getForm();

                // flatten the form
                form.flatten({ updateFieldAppearances: true });

                // store pdf doc as byte array
                const bytes = await pdfDoc.save();

                // overwrite file wirth flattened version
                fs.writeFileSync(file.path, bytes);
              }
            }
          }
        }
      }
    }

    return next.handle();
  }
}
