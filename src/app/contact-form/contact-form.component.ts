import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ApiService } from '../data/api.service';
import { ContactModel } from './contact-form.model';
export interface Contact {
  id:number;
  Name:string;
  Number:string;
}
const ELEMENT_DATA: Contact[] = [];
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit, AfterViewInit {
  ContactModelobj : ContactModel=new ContactModel();
  displayedColumns: string[] = ['id', 'Name', 'Number','Actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  form!: FormGroup;
  showupdate!:boolean;
  data:any;
  constructor(private api:ApiService) { 
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;   
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  } 

  ngOnInit(): void {
    this.showupdate=true;
    this.form=new FormGroup({
      username:new FormControl(''),
      Number:new FormControl('')
    })
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.getAllContacts();
  }
  PostContactDetails()
  {
    this.showupdate=true;
    this.ContactModelobj.Name=this.form.get('username')?.value;
    this.ContactModelobj.Number=this.form.get('Number')?.value;
    this.api.postContact(this.ContactModelobj)
    .subscribe(res=>{
      console.log(res);
      this.getAllContacts();
      this.form.reset();
    })
  }
  getAllContacts()
  {
    this.api.getContact()
    .subscribe(res=>{
      console.log(res);
      this.dataSource.data=res;
    })
  }
  deleteContact(row:any)
  {
    console.log(row);
    this.api.DeleteContact(row.id)
    .subscribe(res=>{
     alert("Contact Deleted");
     this.getAllContacts();
    })
  }
  OnEdit(row:any)
  {
    this.ContactModelobj.id=row.id;
    this.form.controls['username'].setValue(row.Name);
    this.form.controls['Number'].setValue(row.Number);
  }
  updateContact()
  {
    this.ContactModelobj.Name=this.form.get('username')?.value;
    this.ContactModelobj.Number=this.form.get('Number')?.value;
    console.log(this.ContactModelobj.id);
    this.api.UpdateContact(this.ContactModelobj,this.ContactModelobj.id)
    .subscribe(res=>{
      console.log(res);
      this.getAllContacts();
      this.form.reset();
    })
  }
  DeleteAll()
  {
    this.getAllContacts();
    console.log("kishore");
    console.log(this.dataSource.data);
    this.dataSource.data.forEach((element:any) => { 
    this.api.DeleteContact(element.id)
    .subscribe(res=>{
     this.getAllContacts();
    })   
    });
  }
 }

