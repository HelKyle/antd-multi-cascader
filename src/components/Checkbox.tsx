import React, { useCallback, useMemo } from 'react'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { hasChildChecked, hasParentChecked } from '../libs/utils'
import { MenuItemProps } from './MenuItem'
import MultiCascader from '../container'

export default React.memo((props: Pick<MenuItemProps, 'node'>) => {
  const { node } = props
  const {
    value: containerValue,
    handleSelectChange,
  } = MultiCascader.useContainer()

  const handleClick = useCallback((event: any) => {
    event.stopPropagation()
  }, [])

  const handleChange = useCallback(
    (event: CheckboxChangeEvent) => {
      const { checked } = event.target
      handleSelectChange(node, checked)
    },
    [node]
  )

  const checked = useMemo(() => hasParentChecked(node, containerValue), [
    containerValue,
    node,
  ])
  const indeterminate = useMemo(
    () => !checked && hasChildChecked(node, containerValue),
    [checked, containerValue, node]
  )
  return (
    <Checkbox
      onClick={handleClick}
      onChange={handleChange}
      checked={checked}
      indeterminate={indeterminate}
    />
  )
})
