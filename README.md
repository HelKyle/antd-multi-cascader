# antd-multiple-cascader

A multiple cascader component for antd

[Online Demo](https://codesandbox.io/s/dreamy-jennings-2y1ff?file=/src/App.tsx)

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

| Props       | Type                | Description                                                                     |
| ----------- | ------------------- | ------------------------------------------------------------------------------- |
| value       | string[]            | Selected value                                                                  |
| data        | TreeNode[]          | Cascader options TreeNode { title: string, value: string, children?: TreeNode } |
| allowClear  | boolean             | Whether allow clear                                                             |
| placeholder | string              | The input placeholder                                                           |
| onChange    | (newVal) => void    | Callback when finishing value select                                            |
| selectAll   | boolean             | Whether allow select all                                                        |
| className   | boolean             | The additional css class                                                        |
| style       | React.CSSProperties | The additional style                                                            |
| disabled    | boolean             | Whether disabled select                                                         |
