import {Component} from '@angular/core';
import {FieldType, FieldTypeConfig, FormlyModule} from '@ngx-formly/core';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  standalone: true,
  selector: 'formly-field-file',
  template: ` <input type="file" [formControl]="formControl" [formlyAttributes]="field"/> `,
  imports: [
    ReactiveFormsModule,
    FormlyModule
  ]
})
export class FormlyFieldFile extends FieldType<FieldTypeConfig> {
}
