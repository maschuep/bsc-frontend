import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Token } from './interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const queryToken = route.queryParamMap.get('token');
    if(queryToken && route.routeConfig.path === 'events'){
      localStorage.setItem('token',queryToken)
    }
    try {
      const token = localStorage.getItem('token');
      const decoded = decode<Token>(token);
      console.log(decoded)
      return decoded.exp * 1000 > Date.now() ? true : this._router.parseUrl('login');
    } catch { 
      return this._router.parseUrl('login');
    }
  }

}
