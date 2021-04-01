import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createContainer } from 'unstated-next'
import { TreeNode, ValueType } from './index.d'
import {
  transformValue as originalTransformValue,
  flattenTree,
  reconcile,
  sortByTree,
  shallowEqualArray,
  findNodeByValue,
} from './libs/utils'
import { All } from './constants'
import { Props } from './components/MultiCascader'

const useCascade = (params?: Props) => {
  const {
    data,
    value: valueProp,
    selectAll,
    onChange,
    onCascaderChange,
    selectLeafOnly,
  } = params || {}
  const [popupVisible, setPopupVisible] = useState(false)
  const dataRef = useRef<Array<TreeNode> | undefined>(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const [flattenData, setFlattenData] = useState(() => {
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
  })

  useEffect(() => {
    setFlattenData(() => {
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
    })
  }, [data, selectAll])

  const transformValue = useCallback(
    (value: ValueType[]) => {
      const nextValue = originalTransformValue(value, flattenData)

      if (onChange && !shallowEqualArray(nextValue, value)) {
        requestAnimationFrame(() => triggerChange(nextValue))
      }

      return nextValue
    },
    [flattenData]
  )

  const [menuData, setMenuData] = useState(() => {
    if (selectAll && flattenData.length === 1) {
      return []
    }

    return [
      selectAll
        ? flattenData[0].children!
        : flattenData.filter((item) => !item.parent),
    ]
  })

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

  const addChildrenToNode = useCallback(
    (target: TreeNode, children: TreeNode[]): TreeNode[] => {
      const found = findNodeByValue(target.value, dataRef.current!)
      if (found) {
        found.children = children
      }
      return [...dataRef.current!]
    },
    []
  )

  const lastItemRef = useRef<TreeNode | null>(null)

  const handleCascaderChange = useCallback(
    (item: TreeNode, depth: number) => {
      const { children } = item
      lastItemRef.current = item
      onCascaderChange?.(item, {
        add: (newChildren: TreeNode[]) => {
          const newData = addChildrenToNode(item, newChildren)
          if (lastItemRef.current === item) {
            item.children = newChildren
            newChildren.forEach((child) => {
              child.parent = item
            })
            setFlattenData((prev) => [...prev, ...newChildren])
            handleCascaderChange(item, depth)
          }
          return newData
        },
      })
      addMenu(children!, depth + 1)
      setMenuPath((prevMenuPath) => prevMenuPath.slice(0, depth).concat(item))
    },
    [menuPath, onCascaderChange]
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
    if (selectAll && flattenData.length === 1) {
      return setMenuData([])
    } else {
      setMenuData([
        selectAll
          ? flattenData[0].children!
          : flattenData.filter((item) => !item.parent),
      ])
    }
    setMenuPath([])
  }, [flattenData, selectAll])

  // 传入的 value 有变更时重新计算
  useEffect(() => {
    if (popupVisible) {
      setValue(transformValue(valueProp || hackValue.current))
      resetMenuState()
    }
  }, [popupVisible])

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
    selectLeafOnly,
  }
}

export default createContainer(useCascade)
