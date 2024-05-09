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
  showCapital: boolean = true;
  showLowerCase: boolean = true;
  showSpecialCharacter: boolean = true;
  showLength: boolean = true;

  private apiUrl = 'http://localhost:3000/users/register';
  constructor(private http: HttpClient) { }

  userRole: string;
  roleOptions: string[] = ["admin", "user"];

  ngOnInit() {
    this.ifVisible();
  }

  // Function to hide radio buttons if current account is not an admin
  ifVisible() {
    if (this.currentUserRole == "admin") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  // Function to hide the span as password is entered.
  updatePasswordRequirements() {
    const password = this.password;
    this.showCapital = !/[A-Z]/.test(password);
    this.showLowerCase = !/[a-z]/.test(password);
    this.showSpecialCharacter = !/[^A-Za-z0-9]/.test(password);
    this.showLength = password.length < 6;
  }

  //Function call to register user. receives inputs from user and matches them with user.js model
  userRegister() {
    const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/; // Example regex: At least 1 digit and 1 letter, minimum length 8
    if(this.password.match(passwordRegex)) {
      alert("Password must include capital and lowercase letter, special character, and be at least 6 characters long.")
    }

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
