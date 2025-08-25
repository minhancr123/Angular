import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inline-svg',
  template: '',
})
export class InlineSvgComponent implements OnInit {
  @Input() src: string;

  constructor(private el: ElementRef, private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.src, { responseType: 'text' }).subscribe((svg) => {
      this.el.nativeElement.innerHTML = svg;
    });
  }
}
