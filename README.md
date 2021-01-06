# antd-multiple-cascader

![Test](https://github.com/HelKyle/antd-multi-cascader/workflows/Test/badge.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg) ![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)
![Codecov Coverage](https://img.shields.io/codecov/c/github/HelKyle/antd-multi-cascader/master.svg)

A multiple cascader component for antd

<a href="https://codesandbox.io/s/dreamy-jennings-2y1ff?file=/src/App.tsx" target="_blank">Online Demo</a>

<div style="max-width: 420px">
  <img src="https://raw.githubusercontent.com/HelKyle/antd-multi-cascader/main/demo.png" alt="demo" />
</div>

### How to use?

```
$ npm install antd-multi-cascader or yarn add antd-multi-cascader
```

```js
const [value, setValue] = React.useState<string[]>([]);

return (
  <MultiCascader
    value={value}
    onChange={setValue}
    data={options}
    placeholder="Select Cities"
  />
)
```

### Props

| Props         | Type                | Description                                                                     |
| ------------- | ------------------- | ------------------------------------------------------------------------------- |
| value         | string[]            | Selected value                                                                  |
| data          | TreeNode[]          | Cascader options TreeNode { title: string, value: string, children?: TreeNode } |
| allowClear    | boolean             | Whether allow clear                                                             |
| placeholder   | string              | The input placeholder                                                           |
| onChange      | (newVal) => void    | Callback when finishing value select                                            |
| selectAll     | boolean             | Whether allow select all                                                        |
| className     | boolean             | The additional css class                                                        |
| style         | React.CSSProperties | The additional style                                                            |
| disabled      | boolean             | Whether disabled select                                                         |
| okText        | string              | The text of the Confirm button                                                  |
| cancelText    | string              | The text of the Cancel button                                                   |
| selectAllText | string              | The text of the SelectAll radio                                                 |
