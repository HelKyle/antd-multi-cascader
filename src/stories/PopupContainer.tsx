import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import MultiCascader from '../index'

storiesOf('MultiCascader', MultiCascader as any).add('Popup Container', () => {
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
    <div style={{ margin: 10, overflowY: 'scroll', height: 300 }}>
      <div
        id="container"
        style={{
          padding: 20,
          height: 1000,
          background: '#fdf7dc',
          position: 'relative',
        }}
      >
        <MultiCascader
          selectAll
          data={options}
          allowClear
          style={{ width: '200px' }}
          getPopupContainer={() => document.getElementById('container')!}
        />
      </div>
    </div>
  )
})
