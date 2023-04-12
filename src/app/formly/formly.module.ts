import {NgModule} from "@angular/core";
import {FormlyFieldTabs} from "./components/tabs.component";
import {FormlyModule as CoreFormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from "@ngx-formly/material";
import {FormlyFieldFile} from "./components/file-input.component";

@NgModule({
  imports: [
    CoreFormlyModule.forRoot({
      types: [
        {name: 'tabs', component: FormlyFieldTabs},
        {name: 'file', component: FormlyFieldFile}
      ]
    }),
    FormlyMaterialModule,
  ],
  exports: [CoreFormlyModule]
})
export class FormlyModule {
}
