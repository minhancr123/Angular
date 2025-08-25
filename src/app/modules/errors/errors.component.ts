import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  imports : [RouterModule],
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
