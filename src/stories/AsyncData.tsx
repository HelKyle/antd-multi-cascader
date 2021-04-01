import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import MultiCascader from '../index'

storiesOf('MultiCascader', MultiCascader as any).add('AsyncData', () => {
  const [state, setState] = useState<string[]>(['Node1-1-1'])
  const [options, setOptions] = useState([
    {
      value: 'Node1',
      title: 'Node1-title',
      isLeaf: false,
    },
    {
      value: 'Node2',
      title: 'Node2-title',
    },
  ])

  const handleCascaderChange = React.useCallback((node, { add }) => {
    if (node.value === 'Node1' && !node.children) {
      setTimeout(() => {
        setOptions(
          add([
            {
              value: 'Node1-1',
              title: 'Node1-1-title',
              isLeaf: false,
            },
            {
              value: 'Node1-2',
              title: 'Node1-2-title',
            },
          ])
        )
      }, 500)
    } else if (node.value === 'Node1-1' && !node.children) {
      setTimeout(() => {
        setOptions(
          add([
            {
              value: 'Node1-1-1',
              title: 'Node1-1-1-title',
            },
            {
              value: 'Node1-2-1',
              title: 'Node1-2-1-title',
            },
          ])
        )
      }, 500)
    }
  }, [])

  function renderTitle(value: string) {
    if (value === 'Node1-1-1') {
      return 'Node1-1-1-title'
    }
    return undefined
  }

  return (
    <MultiCascader
      selectAll
      selectLeafOnly
      data={options}
      value={state}
      onChange={setState}
      placeholder="Async Data"
      style={{ width: '200px' }}
      onCascaderChange={handleCascaderChange}
      renderTitle={renderTitle}
    />
  )
})
