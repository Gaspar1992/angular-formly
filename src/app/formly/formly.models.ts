import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {FormGroup} from "@angular/forms";

export interface FormlyConfig {
  fields: FormlyFieldConfig[];
  form: FormGroup;
  title?: string;
  options: FormlyFormOptions;
  model?: any;
}

export interface FormlyServeResponse {
  id: number,
  title?: string,
  form: FormlyFieldConfig[]
}
