import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class UserProfileResolver implements Resolve<any> {

  constructor(private userService: UserService) { }

  resolve(): Observable<any> {
    return this.userService.getProfileData();
  }
}
