import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import MultiCascader from '../index'

storiesOf('MultiCascader', MultiCascader as any).add('i18n', () => {
  const [state, setState] = useState<string[]>([])
  const [options] = useState([
    {
      value: 'Node1',
      title: 'Node1',
      children: [
        {
          value: 'Node1-1',
          title: 'Node1-1',
        },
        {
          value: 'Node1-2',
          title: 'Node1-2',
        },
      ],
    },
    {
      value: 'Node2',
      title: 'Node2',
    },
  ])

  return (
    <MultiCascader
      selectAll
      data={options}
      value={state}
      onChange={setState}
      cancelText="取消"
      okText="确认"
      selectAllText="全选"
      allowClear
      placeholder="请选择"
      style={{ width: '200px' }}
    />
  )
})
