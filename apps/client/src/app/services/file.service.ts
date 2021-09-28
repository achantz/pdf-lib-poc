import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileUpload } from '@pdf-lib-poc/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private _fileList: BehaviorSubject<FileUpload[]> = new BehaviorSubject<
    FileUpload[]
  >([]);
  public readonly fileList$: Observable<FileUpload[]> =
    this._fileList.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<FileUpload[]>('/api/file-upload').subscribe((res) => {
      this._fileList.next(res);
    });
  }

  uploadFile(file: File) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.http
        .post<FileUpload>('/api/file-upload', formData)
        .subscribe((res) => {
          this._fileList.next([...this._fileList.value, res]);
          console.log(res);
        });
    }
    return;
  }

  deleteFile(id: string) {
    if (id) {
      this.http.delete(`/api/file-upload/${id}`).subscribe((res) => {
        this._fileList.next(this._fileList.value.filter((s) => s._id !== id));
        console.log(res);
      });
    }

    return;
  }
}
