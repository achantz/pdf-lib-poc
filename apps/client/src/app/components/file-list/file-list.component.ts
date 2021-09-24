import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileUpload } from '@pdf-lib-poc/api-interfaces';

import { FileService } from './../../services/file.service';

@Component({
  selector: 'pdf-lib-poc-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent {
  constructor(public fileService: FileService, private http: HttpClient) {}

  deleteFile(id: string) {
    if (id) {
      this.fileService.deleteFile(id);
    }
  }
}
