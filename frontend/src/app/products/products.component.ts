import { Component, OnInit } from '@angular/core';    // Must import OnInit to have before page load
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {                                          // Need to have "implements OnInit" to load before page load
  // To connect to express
  private apiUrl = 'http://localhost:3000/';
  private apiCartUrl = 'http://localhost:3000/users/cart/';

  // Variables for the response from the API and for search functionality
  apiResponse: any = "";                                                                    // Store data from database in variable apiResponse
  searchTerm: string = "";

  // JWT variables
  token = localStorage.getItem("jwt");
  currentUserRole: any = localStorage.getItem("role");
  currentUserName: any = localStorage.getItem("firstName");
  currentUserId: any = localStorage.getItem("_id");
  httpOptions = new HttpHeaders().set("Authorization", "bearer " + this.token);             // Headers options for authorization middleware
  visible: boolean = true;
  loggedVisible: boolean = true;

  constructor(private http: HttpClient) { };

  // Load Products from MongoDB on page load
  ngOnInit() {
    this.ifVisible();
    this.ifLoggedIn();
    this.http.get(this.apiUrl, { headers: this.httpOptions }).subscribe((data: any) => {
      this.apiResponse = data;
    });
  }

  // Hide add items form
  ifVisible() {
    if (this.currentUserRole == "admin") {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  // To verify that a user is logged in
  ifLoggedIn() {
    if (!this.currentUserRole) {
      this.loggedVisible = false;
    }
  }

  // POST on 'Add Item' click
  addItem(itemName: any, priceCost: any, brand: any, description: any) {
    if (!itemName) {                                  // If not name for the item has been inputted
      alert("Input item name!");
    } if (!priceCost) {             // If not price for the item has been inputted and has a positive value
      alert("Input price!");
    } else if (priceCost <= 0) {
      alert("Price must be greater than 0!");
    } else if (this.currentUserRole == "admin") {     // Current user must be an admin
      this.http.post(this.apiUrl, { name: itemName, price: priceCost, brand: brand, description: description }, { headers: this.httpOptions }).subscribe((data: any) => {
        this.apiResponse.push(data);                  // Add new item to the list of items from db
      });
      alert("Name: " + itemName + ". Price: " + priceCost);
    }
  }

  // Function to filter objects
  filterItems(product: string) {                      // Filter object items from search input
    const filterObj = {
      name: product
    }

    this.http.get(this.apiUrl + 'searchTerm?filter=' + JSON.stringify(filterObj)).subscribe((data: any) => { // API call to filter using the search term in the items in the db
      this.apiResponse = data;
    });
  }

  // Function to delete a product
  deleteProduct(product: any) {                       // Function to Delete a product
    if (this.currentUserRole == "admin") {            // Verify that the user has a role of admin
      this.http.delete(this.apiUrl + product, { headers: this.httpOptions }).subscribe(result => {
        this.ngOnInit();                              // Call ngOnInit() to show deletion w/o reloading page
      });
    }
  }

  editProduct(productId: string) {                    // Function to edit a product's details
    let newName = prompt("Enter value for NAME:");    // Receive name/price changes from user through a window prompt
    let newPrice: number | null = null;

    // Check if the user clicked cancel on both prompts
    if (newName === null && newPrice === null) {
      // User clicked cancel on both prompts, do nothing
      return;
    }

    while (!newName) {                                // Valdiation for input to edit name/price
      newName = prompt("Enter value for NAME:");
    }

    while (newPrice === null) {
      let priceInput = prompt("Enter value for Price: ");
      if (priceInput === null) {
        return;
      }
      newPrice = parseFloat(priceInput);
      if (isNaN(newPrice) || newPrice <= 0) {
        alert("Please enter a valid price greater than zero.");
        newPrice = null;
      }
    }

    if (this.currentUserRole == "admin") {
      this.updateProductInCart(productId, newName, newPrice.toString());
      this.http.put(this.apiUrl + productId, { name: newName, price: newPrice }, { headers: this.httpOptions }).subscribe(() => {
        this.ngOnInit();                                // call ngOnInit() to show deletion w/o reloading page
      })
    }
  }

  updateProductInCart(productId: string, newName: string, newPrice: string) {
    for (let i = 0; i < this.apiResponse.length; i++) {
      if (this.apiResponse[i]._id == productId)
        this.apiResponse[i].name = newName;
      this.apiResponse[i].price = newPrice;
    }
  }

  // ----------------------------------- CART ADD -----------------------------------
  addProduct(product: any) {                       // Function to Add a product
    alert("Added " + product.name);
    this.http.get(this.apiCartUrl + this.currentUserId, { headers: this.httpOptions }).subscribe((data: any) => {
      const cart = data.cart;
      for (let i = 0; i < cart.length; i++) {      // If the item already exists in the user's cart
        if (product.name == cart[i]['name']) {
          cart[i]['count'] = cart[i]['count'] + 1; // Increment the value of the item by 1
          this.updateCart(cart);
          return;
        }
      }

      // If the product does not already exist in the user's cart.
      product['count'] = 1;
      cart.push(product);
      this.updateCart(cart);
    })
  }

  updateCart(cart: any) {
    this.http.post(this.apiCartUrl + this.currentUserId, cart, { headers: this.httpOptions }).subscribe((data: any) => { })
  }

}