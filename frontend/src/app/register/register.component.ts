import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // ngModel variables
  email: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";
  companyName: string = "";
  companyAddress: string = "";
  phoneNumber: string = "";
  registeredRole: string = "";
  hide = true;                    // For password input functionality

  isAdmin: boolean = true;
  currentUserRole: any = localStorage.getItem("role");

  private apiUrl = 'http://localhost:3000/users/register';
  constructor(private http: HttpClient) { }

  userRole: string;
  roleOptions: string[] = ["admin", "user"];

  ngOnInit() {
    this.ifVisible();
  }

  ifVisible() {
    if (this.currentUserRole == "admin") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  /*
   * Function call to register user. receives inputs from user and matches them with user.js model
  */
  userRegister() {
    this.http.post(this.apiUrl, {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      phoneNumber: this.phoneNumber,
      role: this.userRole
    }).subscribe((data: any) => {
      console.log(data);
      alert("Account Created! Email: " + this.email + " | Password: " + this.password);
    }, () => {
      alert("Please fill out the information!");
    })
  }

}
