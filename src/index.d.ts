export type ValueType = string

export type TreeNode = {
  parent?: TreeNode | null
  children?: TreeNode[]
  value: ValueType
  title: string
}
