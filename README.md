# antd-multi-cascader

![Test](https://github.com/HelKyle/antd-multi-cascader/workflows/Test/badge.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg) ![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)
![Codecov Coverage](https://img.shields.io/codecov/c/github/HelKyle/antd-multi-cascader/master.svg)

A multiple cascader component for antd

[![antd-multi-cascader](https://nodei.co/npm/antd-multi-cascader.png)](https://npmjs.org/package/antd-multi-cascader)

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

| Props               | Type                                                                                | Description                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| value               | string[]                                                                            | Selected value                                                                                    |
| data                | TreeNode[]                                                                          | Cascader options TreeNode { title: string, value: string, children?: TreeNode, isLeaf?: boolean } |
| allowClear          | boolean                                                                             | Whether allow clear                                                                               |
| placeholder         | string                                                                              | The input placeholder                                                                             |
| onChange            | (newVal) => void                                                                    | Callback when finishing value select                                                              |
| selectAll           | boolean                                                                             | Whether allow select all                                                                          |
| className           | boolean                                                                             | The additional css class                                                                          |
| style               | React.CSSProperties                                                                 | The additional style                                                                              |
| disabled            | boolean                                                                             | Whether disabled select                                                                           |
| okText              | string                                                                              | The text of the Confirm button                                                                    |
| cancelText          | string                                                                              | The text of the Cancel button                                                                     |
| selectAllText       | string                                                                              | The text of the SelectAll radio                                                                   |
| onCascaderChange    | (node: TreeNode, operations: { add: (children: TreeNode[]) => TreeNode[] }) => void | Trigger when click a menu item                                                                    |
| popupTransitionName | string                                                                              | Should set 'ant-slide-up' manually if antd version up to ^4.13.0                                  |

#### Async Data Example

```js
const [asyncOptions, setAsyncOptions] = React.useState([
  {
    value: 'ParentNode1',
    title: 'ParentNode1',
    // tell component this node is not a leaf node
    isLeaf: false,
  },
  {
    value: 'ParentNode2',
    title: 'ParentNode2',
  },
])

const handleCascaderChange = React.useCallback((node, { add }) => {
  // call add function to append children nodes
  if (node.value === 'ParentNode1' && !node.children) {
    setTimeout(() => {
      setAsyncOptions(
        add([
          {
            value: 'ParentNode1-1',
            title: 'ParentNode1-1',
          },
        ])
      )
    }, 1000)
  }
}, [])

<MultiCascader
  selectAll
  data={asyncOptions}
  onCascaderChange={handleCascaderChange}
  placeholder="Async Data"
/>
```
