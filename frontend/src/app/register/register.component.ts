import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // ngModel variables
  email: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";
  companyName: string = "";
  companyAddress: string = "";
  phoneNumber: string = "";
  hide = true;                    // For password input functionality


  private apiUrl = 'http://localhost:3000/users/register';
  constructor(private http: HttpClient) { }

  /*
   * Function call to register user. receives inputs from user and matches them with user.js model
  */
  userRegister() {
    this.http.post(this.apiUrl, { email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName, companyName: this.companyName, companyAddress: this.companyAddress, phoneNumber: this.phoneNumber }).subscribe((data: any) => {
      alert("Account Created! Email: " + this.email + " | Password: " + this.password);
    }, () => {
      alert("Please fill out the information!");
    })
  }

}
