import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {


  token$ = this._route.params.pipe(
    map(p => p.tokenId),
    map(p => this._http.get<{token: string, tokenId:string, createdAt: string}>(`${this._url}/user/token/${p}`)),
    concatAll(),
    tap(t => {
      localStorage.setItem('token', t.token);
      this._router.navigate(['events']);
    })
  )

  constructor(private _http: HttpClient, 
    @Inject('BACKEND_URL') private _url: string, 
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {

  }

}
