import { JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormlyServeResponse,
  buildFormlyConfig,
  FormlyConfig,
} from '../formly';
import { itemProps } from '../utils/form-elements-attributes';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyModule } from '@ngx-formly/core';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
} from '@ngx-formly/core/lib/models';
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
    MatIconModule,
  ],
})
export class FormGeneratorComponent implements OnInit {
  generatedForm: FormlyServeResponse = { id: 0, title: '', form: [] };

  typeOption = ['input', 'textarea', 'checkbox', 'radio', 'select'] as const;

  defaultForm = {
    id: 'default',
    form: [
      {
        fieldGroupClassName: 'display-flex',
        fieldGroup: [
          {
            className: 'flex-2',

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
            className: 'flex-2',
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
        ],
      },
      {
        fieldGroup: [
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
  editmode = false;
  selectedItem!: string | null;
  constructor(private cd: ChangeDetectorRef, private elem: ElementRef) {}

  ngOnInit(): void {
    this.buildDefaultConfig();
  }

  buildDefaultConfig() {
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

  async onSubmitItem() {
    const obj = {
      key: `${this.formlyConfig?.model['type']}-${await this.makeid()}`,
      type: this.formlyConfig?.model['type'],
      props: JSON.parse(JSON.stringify(this.propsForm.model)),
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
    this.buildPreview(this.generatedForm);
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

  buildPreview(generatedForm: FormlyServeResponse) {
    const previewForm = JSON.parse(JSON.stringify(generatedForm.form));
    this.previewConfig = buildFormlyConfig(
      this.insertBetweenElements(previewForm),
      ''
    );
    setTimeout(() => {
      this.addEventToPreviewElements();
    }, 0);
  }

  insertBetweenElements(arr: any[]) {
    return arr.reduce(
      (acc, el) => acc.concat([{ template: this.buildTemplate(el.key) }, el]),
      []
    );
  }

  buildTemplate(id: string) {
    return `<hr /><div class="preview-buttons id-${id}">
    <span class="delete button-preview">Borrar</span>
    <span class="edit button-preview">Editar</span>
    </div>`;
  }

  addEventToPreviewElements() {
    let previewElements =
      this.elem.nativeElement.querySelectorAll('.preview-buttons');
    previewElements = Array.from(previewElements);
    previewElements.forEach((el: any) => {
      const classArray: string[] = Array.from(el.classList);
      /* find element id  */
      const element = classArray.find((el: string) => el.startsWith('id-'));
      let elementId: string | null;
      if (element) {
        elementId = element.split('-').slice(1).join('-');
      } else {
        elementId = null;
      }
      /* set delete and edit events on buttons */
      if (elementId != null) {
        el.childNodes.forEach((children: any) => {
          children.classList?.contains('delete') &&
            children.addEventListener('click', () =>
              this.onSelectDelete(elementId)
            );
          children.classList?.contains('edit') &&
            children.addEventListener('click', () =>
              this.onSelectEdit(elementId)
            );
        });
      }
    });
  }
  onSelectDelete(id: string | null) {
    const previousForm = this.generatedForm.form;
    const newForm = previousForm.filter((element) => element.key !== id);
    this.generatedForm.form = newForm;
    this.buildPreview(this.generatedForm);
  }

  onSelectEdit(id: string | null) {
    this.editmode = true;
    this.selectedItem = id;
    const selectedElement: any = this.generatedForm.form.find(
      (element) => element.key === id
    );
    if (!this.formlyConfig) return;

    this.formlyConfig.form.patchValue({ type: selectedElement.type });

    Object.keys(selectedElement.props).forEach((key) => {
      this.propsForm.model[key] = selectedElement.props[key];
    });
  }

  resetForm() {
    const elementType: typeof this.typeOption[number] =
      this.formlyConfig?.model['type'];
    if (elementType === 'radio' || elementType == 'select') {
      this.showOptionsForm = true;
      this.buildOptionsConfig();
    }
    this.propsForm = buildFormlyConfig(itemProps[elementType], '');
  }

  cancelEdit() {
    this.resetForm();
    this.editmode = false;
  }

  saveEdit() {
    this.generatedForm.form.forEach((el) => {
      if (el.key === this.selectedItem) {
        el.props = this.propsForm.model;
      }
    });
    this.buildPreview(this.generatedForm);
    this.resetForm();
    this.editmode = false;
  }
}
