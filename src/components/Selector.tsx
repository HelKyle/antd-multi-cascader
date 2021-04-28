import React, { Ref, useCallback } from 'react'
import { CloseOutlined, CloseCircleFilled } from '@ant-design/icons'
import classnames from 'classnames'
import { keyBy } from 'lodash'
import Overflow from 'rc-overflow'
import { TreeNode } from '../index.d'
import { Props } from './MultiCascader'
import MultiCascaderContainer from '../container'
import { prefix } from '../constants'

export interface SelectorProps extends Props {
  onRemove: (value: TreeNode) => void
  onClear: () => void
  forwardRef?: Ref<HTMLDivElement>
}

const Tag = (props: {
  onRemove?: SelectorProps['onRemove']
  item: TreeNode
  renderTitle: Props['renderTitle']
  closable?: boolean
}) => {
  const {
    onRemove,
    item,
    renderTitle = () => undefined,
    closable = true,
  } = props
  const handleRemove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (onRemove) {
      onRemove(item)
    }
  }

  const value = (item.value || item) as string
  const title = renderTitle(value) || item.title || item

  return (
    <span className="ant-select-selection-item">
      <span className="ant-select-selection-item-content">{title}</span>
      {closable && (
        <span className="ant-select-selection-item-remove">
          <CloseOutlined onClick={handleRemove} />
        </span>
      )}
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
    value: valueProps,
    onChange,
    okText,
    cancelText,
    selectAllText,
    onCascaderChange,
    popupTransitionName,
    renderTitle,
    selectLeafOnly,
    getPopupContainer,
    maxTagCount,
    ...rest
  } = props
  const { selectedItems, hackValue } = MultiCascaderContainer.useContainer()
  const selectedItemsMap = keyBy(selectedItems, 'value')

  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.stopPropagation()
      if (onClear) {
        onClear()
      }
    },
    [onClear]
  )

  const renderItem = useCallback((item: string) => {
    return (
      <Tag
        key={item}
        onRemove={onRemove}
        item={selectedItemsMap[item] || item}
        renderTitle={renderTitle}
      />
    )
  }, [])

  const renderRest = useCallback(
    (omittedValues: string[]) => (
      <Tag
        closable={false}
        renderTitle={() => <span>+{omittedValues.length}...</span>}
        item={{
          title: '',
          value: '',
        }}
      />
    ),
    []
  )

  const values = valueProps || hackValue.current || []

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
        {values.length ? (
          <Overflow
            prefixCls={`${prefix}-overflow`}
            data={values}
            renderItem={renderItem}
            renderRest={renderRest}
            maxCount={maxTagCount}
          />
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
