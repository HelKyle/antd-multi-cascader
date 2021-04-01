import React, { useEffect, useRef, useState } from 'react'
import { TreeNode } from '../index.d'
import { Props } from './MultiCascader'
import MultiCascader from '../container'
import { prefix } from '../constants'
import MenuItem from './MenuItem'

const Column = (props: {
  item: TreeNode[]
  columnWidth?: number
  depth: number
}) => {
  const { item, columnWidth, depth } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(columnWidth)

  // 固定宽度，避免切换时菜单跳动的问题
  useEffect(() => {
    const { width: refWidth } = ref.current!.getBoundingClientRect()
    setWidth(refWidth)
  }, [])

  return (
    <div
      className={`${prefix}-column`}
      style={{ width: `${columnWidth || width}px` }}
      ref={ref}
    >
      <ul>
        {item.map((node: TreeNode) => {
          return (
            <MenuItem key={node.value.toString()} depth={depth} node={node} />
          )
        })}
      </ul>
    </div>
  )
}

export default (props: Props) => {
  const { columnWidth } = props
  const { menuData } = MultiCascader.useContainer()

  return (
    <div className={`${prefix}-menu`}>
      {menuData.map((item, index) => {
        return (
          <Column
            item={item}
            columnWidth={columnWidth}
            depth={index}
            key={item[0]?.value || index}
          />
        )
      })}
    </div>
  )
}
