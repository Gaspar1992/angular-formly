import { JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyServeResponse,
  buildFormlyConfig,
  FormlyConfig,
} from '../formly';
import { itemProps } from '../utils/form-elements-attributes';
import { MatButtonModule } from '@angular/material/button';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFormOptions } from '@ngx-formly/core/lib/models';
@Component({
  selector: 'form-generator',
  standalone: true,
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  imports: [
    NgFor,
    ReactiveFormsModule,
    FormlyModule,
    NgIf,
    MatButtonModule,
    JsonPipe,
  ],
})
export class FormGeneratorComponent implements OnInit {
  generatedForm: FormlyServeResponse = { id: 0, title: '', form: [] };

  typeOption = ['input', 'textarea', 'checkbox', 'radio', 'select'] as const;

  defaultForm = {
    id: 'default',
    form: [
      {
        key: 'id',
        type: 'input',
        props: {
          label: 'FormId',
          placeholder: 'FormId',
          required: true,
          type: 'number',
        },
        hooks: {
          onInit: (field: any) => {
            field.formControl.valueChanges.subscribe((value: number) => {
              this.generatedForm.id = value;
            });
          },
        },
      },
      {
        key: 'title',
        type: 'input',

        props: {
          label: 'Form Title',
          placeholder: 'Form Title',
          required: true,
        },
        hooks: {
          onInit: (field: any) => {
            field.formControl.valueChanges.subscribe((value: string) => {
              this.generatedForm.title = value;
            });
          },
        },
      },
      {
        key: 'type',
        type: 'select',
        defaultValue: 'input',
        expressions: {
          hide: '!model.id',
        },
        props: {
          label: 'Input Type',
          options: [
            {
              label: 'input',
              value: 'input',
            },
            {
              label: 'checkbox',
              value: 'checkbox',
            },
            {
              label: 'textarea',
              value: 'textarea',
            },
            {
              label: 'radio',
              value: 'radio',
            },
            {
              label: 'select',
              value: 'select',
            },
          ],
        },

        hooks: {
          onInit: (field: any) => {
            this.changePropsForm(field);
          },
        },
      },
    ],
  };
  propsForm!: FormlyConfig;
  formlyConfig?: FormlyConfig;
  optionsConfig!: FormlyConfig;
  previewConfig!: FormlyConfig | null;
  item!: any;

  optionsArray: any[] = [];

  optionsForm = {
    id: 'options',
    form: [
      {
        key: 'key',
        type: 'input',
        props: {
          label: 'key',
          placeholder: 'value',
          required: true,
        },
      },
      {
        key: 'value',
        type: 'input',
        props: {
          label: 'value',
          placeholder: 'key',
          required: true,
        },
      },
    ],
  };
  showOptionsForm = false;
  options: FormlyFormOptions = {};

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formlyConfig = buildFormlyConfig(this.defaultForm.form, 'titulo');

    this.formlyConfig?.options.fieldChanges?.subscribe((e) => console.log(e));
  }

  changePropsForm(field: any) {
    field.formControl.valueChanges.subscribe(
      (value: typeof this.typeOption[number]) => {
        if (value === 'radio' || value == 'select') {
          this.showOptionsForm = true;
          this.buildOptionsConfig();
        }
        this.propsForm = buildFormlyConfig(itemProps[value], '');
      }
    );
  }

  saveForm() {
    window.localStorage.setItem('form', JSON.stringify(this.generatedForm));
  }

  onSubmitItem() {
    const obj = {
      key: `${this.formlyConfig?.model['type']}-${this.makeid()}`,
      type: this.formlyConfig?.model['type'],
      props: this.propsForm.model,
      templateOptions: {},
    };

    if (obj.type === 'radio' || obj.type === 'select') {
      obj.templateOptions = {
        ...obj.props,
        type: 'radio',
        options: this.formatOptions(obj.type),
      };
      obj.props = null;
    }

    this.cd.detectChanges();
    this.generatedForm.form.push(obj);
    const objGenerated = JSON.parse(JSON.stringify(this.generatedForm.form));
    this.previewConfig = buildFormlyConfig(objGenerated, '');
    this.optionsArray = [];
  }

  makeid() {
    return (+new Date() * Math.random()).toString(36).substring(0, 6);
  }

  onSaveOption() {
    this.optionsArray.push(this.optionsConfig.model);

    this.buildOptionsConfig();
  }

  formatOptions(type: typeof this.typeOption[number]) {
    if (type === 'radio' || type === 'select') {
      return this.optionsArray.map((option) => ({
        value: option.value,
        label: option.key,
      }));
    } else {
      return null;
    }
  }

  buildOptionsConfig() {
    this.optionsConfig = buildFormlyConfig(this.optionsForm.form, '');
  }
}
