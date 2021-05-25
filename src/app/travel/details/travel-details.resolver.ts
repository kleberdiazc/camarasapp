import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TravelService } from '../travel.service';

@Injectable()
export class TravelDetailsResolver implements Resolve<any> {

  constructor(private travelService: TravelService) {}

  resolve(): Observable<any> {
    return this.travelService.getDetailsData();
  }
}
