import { AfterViewInit, Component, OnInit } from '@angular/core';
import {map , catchError } from 'rxjs/operators';
import {ajax} from 'rxjs/ajax'
import { EMPTY, of } from 'rxjs';
import { iproduct } from './../iproduct';
import { FormBuilder } from '@angular/forms';

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


  hasresult: Boolean = false;
  products: Array<iproduct> = [];
  productsFiltered: Array<iproduct> = [];

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.productsRequest()
  }

  search() {
    this.hasresult = false
    this.productsFiltered = this.products.filter((v:iproduct) => {
      return v.productPrice >= this.range.value["from"] && v.productPrice <= this.range.value["to"]
    }).sort((a, b) => a.productPrice - b.productPrice)
    setTimeout(()=>{
      this.hasresult = true
    }, 500)
  }


  productsRequest() {
    if ((document.getElementById('result') as HTMLElement)) {
      (document.getElementById('result') as HTMLElement).innerHTML = '';
    }
    const obs$ = ajax(`assets/shopproducts.json`).pipe(
      map(userResponse => userResponse.response),
      catchError(error => {
        return of(error);
      })
    )
    .subscribe((value) => {
      this.products = value
      this.productsFiltered = value
    },
    err => EMPTY,
    () => {
      setTimeout(() => {
        console.log("finished");
        this.hasresult = true
      }, 3000)
    }
    )
  }
}
