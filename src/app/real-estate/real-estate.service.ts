import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RealEstateService {

  constructor(private http: HttpClient) { }

  public getListingData(): Observable<any> {
    return this.http.get('./assets/sample-data/real-estate/listing.json');
  }

  public getDetailsData(): Observable<any> {
    return this.http.get('./assets/sample-data/real-estate/details.json');
  }
}
