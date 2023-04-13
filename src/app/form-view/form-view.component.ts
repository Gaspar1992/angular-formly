import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
  buildFormlyConfig,
  FormlyConfig,
  FormlyModule,
  FormlyServeResponse,
  voidFormlyConfig,
} from '../formly';
import { JsonPipe, NgIf } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, filter, map, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  imports: [ReactiveFormsModule, FormlyModule, NgIf, MatButtonModule, JsonPipe],
  encapsulation: ViewEncapsulation.None,
})
export class FormViewComponent implements OnInit {
  public formlyConfig?: FormlyConfig;
  private http: HttpClient = inject(HttpClient);
  private router = inject(ActivatedRoute);

  ngOnInit(): void {
    this.router.queryParams.pipe(map((p) => p['id'])).subscribe((id) => {
      if (id && id <= 9) {
        this.http
          .get<FormlyServeResponse>(`http://localhost:3000/forms/${id}`)
          .pipe(
            map((res) => buildFormlyConfig(res.form, res.title)),
            catchError(() => of(voidFormlyConfig()))
          )
          .subscribe((config) => {
            this.formlyConfig = config;
          });
      } else {
        const formResponse = window.localStorage.getItem('form');
        if (formResponse) {
          try {
            const form = JSON.parse(formResponse);
            this.formlyConfig = buildFormlyConfig(form.form);
          } catch {
            this.formlyConfig = voidFormlyConfig();
          }
        }
      }
    });
  }

  submit() {
    alert(JSON.stringify(this.formlyConfig?.model));
  }
}
