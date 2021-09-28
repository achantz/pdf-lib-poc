/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { FileService } from './../../services/file.service';
import { PdfMetadataService } from './../../services/pdf-metadata.service';

//import { getDocument } from 'pdfjs-dist';
@Component({
  selector: 'pdf-lib-poc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  metadata?: any = null;
  isAcroFormPDF = false;
  isXFAPDF = false;
  file: File | null = null;

  constructor(
    private http: HttpClient,
    private pdfMeta: PdfMetadataService,
    private fileService: FileService
  ) {}

  async checkFile($event: any) {
    const file = $event.target.files[0];
    if (file) {
      this.file = file;
      if (file.type === 'application/pdf') {
        await this.pdfMeta
          .readMetadata(file)
          .then((m: any) => {
            this.metadata = m;
            this.isAcroFormPDF = m.info.IsAcroFormPresent;
            this.isXFAPDF = m.info.IsXFAPresent;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.metadata = null;
        this.isAcroFormPDF = false;
        this.isXFAPDF = false;
      }

      // if (this.isXFAPDF) {
      //   alert('This PDF contains a XFA Form and cannot be uploaded.');
      // }
    }
  }

  submit() {
    if (this.file) {
      this.fileService.uploadFile(this.file);
      this.metadata = null;
      this.isAcroFormPDF = false;
      this.isXFAPDF = false;
      (document.getElementById('form') as HTMLFormElement).reset();
    }
  }

  get canSubmit(): boolean {
    //return this.file !== null && !this.isXFAPDF;
    return this.file !== null;
  }
}
