import { isEqual } from 'lodash'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createContainer } from 'unstated-next'
import { TreeNode, ValueType } from './index.d'
import {
  transformValue as originalTransformValue,
  flattenTree,
  reconcile,
  sortByTree,
} from './utils'
import { All } from './constants'
import { Props } from './MultiCascader'

const useCascade = (params?: Props) => {
  const { data, value: valueProp, selectAll, onChange } = params || {}
  const [popupVisible, setPopupVisible] = useState(false)

  const flattenData = useMemo(() => {
    if (selectAll) {
      return flattenTree([
        {
          title: 'All',
          value: All,
          parent: null,
          children: data,
        },
      ])
    }
    return flattenTree(data || [])
  }, [data, selectAll])

  const transformValue = useCallback(
    (value: ValueType[]) => {
      const nextValue = originalTransformValue(value, flattenData)
      if (onChange && !isEqual(nextValue, value)) {
        requestAnimationFrame(() => triggerChange(nextValue))
      }
      return nextValue
    },
    [flattenData]
  )

  const [menuData, setMenuData] = useState([
    selectAll
      ? flattenData[0].children!
      : flattenData.filter((item) => !item.parent),
  ])

  const [menuPath, setMenuPath] = useState<TreeNode[]>([])
  const [value, setValue] = useState(transformValue(valueProp || []))
  const hackValue = useRef(value)

  const selectedItems = useMemo(() => {
    return flattenData.filter((node: TreeNode) => {
      return (valueProp || hackValue.current).includes(node.value)
    })
  }, [flattenData, valueProp, popupVisible, hackValue.current])

  const triggerChange = useCallback(
    (nextValue: ValueType[]) => {
      if (onChange) {
        onChange(nextValue, selectedItems.slice(0))
      }
      hackValue.current = nextValue
      setValue(nextValue)
      setPopupVisible(false)
    },
    [selectedItems]
  )

  const addMenu = useCallback((menu: TreeNode[], index: number) => {
    if (menu && menu.length) {
      setMenuData((prevMenuData) => [...prevMenuData.slice(0, index), menu])
    } else {
      setMenuData((prevMenuData) => [...prevMenuData.slice(0, index)])
    }
  }, [])

  const handleCascaderChange = useCallback(
    (item: TreeNode, depth: number) => {
      const { children } = item
      addMenu(children!, depth + 1)
      setMenuPath((prevMenuPath) => prevMenuPath.slice(0, depth).concat(item))
    },
    [menuPath]
  )

  const handleSelectChange = useCallback(
    (item: TreeNode, checked: boolean) => {
      setValue((prevValue) =>
        sortByTree(reconcile(item, checked, prevValue), flattenData)
      )
    },
    [flattenData]
  )

  const resetMenuState = useCallback(() => {
    setMenuData([
      selectAll
        ? flattenData[0].children!
        : flattenData.filter((item) => !item.parent),
    ])
    setMenuPath([])
  }, [flattenData, selectAll])

  // 传入的 value 有变更时重新计算
  useEffect(() => {
    if (popupVisible) {
      setValue(transformValue(valueProp || hackValue.current))
      resetMenuState()
    }
  }, [valueProp, flattenData, popupVisible, resetMenuState])

  return {
    menuPath,
    popupVisible,
    setPopupVisible,
    menuData,
    addMenu,
    setMenuData,
    value,
    setValue,
    handleCascaderChange,
    handleSelectChange,
    flattenData,
    resetMenuState,
    selectedItems,
    triggerChange,
  }
}

export default createContainer(useCascade)
