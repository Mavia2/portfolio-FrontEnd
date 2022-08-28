import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';


import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface FilesUploadMetadata {
  uploadProgress$: Observable<number | undefined>;
  downloadUrl$: Observable<string>;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private readonly storage: AngularFireStorage) {}

  uploadFileAndGetMetadata(
    fileName : string,
    file: File,
  ): FilesUploadMetadata {
    const metadata = {
      contentType: 'image/png',
    };
    const filePath = `1/${new Date().getTime()}_${fileName}`;
    const ref = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = ref.put(
      file,
      metadata,
    );
    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };




  }

  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string,
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL()),
    );
  }
}
