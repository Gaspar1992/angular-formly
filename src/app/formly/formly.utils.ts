import {FormlyConfig} from "./formly.models";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";


export function voidFormlyConfig(): FormlyConfig {
  return {
    fields: [],
    form: new FormGroup<any>({}),
    model: {},
    options: {}
  }
}

export function buildFormlyConfig(fields: FormlyFieldConfig[], title?: string, options: FormlyFormOptions = {}): FormlyConfig {
  return {
    fields,
    form: new FormGroup<any>({}),
    title,
    model: {},
    options
  }
}
