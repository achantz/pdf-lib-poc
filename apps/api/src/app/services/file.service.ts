import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { StoredFile } from '../models/stored-file';
import { StoredFiles } from '../models/stored-files';

@Injectable()
export class FileService {
  private rootDir = './files';
  private storeFile = path.join(this.rootDir, 'store.json');

  constructor() {
    this.createStoreFile();
  }

  writeFileToDB(file) {
    const store = this.store;

    if (file && store) {
      const fileToStore: StoredFile = {
        id: file.filename,
        fileName: file.originalname,
        mimeType: file.mimetype,
      };
      store.files.push(fileToStore);
      fs.writeFileSync(this.storeFile, JSON.stringify(store));
    }
  }

  readFilesFromDB(): StoredFiles {
    if (this.store) {
      return this.store;
    }
  }

  async removeFilesFromDB(ids: string[]) {
    if (ids) {
      const store = new StoredFiles();
      const rawData = fs.readFileSync(this.storeFile, 'utf-8');
      store.files = (JSON.parse(rawData) as StoredFiles).files;
      const filtered = store.files.filter((s) => !ids.includes(s.id));
      store.files = filtered;
      fs.writeFileSync(this.storeFile, JSON.stringify(store));
    }
  }

  private get store(): StoredFiles {
    const rawData = fs.readFileSync(this.storeFile, 'utf-8');
    const store = JSON.parse(rawData);
    return store;
  }

  private get storeFileExists(): boolean {
    const storeFileExists = fs.existsSync(this.storeFile);
    return storeFileExists;
  }

  private createStoreFile() {
    if (!this.storeFileExists) {
      const storeObject = new StoredFiles();
      fs.writeFileSync(this.storeFile, JSON.stringify(storeObject));
    }
  }
}
