import { Component, ViewChild, ElementRef, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})
export class FileInputComponent implements ControlValueAccessor {
  @Input() public readonly multiple: boolean = false;
  @ViewChild('fileInput', { static: true }) private fileInput: ElementRef;
  private _value: File[] = [];
  propagateChange = (_: any) => {};

  get value() {
    return this._value;
  }

  set value(file: File[]) {
    this._value = file;
    this.propagateChange(this.multiple ? this._value : this._value[0]);
  }

  constructor() { }

  writeValue(value: File[]) {
    this.value = value || [];
  }

  registerOnTouched() {

  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  inputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    this.value = Array.from(files);
  }

  openFileSelect() {
    (this.fileInput.nativeElement as HTMLElement).click();
  }
}
