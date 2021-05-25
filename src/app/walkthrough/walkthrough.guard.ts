import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable()
export class WalkthroughGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    const { value } = await Storage.get({ key: 'visitedWalkthrough' });

    if (value === 'true') {
      // this is a returning user, don't show him the walkthrough
      this.router.navigate(['auth']);
      return false;
    } else {
      return true;
    }
  }
}
