import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import MultiCascader from '../index'

storiesOf('MultiCascader', MultiCascader as any).add('MaxTagCount', () => {
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
        {
          value: 'Node1-3',
          title: 'Node1-3',
        },
        {
          value: 'Node1-4',
          title: 'Node1-4',
        },
        {
          value: 'Node1-5',
          title: 'Node1-5',
        },
      ],
    },
  ])

  return (
    <MultiCascader
      selectAll
      data={options}
      allowClear
      style={{ width: '280px' }}
      maxTagCount={2}
    />
  )
})
