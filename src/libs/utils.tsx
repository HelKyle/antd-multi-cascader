import { TreeNode, ValueType } from '../index.d'

// 平铺树结构，方便根据 value（字符串） 获取到所有的 NodeItem 节点
// 添加 parent 链接到父节点
export function flattenTree(root: TreeNode[]): TreeNode[] {
  const res: TreeNode[] = []

  function dfs(nodes: TreeNode[], parent: TreeNode | null = null) {
    if (!nodes) {
      return
    }

    const newChildren: TreeNode[] = []

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const { children } = node

      const newNode = {
        ...node,
        parent,
      }

      res.push(newNode)
      newChildren.push(newNode)
      if (children) {
        dfs(children, newNode)
      }
    }

    if (parent) {
      // eslint-disable-next-line no-param-reassign
      parent.children = newChildren
    }
  }
  dfs(root)

  return res
}

// 是否有子节点（包括自己）被选中
export function hasChildChecked(
  item: TreeNode,
  curValue: ValueType[]
): boolean {
  function dfs(node: TreeNode): boolean {
    if (!node) {
      return false
    }

    const { value, children } = node

    if (curValue.includes(value)) {
      return true
    }
    if (!children) {
      return false
    }
    return children.some((child: TreeNode) => dfs(child))
  }

  return dfs(item)
}

// 是否有父节点（包括自己）被选中
export function hasParentChecked(item: TreeNode, value: ValueType[]): boolean {
  let tmp: TreeNode | null | undefined = item

  while (tmp) {
    if (value.includes(tmp.value)) {
      return true
    }

    tmp = tmp.parent
  }

  return false
}

export function matchAllLeafValue(
  value: string[],
  roots: Array<TreeNode>
): string[] {
  const res: string[] = []

  function dfs(nodes: TreeNode[] | undefined, needed: boolean) {
    if (!nodes) {
      return
    }

    nodes.forEach((node: TreeNode) => {
      const { value: nodeValue, children } = node

      if (needed || value.includes(nodeValue)) {
        if (!children) {
          // 叶子节点
          res.push(nodeValue)
        } else {
          dfs(children, true)
        }
      } else {
        dfs(children, needed)
      }
    })
  }
  dfs(roots, false)

  return Array.from(new Set(res))
}

// 删除所有子孙节点的 value, 不包括自己
// 输入可能是 dirty
export function removeAllDescendanceValue(
  root: TreeNode,
  value: ValueType[]
): ValueType[] {
  const allChildrenValue: ValueType[] = []
  function dfs(node: TreeNode): void {
    if (node.children) {
      node.children.forEach((item) => {
        allChildrenValue.push(item.value)
        dfs(item)
      })
    }
  }
  dfs(root)
  return value.filter((val) => !allChildrenValue.includes(val))
}

// 状态提升
export function liftTreeState(
  item: TreeNode,
  curVal: ValueType[]
): ValueType[] {
  const { value } = item

  // 加入当前节点 value
  const nextValue = curVal.concat(value)
  let last = item

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 如果父节点的所有子节点都已经 checked, 添加该节点 value，继续尝试提升
    if (
      last?.parent?.children!.every((child: TreeNode) =>
        nextValue.includes(child.value)
      )
    ) {
      nextValue.push(last.parent.value)
      last = last.parent
    } else {
      break
    }
  }
  // 移除最后一个满足 checked 的父节点的所有子孙节点 value
  return removeAllDescendanceValue(last, nextValue)
}

// 状态下沉
export function sinkTreeState(root: TreeNode, value: ValueType[]): ValueType[] {
  const parentValues: ValueType[] = []
  const subTreeValues: ValueType[] = []

  function getCheckedParent(
    node: TreeNode | null | undefined
  ): TreeNode | null {
    if (!node) {
      return null
    }
    parentValues.push(node.value)
    if (value.includes(node.value)) {
      return node
    }

    return getCheckedParent(node.parent)
  }

  const checkedParent = getCheckedParent(root)
  if (!checkedParent) {
    return value
  }

  function dfs(node: TreeNode) {
    if (!node.children || node.value === root.value) {
      return
    }
    node.children.forEach((item: TreeNode) => {
      if (item.value !== root.value) {
        if (parentValues.includes(item.value)) {
          dfs(item)
        } else {
          subTreeValues.push(item.value)
        }
      }
    })
  }
  dfs(checkedParent)
  // 替换 checkedParent 下子树的值
  const nextValue = removeAllDescendanceValue(checkedParent, value).filter(
    (item) => item !== checkedParent.value
  )
  return Array.from(new Set(nextValue.concat(subTreeValues)))
}

// checked, unchecked 时重新计算
export function reconcile(
  item: TreeNode,
  checked: boolean,
  value: ValueType[]
): ValueType[] {
  if (checked) {
    // 如果已经有父节点被 checked, 再进行 checked 没有意义，直接忽略
    // 主要是用在避免初始化时传入的 value 结构不合理
    if (hasParentChecked(item, value)) {
      return value
    }
    return liftTreeState(item, value)
  }
  return sinkTreeState(item, value)
}

// 按树的 dfs 前序排
export function sortByTree(value: ValueType[], flattenData: TreeNode[]) {
  // 按照树结构前顺排序
  return flattenData
    .map((node: TreeNode) => {
      return value.includes(node.value) ? node.value : ''
    })
    .filter((tmp) => !!tmp)
}

// 过滤非法数据，排序
export function transformValue(value: ValueType[], flattenData: TreeNode[]) {
  let nextValue: ValueType[] = []
  for (let i = 0; i < value.length; i++) {
    const node = flattenData.find((item) => item.value === value[i])
    if (node) {
      nextValue = reconcile(node, true, nextValue)
    }
  }
  return sortByTree(nextValue, flattenData)
}

export function shallowEqualArray(arrA, arrB) {
  if (arrA === arrB) {
    return true
  }

  if (!arrA || !arrB) {
    return false
  }

  var len = arrA.length

  if (arrB.length !== len) {
    return false
  }

  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

// 通过 value 查找树节点
export function findNodeByValue(
  value: string,
  tree: TreeNode[]
): TreeNode | undefined {
  function findParent(nodes: TreeNode[]): TreeNode | undefined {
    if (!nodes) {
      return undefined
    }
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]

      if (value === node.value) {
        return node
      }
      if (node.children) {
        const foundInChildren = findParent(node.children)
        if (foundInChildren) {
          return foundInChildren
        }
      }
    }
  }

  return findParent(tree)
}
