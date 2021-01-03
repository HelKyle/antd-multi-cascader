import {
  flattenTree,
  hasChildChecked,
  hasParentChecked,
  liftTreeState,
  matchAllLeafValue,
  reconcile,
  removeAllDescendanceValue,
  sinkTreeState,
  sortByTree,
  transformValue,
} from '../utils'

import { TreeNode, ValueType } from '../index.d'

const createFlattenTree = () => {
  return flattenTree([
    {
      value: '0',
      title: '0',
      children: [
        {
          value: '1',
          title: '1',
          children: [
            {
              value: '2',
              title: '2',
            },
            {
              value: '3',
              title: '3',
            },
          ],
        },
        {
          value: '4',
          title: '4',
        },
      ],
    },
  ])
}

describe('src/components/MultiCascader/utils.tsx', () => {
  describe('flattenTree()', () => {
    it('should works as expected', () => {
      expect(createFlattenTree()).toMatchSnapshot()
    })
  })

  describe('hasChildChecked', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })
    it('should tell has child checked or not', () => {
      expect(hasChildChecked(flattenValue[0], ['1'])).toEqual(true)
      expect(hasChildChecked(flattenValue[1], ['1'])).toEqual(true)
      expect(hasChildChecked(flattenValue[0], ['0'])).toEqual(true)
      expect(hasChildChecked(flattenValue[1], ['0'])).toEqual(false)
      expect(hasChildChecked(flattenValue[0], [])).toEqual(false)
    })
  })
  describe('hasParentChecked()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })
    it('should tell has parent checked or not', () => {
      expect(hasParentChecked(flattenValue[0], ['1'])).toEqual(false)
      expect(hasParentChecked(flattenValue[1], ['1'])).toEqual(true)
      expect(hasParentChecked(flattenValue[0], ['0'])).toEqual(true)
      expect(hasParentChecked(flattenValue[1], ['0'])).toEqual(true)
      expect(hasParentChecked(flattenValue[0], [])).toEqual(false)
    })
  })

  describe('matchAllLeafValue()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should match all leaf values', () => {
      expect(matchAllLeafValue(['1'], flattenValue)).toEqual(['2', '3'])
      expect(matchAllLeafValue(['3'], flattenValue)).toEqual(['3'])
      expect(matchAllLeafValue(['0'], flattenValue)).toEqual(['2', '3', '4'])
      expect(matchAllLeafValue(['3'], flattenValue)).toEqual(['3'])
    })
  })

  describe('removeAllDescendanceValue()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should remove children value', () => {
      expect(removeAllDescendanceValue(flattenValue[0], ['2', '4'])).toEqual([])
      expect(removeAllDescendanceValue(flattenValue[0], ['1'])).toEqual([])
      expect(removeAllDescendanceValue(flattenValue[1], ['1', '4'])).toEqual(['1', '4'])
      expect(removeAllDescendanceValue(flattenValue[1], ['2', '4'])).toEqual(['4'])
    })
  })

  describe('liftTreeState()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should lift tree state', () => {
      expect(liftTreeState(flattenValue[3], ['2'])).toEqual(['1'])
      expect(liftTreeState(flattenValue[3], ['2', '4'])).toEqual(['0'])
      expect(liftTreeState(flattenValue[2], ['4'])).toEqual(['4', '2'])
    })
  })
  describe('sinkTreeState()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should sink tree state', () => {
      expect(sinkTreeState(flattenValue[0], ['0'])).toEqual([])
      expect(sinkTreeState(flattenValue[3], ['1'])).toEqual(['2'])
      expect(sinkTreeState(flattenValue[3], ['0'])).toEqual(['2', '4'])
      expect(sinkTreeState(flattenValue[4], ['0'])).toEqual(['1'])
      expect(sinkTreeState(flattenValue[2], ['2', '4'])).toEqual(['4'])
    })
  })

  describe('reconcile()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should cal new value correctly', () => {
      let value: ValueType[] = []

      value = reconcile(flattenValue[0], true, value)
      expect(value).toEqual(['0'])
      value = reconcile(flattenValue[3], false, value)
      expect(value).toEqual(['2', '4'])
      value = reconcile(flattenValue[2], false, value)
      expect(value).toEqual(['4'])
      value = reconcile(flattenValue[3], true, value)
      expect(value).toEqual(['4', '3'])
      value = reconcile(flattenValue[2], true, value)
      expect(value).toEqual(['0'])

      // 无效的操作
      value = reconcile(flattenValue[3], true, value)
      expect(value).toEqual(['0'])
    })
  })
  describe('transformValue()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should transform value correctly', () => {
      expect(transformValue(['1', '4'], flattenValue)).toEqual(['0'])
      expect(transformValue(['2', '4'], flattenValue)).toEqual(['2', '4'])

      // teardown checked children value
      expect(transformValue(['0', '1'], flattenValue)).toEqual(['0'])
      expect(transformValue(['999'], flattenValue)).toEqual([])
    })
  })

  describe('sortByTree()', () => {
    let flattenValue: TreeNode[]
    beforeEach(() => {
      flattenValue = createFlattenTree()
    })

    it('should sort by tree', () => {
      expect(sortByTree(['0', '1'], flattenValue)).toEqual(['0', '1'])
      expect(sortByTree(['1', '0'], flattenValue)).toEqual(['0', '1'])
      expect(sortByTree(['4', '3'], flattenValue)).toEqual(['3', '4'])
      expect(sortByTree(['3', '4'], flattenValue)).toEqual(['3', '4'])
    })
  })
})
