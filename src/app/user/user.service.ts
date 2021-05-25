import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public getProfileData(): Observable<any> {
    return this.http.get('./assets/sample-data/user/user-profile.json');
  }

  public getFriendsData(): Observable<any> {
    return this.http.get('./assets/sample-data/user/user-friends.json');
  }
}
