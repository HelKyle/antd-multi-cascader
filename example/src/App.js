import React, { useEffect } from "react";
import "./App.css";
import MultiCascader from "antd-multi-cascader";
import "antd/dist/antd.css";
import "antd-multi-cascader/dist/index.css";
import options from "./options";

function App() {
  const [value, setValue] = React.useState(["南山区", "罗湖区"]);
  const [asyncOptions, setAsyncOptions] = React.useState([]);

  useEffect(() => {
    setTimeout(() => setAsyncOptions(options), 1000);
  }, []);

  return (
    <div className="App">
      <section>
        <header>Form Control</header>
        <MultiCascader
          value={value}
          onChange={setValue}
          data={options}
          placeholder="Select Cities"
        />
      </section>
      <section>
        <header>Select All</header>
        <MultiCascader data={options} placeholder="Select Cities" selectAll />
      </section>
      <section>
        <header>Allow Clear</header>
        <MultiCascader data={options} placeholder="Select Cities" allowClear />
      </section>
      <section>
        <header>Disabled</header>
        <MultiCascader
          disabled
          value={["深圳市"]}
          data={options}
          placeholder="Select Cities"
        />
      </section>
      <section>
        <header>I18n</header>
        <MultiCascader
          selectAll
          data={options}
          placeholder="请选择城市"
          okText="确认"
          cancelText="取消"
          selectAllText="全选"
        />
      </section>
      <section>
        <header>Async Data</header>
        <MultiCascader
          selectAll
          data={asyncOptions}
          placeholder="请选择城市"
          okText="确认"
          cancelText="取消"
          selectAllText="全选"
        />
      </section>
    </div>
  );
}

export default App;
