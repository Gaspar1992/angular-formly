import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {buildFormlyConfig, FormlyConfig, FormlyModule, FormlyServeResponse, voidFormlyConfig} from "./formly";
import {JsonPipe, NgIf} from "@angular/common";
import {ActivatedRoute, Params} from "@angular/router";
import {catchError, filter, map, of} from "rxjs";
import {MatButtonModule} from "@angular/material/button";


@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    NgIf,
    MatButtonModule,
    JsonPipe
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {

  public formlyConfig?: FormlyConfig
  private http: HttpClient = inject(HttpClient);
  private router = inject(ActivatedRoute)

  ngOnInit(): void {
    this.router.queryParams.pipe(
      filter((params: Params) => !!params['id'] && !isNaN(params['id'])),
      map(p => p['id'])
    ).subscribe(id => {
      this.http.get<FormlyServeResponse>(`http://localhost:3000/forms/${id}`).pipe(
        map(res => buildFormlyConfig(res.form, res.title)),
        catchError(() => of(voidFormlyConfig()))
      ).subscribe(config => {
        this.formlyConfig = config;
      });
    });

  }

  submit() {
    alert(JSON.stringify(this.formlyConfig?.model));
  }

}
