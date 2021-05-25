import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from '../food.service';

@Injectable()
export class FoodDetailsResolver implements Resolve<any> {

  constructor(private foodService: FoodService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    const itemSlug = route.paramMap.get('productId');
    return this.foodService.getDetailsData(itemSlug);
  }
}
