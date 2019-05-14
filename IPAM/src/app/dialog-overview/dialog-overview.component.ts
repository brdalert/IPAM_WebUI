import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SampleService } from '../sample.service';


@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})


export class DialogOverviewComponent implements OnInit {

  showButton: boolean = false;
  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    private sampleService: SampleService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.sampleService.DeleteHost(this.data.host_id)
    .toPromise()
    .then((res) => {
      this.sampleService.ListAllIPs().
      toPromise()
      .then((res) => {
        this.dialogRef.close();
      })
    });
  }

  toggleButton(): void{
    this.showButton = true;
  }
  

}

export interface DialogData {
  ipv4: string;
  ipv6: string;
  host: string;
  host_id: any;
  adapter: string;
  mac: string;  
  records: Records[],
  record_type: any,
  display: boolean,
  AvailableRecords: Records[];
}
  
export interface Records{
  id: any,
  Data: any,
  record_type: string,
  host: any,
  dropDownRecordType: string
}


