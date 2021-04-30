import React from 'react'

export type ValueType = string

export type TreeNode = {
  parent?: TreeNode | null
  children?: TreeNode[]
  value: ValueType
  title: React.ReactNode
  isLeaf?: boolean
}
