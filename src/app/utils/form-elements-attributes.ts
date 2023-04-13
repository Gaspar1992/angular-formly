const placeholder = [
  {
    key: 'placeholder',
    type: 'input',
    props: {
      label: 'Placeholder',
    },
  },
];
const label = [
  {
    key: 'label',
    type: 'input',
    props: {
      label: 'Label',
    },
  },
];

const required = [
  {
    key: 'required',
    type: 'checkbox',
    defaultValue: false,
    props: {
      label: 'Required',
    },
  },
];
const input = [
  {
    key: 'value',
    type: 'input',
    props: {
      label: 'Value',
    },
  },
  ...label,
  ...placeholder,
  ...required,
];

const textarea = [
  {
    key: 'autocomplete',
    type: 'checkbox',
    props: {
      label: 'autocomplete',
      value: false,
    },
  },
  {
    key: 'rows',
    type: 'input',
    props: {
      label: 'Rows',
      value: false,
      type: 'text',
    },
  },

  ...label,
  ...placeholder,
  ...required,
];

const select = [...required, ...label];

const checkbox = [
  {
    key: 'autocomplete',
    type: 'checkbox',
    defaultValue: false,
    props: {
      label: 'autocomplete',
      value: false,
    },
  },
  ...label,
  ...required,
];

const radio = [...checkbox];

export const itemProps = { input, textarea, checkbox, radio, select };
