import React, { useState, useEffect } from "react";
import instance from "@/utils/instance";

const Index = () => {
  // 都道府県のデータ
  const [data, setData] = useState([{ prefCode: 0, prefName: "" }]);
  // チェックされた都道府県のprefCode
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/api/v1/prefectures");
      setData(res.data.result);
    };
    fetchData();
  }, []);

  // チェックボックスの状態が変わったときのハンドラー
  const handleChange = event => {
    const value = event.target.value;
    // checkedになければ追加
    if (!checked.includes(value)) {
      console.log("add");
      setChecked(checked.concat(value));
      return;
    }
    // checkedにあれば削除
    if (checked.includes(value)) {
      console.log("remove");
      setChecked(checked.filter(item => item != value));
    }
  };

  // DEBUG
  useEffect(() => {
    console.log(checked);
  }, [checked]);

  return (
    <>
      <h1>都道府県別の人口推移グラフ</h1>

      <section>
        <h2>都道府県</h2>
        <div className="checkbox-container">
          {data.map(item => (
            <div className="checkbox-wrapper" key={item.prefcode}>
              <input
                type="checkbox"
                name={item.prefName}
                value={item.prefCode}
                onChange={handleChange}
                key={`input-${item.prefcode}`}
              />
              <label htmlFor={item.prefName} key={`label-${item.prefcode}`}>
                {item.prefName}
              </label>
            </div>
          ))}
        </div>
      </section>
      <style jsx>{`
        .checkbox-container {
          display: flex;
          flex-flow: row wrap;
        }
        .checkbox-wrapper {
          display: flex;
          flex-basis: 10%;
        }
      `}</style>
    </>
  );
};

export default Index;
