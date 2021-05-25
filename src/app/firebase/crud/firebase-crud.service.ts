import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

@Injectable()
export class FirebaseCrudService {

  constructor(private afs: AngularFirestore) {}

  /*
    Firebase User Listing Page
  */
  public getListingData(): Observable<any> {
    return this.afs.collection('users').valueChanges({ idField: 'id' })
     .pipe(
       map(actions => actions.map((user: any) => {
          const age = this.calcUserAge(user.birthdate);
          return { age, ...user };
        })
      )
    );
  }

  // Filter users by age
  public searchUsersByAge(lower: number, upper: number): Observable<any> {
    // we save the dateOfBirth in our DB so we need to calc the min and max dates valid for this query
    const minDate = (dayjs(Date.now()).subtract(upper, 'year')).unix();
    const maxDate =  (dayjs(Date.now()).subtract(lower, 'year')).unix();

    const listingCollection = this.afs.collection('users', ref =>
      ref.orderBy('birthdate').startAt(minDate).endAt(maxDate));

    return listingCollection.valueChanges({ idField: 'id' }).pipe(
      map(actions => actions.map((user: any) => {
         const age = this.calcUserAge(user.birthdate);
         return { age, ...user };
       })
     ));
  }

  private calcUserAge(dateOfBirth: number): number {
    return dayjs(Date.now()).diff(dayjs.unix(dateOfBirth), 'year');
  }
}
