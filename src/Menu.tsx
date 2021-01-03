import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { Checkbox } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classnames from "classnames";
import { TreeNode } from "./index.d";
import { hasChildChecked, hasParentChecked } from "./utils";
import { Props } from "./MultiCascader";
import MultiCascader from "./container";
import { prefix } from "./constants";

interface MenuItemProps {
  node: TreeNode;
  depth: number;
}

export const ConnectedCheckbox = React.memo(
  (props: Pick<MenuItemProps, "node">) => {
    const { node } = props;
    const {
      value: containerValue,
      handleSelectChange,
    } = MultiCascader.useContainer();

    const handleChange = useCallback(
      (event: CheckboxChangeEvent) => {
        const { checked } = event.target;
        handleSelectChange(node, checked);
      },
      [node]
    );

    const checked = useMemo(() => hasParentChecked(node, containerValue), [
      containerValue,
      node,
    ]);
    const indeterminate = useMemo(
      () => !checked && hasChildChecked(node, containerValue),
      [checked, containerValue, node]
    );
    return (
      <Checkbox
        onChange={handleChange}
        checked={checked}
        indeterminate={indeterminate}
      />
    );
  }
);

const MenuItem = React.memo((props: MenuItemProps) => {
  const { node, depth } = props;
  const { children, value, title } = node;
  const { handleCascaderChange, menuPath } = MultiCascader.useContainer();

  const isLeaf = !children || children.length === 0;

  const handleClick = useCallback(() => {
    handleCascaderChange(node, depth);
  }, [node, depth]);

  const active = useMemo(
    () => !!menuPath.find((item) => item.value === value),
    [menuPath, value]
  );
  const cls = classnames(`${prefix}-column-item`, {
    [`${prefix}-column-item-active`]: active,
  });

  return (
    <li onClick={handleClick} className={cls}>
      <ConnectedCheckbox node={node} />
      <p className={`${prefix}-column-item-label`}>
        <span>{title}</span>
      </p>
      {!isLeaf ? <RightOutlined /> : null}
    </li>
  );
});

const Column = (props: {
  item: TreeNode[];
  columnWidth?: number;
  depth: number;
}) => {
  const { item, columnWidth, depth } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(columnWidth);

  // 固定宽度，避免切换时菜单跳动的问题
  useEffect(() => {
    const { width: refWidth } = ref.current!.getBoundingClientRect();
    setWidth(refWidth);
  }, []);

  return (
    <div
      className={`${prefix}-column`}
      style={{ width: `${columnWidth || width}px` }}
      ref={ref}
    >
      <ul>
        {item.map((node: TreeNode) => {
          return (
            <MenuItem key={node.value.toString()} depth={depth} node={node} />
          );
        })}
      </ul>
    </div>
  );
};

export default (props: Props) => {
  const { columnWidth } = props;
  const { menuData } = MultiCascader.useContainer();

  return (
    <div className={`${prefix}-menu`}>
      {menuData.map((item, index) => {
        return (
          <Column
            item={item}
            columnWidth={columnWidth}
            depth={index}
            key={item[0].value.toString()}
          />
        );
      })}
    </div>
  );
};
