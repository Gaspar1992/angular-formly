import {FieldType, FormlyFieldConfig, FormlyModule} from "@ngx-formly/core";
import {Component} from "@angular/core";
import {MatTabsModule} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'formly-field-tabs',
  template: `
    <mat-tab-group>
      <ng-container *ngFor="let tab of field.fieldGroup; let i = index; let last = last">
        <mat-tab
          [label]="tab.props?.label ?? ''"
          [disabled]="!!tab.props?.disabled"
        >
          <formly-field [field]="tab"></formly-field>
        </mat-tab>
      </ng-container>

    </mat-tab-group>
  `,
  imports: [
    MatTabsModule,
    FormlyModule,
    NgForOf
  ]
})
export class FormlyFieldTabs extends FieldType {
  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return !!field.formControl?.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
