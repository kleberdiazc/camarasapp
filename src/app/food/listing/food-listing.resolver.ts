import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from '../food.service';

@Injectable()
export class FoodListingResolver implements Resolve<any> {

  constructor(private foodService: FoodService) {}

  resolve(): Observable<any> {
    return this.foodService.getListingData();
  }
}
