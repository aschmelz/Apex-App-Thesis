import { Component, ViewChild, OnInit } from '@angular/core';                     // Must import OnInit to have before page load
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // To connect to express
  private apiUrl = 'http://localhost:3000/users/cart/';
  private apiProductsUrl = 'http://localhost:3000/'
  currentUserId: any = localStorage.getItem("_id");

  apiResponse: any = "";                                                           // Store data from database in variable apiResponse
  displayedColumns = ["Name", "Price", "Brand", "Quantity"];                       // Array for the names of the table columns
  dataSource: MatTableDataSource<any>;
  token = localStorage.getItem("jwt");
  httpOptions = new HttpHeaders().set("Authorization", "bearer " + this.token);    // Headers options for authorization middleware
  cart: any = [];
  subtotal: any = 0;

  oldList: any = [];
  newList: any = [];
  newestList: any = [];

  // For paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient) { };

  ngOnInit() {
    this.getRealProducts();
    this.getProducts();
    this.subtotalPrice();
  }

  getRealProducts() {
    this.http.get(this.apiProductsUrl, { headers: this.httpOptions }).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.oldList.push(data[i]);
      }
    })
  }

  // Display products in the user's cart
  async getProducts() {
    this.http.get(this.apiUrl + this.currentUserId, { headers: this.httpOptions }).subscribe(async (data: any) => {
      this.apiResponse = data.cart;
      this.cart = data.cart;
      this.dataSource = new MatTableDataSource(this.apiResponse);
      this.dataSource.paginator = this.paginator;
  
      // When admin changes properties in product's page, update the cart with new properties
      for (let i = 0; i < this.oldList.length; i++) {
        for (let j = 0; j < data.cart.length; j++) {
          if (this.oldList[i]._id === data.cart[j]._id) {
            data.cart[j].name = this.oldList[i].name;
            data.cart[j].price = this.oldList[i].price;
          } else if (!this.oldList.some((oldItem: { _id: any; }) => oldItem._id === data.cart[j]._id)) {
            data.cart.splice(j, 1);
          }
        }
      }
        
      await this.updateCart(data.cart); // Wait for update to finish
    });
  }
  
  // Increment an existing item in user's cart by 1
  addProduct(product: any) {
    for (let i = 0; i < this.cart.length; i++) {
      if (product.name == this.cart[i]['name']) {
        this.cart[i]['count'] = this.cart[i]['count'] + 1;
        this.updateCart(this.cart);
        this.subtotal += product.price;
        return;
      }
    }

    product['count'] = 1;
    this.cart.push(product);
    this.updateCart(this.cart);
  }

  // Decrement an existing item in user's cart by 1
  removeProduct(product: any) {
    for (let i = 0; i < this.cart.length; i++) {
      if (product.name == this.cart[i]['name']) {
        this.cart[i]['count'] = this.cart[i]['count'] - 1;
        if (this.cart[i]['count'] == 0) {
          this.cart.splice(i, 1);
        }
        this.updateCart(this.cart);
        this.subtotal -= product.price;
        return;
      }
    }
  }

  updateCart(cart: any) {
    this.http.post(this.apiUrl + this.currentUserId, cart, { headers: this.httpOptions }).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.cart);
      this.dataSource.paginator = this.paginator;
    })
  }

  // Calculate the subtotal price
  subtotalPrice() {
    this.subtotal = 0;
    this.http.get(this.apiUrl + this.currentUserId, { headers: this.httpOptions }).subscribe(() => {
      for (let i = 0; i < this.cart.length; i++) {
        let prices = this.cart[i].price * this.cart[i].count;
        this.subtotal += prices;
      }
    })
  }
}