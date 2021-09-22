import { Directive, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uploader]',
})
export class UploaderDirective {
  @HostListener('change', ['$event.target.files'])
  onChanges(files: Blob[]) {
    this.readFile(files[0]);
  }

  readFile(file: Blob) {
    const fileReader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileReader.onload = async (e: any) => {
      //DO SOMETHING HERE with e.target.result
      console.log(e.target.result);
    };
    fileReader.readAsText(file);
  }
}
