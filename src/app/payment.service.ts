import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {
  public result:any;

 constructor(private _http: Http) { }

 public post(obj){
    return this._http.post('/api/purchase', obj)
                .map(result => this.result = result.json());
  }

}