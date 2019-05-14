import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';



/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-record-form',
  templateUrl: 'record-form.component.html',
  //styleUrls: ['dialog-overview-example.css'],
})
export class RecordFormComponent {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  

}


