import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { M } from "../../../../../node_modules/@angular/material/module.d-D1Ym5Wf2";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-input',
  imports: [ MatFormFieldModule , MatInputModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss'
})
export class SearchInput {
  @Input() placeholder: string = 'Tìm kiếm...';
  @Input() value: string = '';

  @Output() search = new EventEmitter<string>();


  onInputChange(event: any) {
    const inputvalue = event.target.value;
    console.log(inputvalue);
    this.search.emit(inputvalue);
  }
}
