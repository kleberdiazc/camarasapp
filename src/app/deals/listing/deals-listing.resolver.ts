import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DealsService } from '../deals.service';

@Injectable()
export class DealsListingResolver implements Resolve<any> {

  constructor(private dealsService: DealsService) {}

  resolve(): Observable<any> {
    return this.dealsService.getListingData();
  }
}
