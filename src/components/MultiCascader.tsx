import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { Button, Empty } from 'antd'
import { ConfigContext } from 'antd/lib/config-provider'
import Trigger from 'rc-trigger'
import BUILT_IN_PLACEMENTS from '../libs/placement'
import Menu from './Menu'
import Checkbox from './Checkbox'
import { TreeNode, ValueType } from '../index.d'
import MultiCascaderContainer from '../container'
import Selector from './Selector'
import { matchAllLeafValue, reconcile } from '../libs/utils'
import { prefix } from '../constants'

export interface Props {
  value?: ValueType[]
  data?: TreeNode[]
  allowClear?: boolean
  columnWidth?: number
  placeholder?: string
  onChange?: (newVal: ValueType[], selectedItems?: TreeNode[]) => void
  onCascaderChange?: (
    node: TreeNode,
    operations: { add: (children: TreeNode[]) => TreeNode[] }
  ) => void
  selectAll?: boolean
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  okText?: string
  cancelText?: string
  selectAllText?: string
  popupTransitionName?: string
  selectLeafOnly?: boolean
  renderTitle?: (value: string) => string | undefined
  getPopupContainer?: (props: any) => HTMLElement
}

export interface PopupProps extends Props {
  onCancel?: () => void
  onConfirm?: () => void
  onLayout?: (dom: HTMLDivElement) => void
}

const Popup = (props: PopupProps) => {
  const ref = useRef(null)
  const {
    data,
    selectAll,
    onCancel,
    onConfirm,
    okText = 'Confirm',
    cancelText = 'Cancel',
    selectAllText = 'All',
  } = props
  const { flattenData } = MultiCascaderContainer.useContainer()

  return (
    <div className={`${prefix}-popup`} ref={ref}>
      {data && data.length ? (
        <>
          <Menu />
          <div className={`${prefix}-popup-footer`}>
            {selectAll ? (
              <div className={`${prefix}-popup-all`}>
                <Checkbox node={flattenData[0]} />
                &nbsp;&nbsp;{selectAllText}
              </div>
            ) : null}
            <div className={`${prefix}-popup-buttons`}>
              <Button size="small" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button size="small" type="primary" onClick={onConfirm}>
                {okText}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  )
}

const Component = React.memo(
  React.forwardRef((props: Props, ref) => {
    const { getPopupContainer: getContextPopupContainer } = React.useContext(
      ConfigContext
    )
    const selectorRef = useRef(null)
    const {
      disabled,
      popupTransitionName = 'slide-up',
      getPopupContainer,
    } = props
    const {
      popupVisible,
      setPopupVisible,
      flattenData,
      value,
      resetMenuState,
      triggerChange,
    } = MultiCascaderContainer.useContainer()

    const handleCancel = useCallback(() => {
      setPopupVisible(false)
    }, [])

    const handleItemRemove = useCallback(
      (item: TreeNode | string) => {
        let nextValue: string[]
        if (typeof item === 'string') {
          nextValue = value.filter((v) => v !== item)
        } else {
          nextValue = reconcile(item, false, value)
        }

        triggerChange(nextValue)
      },
      [value, triggerChange]
    )

    const handleClear = useCallback(() => {
      resetMenuState()
      triggerChange([])
    }, [resetMenuState, triggerChange])

    const handleConfirm = useCallback(() => {
      triggerChange(value)
    }, [triggerChange, value])

    useImperativeHandle(
      ref,
      () => {
        return {
          // 匹配所有叶子节点的 value
          matchAllLeafValue: (v: ValueType[]) =>
            matchAllLeafValue(v, flattenData),
        }
      },
      [flattenData]
    )

    return (
      <Trigger
        action={!disabled ? ['click'] : []}
        prefixCls={prefix}
        popup={
          <Popup {...props} onCancel={handleCancel} onConfirm={handleConfirm} />
        }
        popupVisible={disabled ? false : popupVisible}
        onPopupVisibleChange={setPopupVisible}
        popupStyle={{
          position: 'absolute',
          zIndex: 1050,
        }}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupPlacement="bottomLeft"
        popupTransitionName={popupTransitionName}
        getPopupContainer={getPopupContainer || getContextPopupContainer}
      >
        <Selector
          forwardRef={selectorRef}
          onRemove={handleItemRemove}
          onClear={handleClear}
          {...props}
        />
      </Trigger>
    )
  })
)

const MultiCascader: React.FunctionComponent<Props> = React.forwardRef(
  (props: Props, ref) => {
    return (
      <MultiCascaderContainer.Provider initialState={props}>
        <Component {...props} ref={ref} />
      </MultiCascaderContainer.Provider>
    )
  }
)

MultiCascader.defaultProps = {
  data: [],
  value: undefined,
}

export default MultiCascader
