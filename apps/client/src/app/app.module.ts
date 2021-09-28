import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileService } from './services/file.service';
import { PdfMetadataService } from './services/pdf-metadata.service';

@NgModule({
  declarations: [AppComponent, FileUploadComponent, FileListComponent],
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule],
  providers: [PdfMetadataService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {}
