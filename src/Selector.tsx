import React, { Ref, useCallback } from 'react'
import { CloseOutlined, CloseCircleFilled } from '@ant-design/icons'
import classnames from 'classnames'
import { TreeNode } from './index.d'
import { Props } from './MultiCascader'
import MultiCascaderContainer from './container'
import { prefix } from './constants'

export interface SelectorProps extends Props {
  onRemove: (value: TreeNode) => void
  onClear: () => void
  forwardRef?: Ref<HTMLDivElement>
}

const Tag = (props: {
  onRemove: SelectorProps['onRemove']
  item: TreeNode
}) => {
  const { onRemove, item } = props
  const handleRemove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (onRemove) {
      onRemove(item)
    }
  }

  return (
    <span className="ant-select-selection-item">
      <span className="ant-select-selection-item-content">{item.title}</span>
      <span className="ant-select-selection-item-remove">
        <CloseOutlined onClick={handleRemove} />
      </span>
    </span>
  )
}

const Selector = (props: SelectorProps) => {
  const {
    onRemove,
    placeholder,
    allowClear,
    onClear,
    forwardRef,
    className,
    disabled,
    data,
    selectAll,
    value,
    onChange,
    okText,
    cancelText,
    selectAllText,
    onCascaderChange,
    popupTransitionName,
    ...rest
  } = props
  const { selectedItems } = MultiCascaderContainer.useContainer()

  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.stopPropagation()
      if (onClear) {
        onClear()
      }
    },
    [onClear]
  )

  return (
    <div
      className={classnames(
        prefix,
        'ant-select ant-tree-select ant-select-multiple',
        className,
        {
          'ant-select-disabled': disabled,
        }
      )}
      ref={forwardRef}
      {...rest}
    >
      <div
        className="ant-select-selector"
        style={{ paddingRight: !disabled && allowClear ? '24px' : undefined }}
      >
        {selectedItems.length ? (
          selectedItems.map((item) => {
            return (
              <Tag
                key={item.value.toString()}
                onRemove={onRemove}
                item={item}
              />
            )
          })
        ) : (
          <span
            className={`${prefix}-placeholder ant-select-selection-placeholder`}
          >
            {placeholder}
          </span>
        )}
      </div>
      {!disabled && allowClear ? (
        <span className="ant-select-clear" onClick={handleClear}>
          <CloseCircleFilled />
        </span>
      ) : null}
    </div>
  )
}

export default Selector
