import { Component } from '@angular/core';

import { FileService } from './../../services/file.service';

@Component({
  selector: 'pdf-lib-poc-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent {
  constructor(public fileService: FileService) {}

  deleteFile(id: string) {
    if (id) {
      this.fileService.deleteFile(id);
    }
  }
}
