import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private apiUrl = 'http://localhost:3000/users/login';
  constructor(private http: HttpClient) { }
  email: string = "";
  password: string = "";
  hide = true;                    // For password input functionality

  // User login function
  userLogin() {
    this.http.post(this.apiUrl, { email: this.email, password: this.password }).subscribe((data: any) => {
      localStorage.setItem("jwt", data.jwt);                                  // Keep user signed in and keep jwt in localStorage until userLogout() is called
      localStorage.setItem("role", data.role);                                // Set the role in localStorage to the user's role (Need for edit/delete buttons hide)
      localStorage.setItem("email", data.email);
      localStorage.setItem("_id", data._id);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("companyName", data.companyName);
      localStorage.setItem("companyAddress", data.companyAddress);
      localStorage.setItem("phoneNumber", data.phoneNumber);
      alert("Successfully Logged In!");
    }, () => {
      alert("Invalid username/password");
    })
  }

  // User logout function (removes all items from device's localStorage)
  userLogout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("_id");
    localStorage.removeItem("companyAddress");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("companyName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    alert("Logged Out");
  }
}