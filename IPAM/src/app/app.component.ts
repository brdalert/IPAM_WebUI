import { Component } from '@angular/core';
import {MatTable} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SampleService } from './sample.service';
import { Observable } from 'rxjs';
import { delay } from 'q';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogOverviewComponent, Records } from './dialog-overview/dialog-overview.component';
//import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent { 
  constructor(private sampleService: SampleService, public dialog: MatDialog){
     
  }
  title = 'IPAM'; 
  dataSource: any;
  returned_record_id: any;
  returned_host_id: any;
  returned_mac_addr: any;

  ipv4: any;
  ipv6: any;
  host: any;
  adapter: any;
  mac: any;
  
  ipResultSet: IPResultSet[] = [];
  currentRecordData: PostUIObject = {};
  postUIObject: PostUIObject = {};

  selectedRow: PostUIObject = {};
  selectedCell: string = '';

  
  AvailableRecordTypes: String[] = []
  AvailabeRecords: Records[] = []
  AllRecordList: Records[] =[]
  hostRecords: Records[] = []
  new_record: Records = {
    id: 22,
  Data: 'A',
  record_type: 'A',
  host: null,
  dropDownRecordType: null
  }

  ngOnInit(){
   // this.getUserInformation();
    //this.getAvailableIPs();
  //this.testRecords.push(this.new_record);
    //this.UpdateIp();
    this.getAllIps();
    //this.getRecords(3);
    //this.PutRecords();
    //this.getIPsByRange()
    //this.PostPreambles()
    //this.PostRecords();
    //this.DeleteHost(6);
    // if(this.returned_record_id != null){
    //   this.PostHosts(this.returned_record_id);
    // }else{
    //   console.log('No ID returned');
    // }
    
  }

  ngOnDestroy(){
    this.hostRecords = [];
  }

  displayedColumns: string[] = ['subnet_name', 'ipv4', 'ipv6', 'host', 'mac_addr', 'adapter'];  
 

  getClick(selectedValue): any{
    this.selectedCell = selectedValue;
  }

  selectRow(row): any{
    this.selectedRow = row;
    if(this.selectedCell == 'ipv4' || this.selectedCell == 'ipv6'){
     this.sampleService.GetRecords()
    .toPromise()
    .then((res) => {
      res.forEach(element => {
        if(this.AvailableRecordTypes.indexOf(element.record_type) < 0){
          this.AvailableRecordTypes.push(element.record_type);
          this.AvailabeRecords.push(element);
        }
      });
      let records = res.find(x => x.host == row['host_id']);
      if(records){
        this.AllRecordList.push(records);
      }
      
      this.openDialog();
        })                    
    }    
  }
    

  getAvailableIPs(): void{
    this.sampleService.ListAvailableIPs()
    .toPromise()
    .then((res) => {
      console.log("hi")
    })
  }

  getAllIps(): void{    
    this.sampleService.ListAllIPs()
    .toPromise()
    .then((res) => {
      res.forEach(x => {           
        let item = new IPResultSet(x.id != null ? x.id : null , x.ipv4, x.ipv6, x.mac_addr != null ? x.mac_addr.adapter.host.host_name: null, x.mac_addr != null ? x.mac_addr.id : null, x.mac_addr != null ? x.mac_addr.mac : null, x.mac_addr !== null ? x.mac_addr.adapter.id : null, x.mac_addr!== null ? x.mac_addr.adapter.adapter_name : null, x.subnet !== null ? x.subnet.id : null, x.subnet !== null ? x.subnet.subnet_name : null, null, x.mac_addr !== null ? x.mac_addr.adapter.host.id : null, null, this.AvailableRecords);        
        this.ipResultSet.push(item)
      })  
      this.dataSource = this.ipResultSet;  
      })
        
  }
  
  getIPsByRange(): void{
    this.sampleService.ListIPsByRange()
    .toPromise()
    .then((res) => {
      console.log("hi")
    })
  } 

  PostAdapters(hostID, adapter_name): any {
    this.sampleService.PostAdapters(hostID, adapter_name)
    .toPromise()
    .then((res) => {
      console.log('Adapter inserted.')
    })
  }
  DeleteHost(hostID): void{
    this.sampleService.DeleteHost(hostID)
    .toPromise()
    .then((res) => {
      console.log('host deleted')
    })
  }

  PutInformation(host_name, ipv4?, ipv6?, mac_address?, adapter_name?, record_type?): void {
    if(this.currentRecordData.host_name !== host_name){
      let host_id = this.ipResultSet.find(x => x.host == this.currentRecordData.host_name).host_id
      this.sampleService.UpdateHost(host_id, host_name)
      .toPromise()
      .then((res) => {
        console.log('host name updated');
      })
    }
    if(record_type !== null){
      let host_id = this.ipResultSet.find(x => x.host == this.currentRecordData.host_name).host_id
      this.sampleService.AddRecord(host_id, record_type)
      .toPromise()
      .then((res) =>{
        console.log('record added on update');
      });
    }
    if(this.currentRecordData.mac_address !== mac_address){
      let mac_id = this.ipResultSet.find(x => x.mac_addr === this.currentRecordData.mac_address).mac_id;
      let adapter_id = 2;
      this.sampleService.PutMac(adapter_id, mac_id, mac_address).
      toPromise()
      .then((res) => {
        console.log('mac address updated');
      });        
    }
    if(this.currentRecordData.adapter_name !== adapter_name){
      let host_id = this.ipResultSet.find(x => x.host == this.currentRecordData.host_name).host_id
      let adapter_id = this.ipResultSet.find(x => x.adapter === this.currentRecordData.adapter_name).adapter_id;
      this.sampleService.UpdateAdapters(host_id, adapter_id, adapter_name)
      .toPromise()
      .then((res) => {
        console.log('adapter name updated');
      });
    }
    if(this.currentRecordData.ipv4 !== ipv4 || this.currentRecordData.ipv6 !== ipv6){
      let mac_id = this.ipResultSet.find(x => x.mac_addr === this.currentRecordData.mac_address).mac_id;
      let ip_id = this.ipResultSet.find(x => x.ipv4 === this.postUIObject.ipv4 || x.ipv4 === this.postUIObject.ipv6).ip_id
      let subnet_id = this.ipResultSet.find(x => x.subnet_name === this.postUIObject.subnet_name).subnet_id;
      this.sampleService.PutIP(mac_id, subnet_id, ip_id, ipv4, ipv6)
      .toPromise()
      .then((res) => {
        console.log('IP name updated')
      });
      //this.getAllIps();
    }
  }

  PutRecords(): void {
    this.sampleService.PutRecord()
    .toPromise()
    .then((res) => {
      console.log('updated record')
    })
  }

  UpdateIp(): void{
    this.sampleService.PutIP('4', '2', '2', '192.168.0.2', 'ipv6')
    .toPromise()
    .then((res) => {
      console.log('update ip called')
    });
  }
  UpdateMac(mac_id, mac_address): void{
    this.sampleService.PutMac(mac_id, mac_address)
    .toPromise()
    .then((res) => {
      console.log('updated mac')
    })
  }  

  PostRecords(host_name, ipv4?, ipv6?, mac_address?, adapter_name?, subnet_name?, record_type?): void {
    this.sampleService.PostHosts(host_name)
    .toPromise()
    .then((res) => {
      this.returned_host_id = res.id
      this.sampleService.AddRecord(this.returned_host_id, record_type)
      .toPromise()
      .then((item) => {
        this.sampleService.PostAdapters(this.returned_host_id, adapter_name)
        .toPromise()
        .then((item) => {
          this.sampleService.PostMacs(item.id, mac_address)
          .toPromise()
          .then((item) => {
            let ip_id = this.ipResultSet.find(x => x.ipv4 === this.postUIObject.ipv4 || x.ipv4 === this.postUIObject.ipv6).ip_id
            let subnet_id = this.ipResultSet.find(x => x.subnet_name == this.postUIObject.subnet_name).subnet_id
              this.sampleService.PutIP(item.id, subnet_id, ip_id, this.postUIObject.ipv4, this.postUIObject.ipv6)
              .toPromise()
              .then((item) => {
                console.log('inserted')
              })
            })
          })
        })           
    })
  }
  
  
  openDialog(): void {    
    this.currentRecordData.ipv4 = this.selectedRow['ipv4'];
    this.currentRecordData.ipv6 = this.selectedRow['ipv6'];
    this.currentRecordData.host_name = this.selectedRow['host'];
    this.currentRecordData.adapter_name = this.selectedRow['adapter'];
    this.currentRecordData.mac_address = this.selectedRow['mac_addr'];
    this.currentRecordData.records = this.selectedRow['records'];
    this.currentRecordData.record_type = this.selectedRow['record_type'];
    this.currentRecordData.subnet_name = this.selectedRow['subnet_name'];
    this.currentRecordData.record_type = this.selectedRow['record_type'];
    this.currentRecordData.host_id = this.ipResultSet.find(x => x.host === this.selectedRow['host']).host_id;

    const dialogRef = this.dialog.open(DialogOverviewComponent, {
    width: '700px',
    data: {ipv4: this.selectedRow['ipv4'], ipv6: this.selectedRow['ipv6'], host: this.selectedRow['host'], adapter: this.selectedRow['adapter'], mac: this.selectedRow['mac_addr'], records: this.AllRecordList, record_type: this.currentRecordData.record_type, display: this.AllRecordList.length > 0 ? true: false, AvailableRecords: this.AvailabeRecords, host_id: this.currentRecordData.host_id }
    });
   


    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
      this.postUIObject.ipv4 = result.ipv4;
      this.postUIObject.ipv6 = result.ipv6;
      this.postUIObject.host_name = result.host;
      this.postUIObject.mac_address = result.mac;
      this.postUIObject.adapter_name = result.adapter;
      this.postUIObject.subnet_name = this.currentRecordData.subnet_name;
      this.postUIObject.record_type = result.record_type;

      if(this.currentRecordData.mac_address != null){
        this.PutInformation(this.postUIObject.host_name, this.postUIObject.ipv4, this.postUIObject.ipv6, this.postUIObject.mac_address, this.postUIObject.adapter_name, this.postUIObject.record_type);
      }
      else{
        this.PostRecords(this.postUIObject.host_name, this.postUIObject.ipv4, this.postUIObject.ipv6, this.postUIObject.mac_address, this.postUIObject.adapter_name, this.postUIObject.subnet_name, this.postUIObject.record_type);
        }          
      }
      this.AllRecordList = [];
    });

    
}

}

export interface IPs{
  id: any,
  ipv4: any,
  ipv6: any,
  subnet: any,
  mac_addr: any  
}

export interface Subnets{
  id: Number,
  subnet_name: any,
  Preamble_ID: Preambles,
  Role_ID: any
}

export interface Roles{
  Name: string,
  Subnet_ID: Number,
  User_ID: Number
}

export interface MacAddresses{
  id: Number,
  mac: string,
  adapter: Adapters
}

export interface Preambles{
  pa_subnet_name: any,
  ttl: any,
  retry: any,
  serial_number: any,
  name_server: any,
  email_addr: any,
  expiry: any,
  refresh: any,
  nxdomain_ttl: any
}

export interface Hosts{
  id: number,
  host_name: any,
}

export interface Record_Types{
  Type: string
}

export interface Users{
  User_ID: Number,
  User_Name: string
}

export interface Adapters{
  adapter_name: string,
  host: Hosts,
  id: any
}

export interface PostUIObject{
  ip_id?: any;
  ipv4?: string;
  ipv6?: string;
  host_id?: string;
  host_name?: string;  
  mac_address?: string;
  adapter_name?: string;  
  records?: Records[];
  record_type?: string;
  mac_id?: any;
  subnet_name?: any;
  subnet_id?: any;
}

export class IPResultSet{
  ip_id: any;
  ipv4: any;
  ipv6: any;
  host: any
  mac_id: any
  mac_addr: any;
  adapter_id: any;
  adapter: any;
  subnet_id: any;
  subnet_name: any;
  records: any;  
  host_id: any;
  record_type: any;
  AvailableRecords: any;
  
  
  constructor(id, ipv4, ipv6, host, mac_id, mac_addr, adapter_id, adapter, subnet_id, subnet_name, records, host_Id, record_type, allAvailableRecords){ 
    this.ip_id = id;   
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
    this.host = host;
    this.mac_id = mac_id;
    this.mac_addr = mac_addr;
    this.adapter_id = adapter_id;
    this.adapter = adapter;
    this.subnet_id = subnet_id;
    this.subnet_name = subnet_name; 
    this.records = records;
    this.host_id = host_Id;
    this.record_type = record_type;
    this.AvailableRecords = allAvailableRecords;
  }
}

