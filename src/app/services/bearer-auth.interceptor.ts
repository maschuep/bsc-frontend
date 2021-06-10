import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class BearerAuthInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)});
        return next.handle(newReq);
    }
}