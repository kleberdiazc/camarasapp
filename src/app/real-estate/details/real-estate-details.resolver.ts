import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RealEstateService } from '../real-estate.service';

@Injectable()
export class RealEstateDetailsResolver implements Resolve<any> {

  constructor(private realEstateService: RealEstateService) {}

  resolve(): Observable<any> {
    return this.realEstateService.getDetailsData();
  }
}
