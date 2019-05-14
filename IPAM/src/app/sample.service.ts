import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preambles, Hosts, Adapters, MacAddresses, IPs, Subnets } from './app.component';
import { Records } from '../app/dialog-overview/dialog-overview.component';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  HostLocation: string = 'http://viper.cs.ksu.edu:8080/'
  endpoint: string 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'        
    })
  };
  Host_Name: string
  preamble: Preambles = {
    pa_subnet_name: 'cs-subnet',
    ttl: 5,
    retry: 'false',
    name_server: 'abc',
    serial_number: 12345,
    email_addr: 'marven@ksu.edu',
    expiry: '4w',
    refresh: '1w',
    nxdomain_ttl: 'test'
  }

  host: Hosts = {
    id: 0,
    host_name: 'host1',
  }

  record_insert: RecordInsert = {    
    record_type: null,
    id: null,
    host: null
  }
  new_records: any = []
  new_record_dict: any = {}
  new_record: Records = {
    id: null,
    Data: null,
    record_type: 'A',
    host:null,
    dropDownRecordType: null
  }
  
  recordIDList = []
  new_host: Hosts = {
    host_name: null,
    id: null
  }

  new_adapter: Adapters = {
    host: null,
    adapter_name: null,
    id: null
  }

  new_mac: MacAddresses = {
    id: null,
    mac: null,
    adapter: null
  }

  new_ip: IPs = {
    id: null,
    ipv4: null,
    ipv6: null,
    subnet: null,
    mac_addr: null
  }

  constructor(private http: HttpClient) {    
  }

  AddRecord(hostID,record_type?): Observable<Records> {
   // this.new_records.push(this.new_record)
   this.record_insert.host = hostID
    this.record_insert.record_type = record_type
    return this.http.post<Records>(this.HostLocation + 'ipam/createrecord/', this.record_insert);
  }

  getIP(): Observable<IPInformation> {
    this.endpoint = 'ipam/getip/get/';
    return this.http.get<IPInformation>(this.HostLocation + this.endpoint, { params: {
      ipv4: '192.168.0.1'
    }});
  }

  getInfo() : Observable<any> {
    return this.http.get<any>(this.HostLocation + 'rc_type/');
  }

  AddHost(addInformation: AddHostInformation): void{
    this.endpoint = 'api/AddHost' 
    this.http.post(this.HostLocation + this.endpoint, addInformation, this.httpOptions)
  }

  RemoveHost(Host_Name: string): void{
    this.endpoint = 'api/Hosts/Remove';
    this.http.delete(this.HostLocation + this.endpoint, this.httpOptions)
  }

  ListAllIPs(): Observable<IPInformation[]>{
    this.endpoint = 'ipam/listallips/'
    return this.http.get<IPInformation[]>(this.HostLocation + this.endpoint);
  }

  ListAvailableIPs(): Observable<IPInformation[]>{
    this.endpoint = 'ipam/listavailaleips/';
    return this.http.get<IPInformation[]>(this.HostLocation + this.endpoint);
  }

  ListIPsByRange(): Observable<IPInformation[]>{
    this.endpoint = 'ipam/IPRange/ipsearch/'
    return this.http.get<IPInformation[]>(this.HostLocation + this.endpoint, {params: {
      startIP: '192.168.0.3',
      endIP: '192.168.0.5'    
    }});
  }

  ///change the return value
  GenerateDNS(): Observable<IPInformation[]>{
    this.endpoint = 'api/Hosts/GenerateDNS'
    return this.http.get<IPInformation[]>(this.HostLocation + this.endpoint);
  }

  ///change the return value
  GenerateDHCP(): Observable<IPInformation[]>{
    this.endpoint = 'api/Hosts/GenerateDHCP'
    return this.http.get<IPInformation[]>(this.HostLocation + this.endpoint);
  }

  PostHosts(host_name): Observable<Hosts>{
    this.endpoint = 'ipam/createhost/';
    this.host.host_name = host_name;
    return this.http.post<Hosts>(this.HostLocation + this.endpoint, this.host);
  }

  PostAdapters(hostID, adapter_name): Observable<Adapters> {
    this.endpoint = 'ipam/createadapter/';
    this.new_adapter.host = hostID;
    this.new_adapter.adapter_name = adapter_name;
    return this.http.post<Adapters>(this.HostLocation + this.endpoint, this.new_adapter)
  }

  UpdateAdapters(hostID, adapter_id, adapter_name): Observable<Adapters> {
    this.endpoint = 'ipam/updateadapter/' + adapter_id + '/';
    this.new_adapter.host = hostID;
    this.new_adapter.adapter_name = adapter_name;
    this.new_adapter.id = adapter_id;
    return this.http.put<Adapters>(this.HostLocation + this.endpoint, this.new_adapter);
  }

  PostMacs(adapterID, mac_address): Observable<MacAddresses>{
    this.endpoint = "ipam/createmac/";
    this.new_mac.mac = mac_address;
    this.new_mac.adapter = adapterID;
    return this.http.post<MacAddresses>(this.HostLocation + this.endpoint, this.new_mac);
  }

  PutIP(mac_id, subnet_id, IP_ID, IPV4, IPV6): Observable<IPs> {
    this.endpoint = 'ipam/updateip/' + IP_ID + '/';
    //this.new_ip.id = id;
    this.new_ip.mac_addr = mac_id;
    this.new_ip.subnet = subnet_id;
    this.new_ip.ipv4 = IPV4;
    this.new_ip.ipv6 = IPV6
    return this.http.put<IPs>(this.HostLocation + this.endpoint, this.new_ip);
  }

  PutMac(adapter_id, mac_id, mac_address): Observable<any>{
    this.endpoint = 'ipam/updatemac/' + mac_id +'/';
    this.new_mac.mac = mac_address;
    this.new_mac.adapter.id = 2;
    this.new_mac.adapter.adapter_name = 'eth0';
   // this.new_mac.adapter.host = 
    return this.http.put<any>(this.HostLocation + this.endpoint, this.new_mac)
  }

  UpdateHost(host_id, host_name): Observable<any> {
    this.endpoint = 'ipam/updatehost/' + host_id + '/';
    this.new_host.id = host_id;
    this.new_host.host_name = host_name
    return this.http.put<any>(this.HostLocation + this.endpoint, this.new_host);
  }

  DeleteHost(id): any {
    this.endpoint = 'ipam/deletehost/'+ id +'/';    
    return this.http.delete<any>(this.HostLocation + this.endpoint);
  } 

  PutRecord(): Observable<Records>{
    this.endpoint = 'ipam/updaterecord/1/';
    this.new_record_dict['A'] = 'BC';
    this.new_record.Data = this.new_record_dict;
    this.new_record.record_type = 'A'
    this.new_records.push(this.new_record);
    return this.http.put<any>(this.HostLocation + this.endpoint, this.new_record_dict)
  }

  GetRecords(): Observable<Records[]>{
    this.endpoint = 'ipam/listrecords/';
    return this.http.get<any>(this.HostLocation + this.endpoint);
  }

  //Add Record Types
  //IP: Record Type of type string

  //Get Record Types
  //List of strings that are the different record types available

  //Create Preamble
  //IP: preamble name of type string
  // ttl of type number
  // retry of type number
  // serial_number of type string
  // name_server of type string
  // email_addr of type string
  // expiry of type number
  // refresh of type number
  // nxdomain_ttl of type number
  // class_type of type string

  // Add Subnets
  //IP: an object of type preamble
  // an object of type role
  // name of type string
  // start_IP or type string
  // end_IP of type string

  //  Add Roles
  // IP: role_name of type string
  // user_name of type string -- optional field

  //  Add Users
  // IP: user_name of type string
  // Password of type string


}

export interface AddHostInformation{
  IP: Number,
  Mac_Address: string,
  Host_Name: string,
  Adapter: string,

}

export interface IPInformation{
  ipv4: string,
  ipv6: string,
  id: number
  Host_Name: string,
  mac_addr?: MacAddresses,
  subnet?: Subnets
}

export interface CascadeRecord {
  record_type: any,
  mac: any,
  host_name: any,
  adapter_name: any
}

export interface RecordInsert{
  record_type: any;
  id: any;  
  host: any;
}
