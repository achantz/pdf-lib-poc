import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'pdf-lib-poc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  files: File[] = [];

  constructor(private http: HttpClient) {}

  async upload($event: any) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      '//cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.js';
    const file = $event.target.files[0];
    console.log(file);
    let buffer;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      buffer = e.target.result;
      const bytes = new Uint8Array(buffer);
      await getDocument(bytes).promise.then((doc) => {
        doc.getMetadata().then((meta) => {
          console.log(meta);
        });
      });
    };

    reader.readAsArrayBuffer(file);
  }

  // private extractPdfMetadata(file: File) {

  // }
}
