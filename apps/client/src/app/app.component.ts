import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@pdf-lib-poc/api-interfaces';

@Component({
  selector: 'pdf-lib-poc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) {}
}
