import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class UserFriendsResolver implements Resolve<any> {

  constructor(private userService: UserService) { }

  resolve(): Observable<any> {
    return this.userService.getFriendsData();
  }
}
