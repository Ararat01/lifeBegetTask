import { Component, OnInit } from '@angular/core';
import {map , catchError, tap} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax'
import { EMPTY, of } from 'rxjs';
import { iproduct } from './../iproduct';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss']
})
export class ProductsViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.productsRequest()
  }

  hasresult: Boolean = false;

  productsRequest() {
    const obs$ = ajax(`assets/shopproducts.json`).pipe(
      map(userResponse => userResponse.response),
      catchError(error => {
        console.log('error: ', error);
        return of(error);
      })
    )
    .subscribe((value) => {
      console.log(value)
      for(let i in value) {
        console.log(value[i]);
        const product: iproduct = value[i]
        const html = `
          <div class="product">
              <div class="product__img">
                  <img width="100%" src="https://cdn1.vectorstock.com/i/1000x1000/79/10/product-icon-simple-element-vector-27077910.jpg" alt="">
              </div>
              <h2 class="product__name">${product.productName}</h2>
              <p  class="product__price">${product.productPrice}$</p>
              <em  class="product__date product__date_create">${product.createdAt}</em>
              <em class="product__date product__date_update">${product.updatedAt}</em>
          </div>
        `
        document.getElementById('result')?.insertAdjacentHTML('beforeend', html)
      }
    },
    err => EMPTY,
    () => {
      setTimeout(() => {
        (document.getElementById('result') as HTMLElement).style.display = 'flex';
        console.log("finished");
        this.hasresult = true
      }, 2500)
    }
    )
  }
}
