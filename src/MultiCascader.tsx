import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react'
import { Button, Empty } from 'antd'
import Trigger from 'rc-trigger'
import BUILT_IN_PLACEMENTS from './placement'
import Menu, { ConnectedCheckbox } from './Menu'
import { TreeNode, ValueType } from './index.d'
import MultiCascaderContainer from './container'
import Selector from './Selector'
import { getPopupPlacement, matchAllLeafValue, reconcile } from './utils'
import { prefix } from './constants'

export interface Props {
  value?: ValueType[]
  data?: TreeNode[]
  allowClear?: boolean
  columnWidth?: number
  placeholder?: string
  onChange?: (newVal: ValueType[], selectedItems?: TreeNode[]) => void
  selectAll?: boolean
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  okText?: string
  cancelText?: string
  selectAllText?: string
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
    onLayout,
    okText = 'Confirm',
    cancelText = 'Cancel',
    selectAllText = 'All',
  } = props
  const { flattenData } = MultiCascaderContainer.useContainer()

  useEffect(() => {
    if (onLayout) {
      onLayout(ref.current!)
    }
  }, [onLayout])

  return (
    <div className={`${prefix}-popup`} ref={ref}>
      {data && data.length ? (
        <>
          <Menu />
          <div className={`${prefix}-popup-footer`}>
            {selectAll ? (
              <div className={`${prefix}-popup-all`}>
                <ConnectedCheckbox node={flattenData[0]} />
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
    const selectorRef = useRef(null)
    const { disabled } = props
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
      (item: TreeNode) => {
        const nextValue = reconcile(item, false, value)
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

    const [popupPlacement, setPopupPlacement] = useState({
      popupPlacement: 'bottomLeft',
      popupTransitionName: 'slide-up',
    })

    const handlePopUpLayout = useCallback(
      (popup: HTMLDivElement) => {
        if (popupVisible) {
          setPopupPlacement(
            getPopupPlacement(
              selectorRef.current,
              parseInt(getComputedStyle(popup).height, 10)
            )
          )
        }
      },
      [popupVisible]
    )

    return (
      <Trigger
        action={!disabled ? ['click'] : []}
        prefixCls={prefix}
        className="ant-select-dropdown"
        popup={
          <Popup
            {...props}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            onLayout={handlePopUpLayout}
          />
        }
        popupVisible={disabled ? false : popupVisible}
        onPopupVisibleChange={setPopupVisible}
        popupStyle={{
          position: 'absolute',
        }}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        {...popupPlacement}
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
