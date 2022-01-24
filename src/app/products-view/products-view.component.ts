import { AfterViewInit, Component, OnInit } from '@angular/core';
import {map , catchError, tap, debounceTime, distinctUntilChanged, switchMap, mergeMap, filter} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax'
import { EMPTY, of, fromEvent } from 'rxjs';
import { iproduct } from './../iproduct';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss']
})
export class ProductsViewComponent implements OnInit, AfterViewInit {


  range = this.fb.group({
    from: 0,
    to: 10000
  })

  from = this.range.value["from"];
  to = this.range.value["to"];

  hasresult: Boolean = false;
  products: Array<any> = [];

  loadTime = 3000

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.productsRequest()
  }

  search() {
    (document.querySelector('.container') as HTMLElement).style.display = 'none';
    this.hasresult = false
    this.from = this.range.value["from"]
    this.to = this.range.value["to"]
    this.productsRequest()
  }


  productsRequest() {
    if ((document.getElementById('result') as HTMLElement)) {
      (document.getElementById('result') as HTMLElement).innerHTML = ''
    }
    const obs$ = ajax(`assets/shopproducts.json`).pipe(
      map(userResponse => userResponse.response),
      catchError(error => {
        return of(error);
      })
    )
    .subscribe((value) => {
      this.products = value.filter((v:iproduct) => {
        return v.productPrice >= this.from && v.productPrice <= this.to
      })
      for(let i in value) {
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
        (document.querySelector('.container') as HTMLElement).style.display = 'block';
        (document.getElementById('result') as HTMLElement).style.display = 'flex';
        console.log("finished");
        this.hasresult = true
      }, this.loadTime)
      this.loadTime = 500
    }
    )
  }
}
