import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

@Injectable()
export class DealsService {

  constructor(private http: HttpClient) { }

  get relativeDates(): Array<string> {
    return [
      dayjs().add(1, 'day').add(8, 'hour').add(10, 'second').format('MM/DD/YYYY HH:mm:ss') as string,
      dayjs().add(7, 'day').format('MM/DD/YYYY') as string,
      dayjs().subtract(1, 'month').format('MM/DD/YYYY') as string,
      dayjs().add(2, 'month').format('MM/DD/YYYY') as string
    ];
  }

  public getListingData(): Observable<any> {
    return this.http.get('./assets/sample-data/deals/listing.json')
    .pipe(
      map(
        (data: any) => {
          // Using rest operator to divide the data (see: https://dev.to/napoleon039/how-to-use-the-spread-and-rest-operator-4jbb)
          const {items, ...otherData} = data;

          const itemsWithRelativeDates = items.map((dealItem: any, index: number) => {
            // Relative date (better to showcase UI micro-interactions)
            return {...dealItem, expirationDate: this.relativeDates[index]};
          });

          // Using spread operator to concat the data (see: https://dev.to/napoleon039/how-to-use-the-spread-and-rest-operator-4jbb)
          return {...otherData, items: itemsWithRelativeDates};
        }
      )
    );
  }

  public getDetailsData(): Observable<any> {
    return this.http.get('./assets/sample-data/deals/details.json')
    .pipe(
      map(
        (data: any) => {
          const expirationDate = dayjs().add(1, 'day').add(8, 'hour').add(10, 'second').format('MM/DD/YYYY HH:mm:ss') as string;
          return {...data, expirationDate};
        }
      )
    );
  }
}
