import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { timeout, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'm-action-natification',
  templateUrl: './action-notification.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports :[CommonModule ,  MatButtonModule,
    MatSnackBarModule,
    MatIconModule , MatDialogModule]
})
export class ActionNotificationComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    if (!this.data.showUndoButton || this.data.undoButtonDuration >= this.data.duration) {
      return;
    }

    this.delayForUndoButton(this.data.undoButtonDuration).subscribe(() => {
      this.data.showUndoButton = false;
    });
  }

  delayForUndoButton(timeToDelay) {
    return of('').pipe(delay(timeToDelay));
  }

  public onDismissWithAction() {
    this.data.snackBar.dismiss();
  }

  public onDismiss() {
    this.data.snackBar.dismiss();
  }
}
