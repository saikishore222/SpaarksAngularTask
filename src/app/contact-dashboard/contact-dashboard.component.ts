import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../data/api.service';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { ContactModel } from './contact-dashboard.model';
export interface Contact {
  id:number;
  Name:string;
  Number:string;
}
const ELEMENT_DATA: Contact[] = [];
@Component({
  selector: 'app-contact-dashboard',
  templateUrl: './contact-dashboard.component.html',
  styleUrls: ['./contact-dashboard.component.css']
})
export class ContactDashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'Name', 'Number'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  ContactModelobj : ContactModel=new ContactModel();
  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.getAllContacts();
  }
  PostContactDetails()
  {
    let mycompobj=new ContactFormComponent(this.api);
    this.ContactModelobj.Name=mycompobj.form.get('username')?.value;
    this.ContactModelobj.Number=mycompobj.form.get('Number')?.value;
    this.api.postContact(this.ContactModelobj)
    .subscribe(res=>{
      console.log(res);
      this.getAllContacts();
      alert("contact added succesfully");
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
}
