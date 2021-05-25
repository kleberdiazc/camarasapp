import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FashionService {

  constructor(private http: HttpClient) { }

  public getListingData(): Observable<any> {
    return this.http.get('./assets/sample-data/fashion/listing.json');
  }

  public getDetailsData(): Observable<any> {
    return this.http.get('./assets/sample-data/fashion/details.json');
  }
}
