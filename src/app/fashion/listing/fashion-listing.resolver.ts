import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FashionService } from '../fashion.service';

@Injectable()
export class FashionListingResolver implements Resolve<any> {

  constructor(private fashionService: FashionService) {}

  resolve(): Observable<any> {
    return this.fashionService.getListingData();
  }
}
