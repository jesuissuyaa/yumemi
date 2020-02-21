import React, { useState, useEffect } from "react";
import instance from "@/utils/instance";

const Index = () => {
  // 都道府県のデータ
  const [prefs, setPrefs] = useState([{ prefCode: 0, prefName: "" }]);
  // 人口構成のデータ; 削除はしない
  const [cmps, setCmps] = useState([]);
  // チェックされた都道府県のprefCode
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/api/v1/prefectures");
      setPrefs(res.data.result);
    };
    fetchData();
  }, []);

  // チェックボックスの状態が変わったときのハンドラー
  const handleChange = async event => {
    const value = event.target.value;
    // データがなければ追加
    if (!cmps.some(item => item.prefCode === value)) {
      // APIから人口データを取得
      const res = await instance.get("/api/v1/population/composition/perYear", {
        params: {
          prefCode: value,
          cityCode: "-" // 市区町村はすべて
        }
      });
      // responseから総人口のデータだけ格納
      const data = res.data.result.data[0].data;
      setCmps(cmps.concat({ prefCode: value, data }));
    }
    // checkedになければ追加
    if (!checked.includes(value)) {
      setChecked(checked.concat(value));
      return;
    }
    // checkedにあれば削除
    if (checked.includes(value)) {
      setChecked(checked.filter(item => item != value));
    }
  };

  // DEBUG
  useEffect(() => {
    console.log(checked);
  }, [checked]);
  useEffect(() => {
    console.log(cmps);
  }, [cmps]);

  return (
    <>
      <h1>都道府県別の人口推移グラフ</h1>

      <section>
        <h2>都道府県</h2>
        <div className="checkbox-container">
          {prefs.map(item => (
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
          flex-basis: 20%;
        }
      `}</style>
    </>
  );
};

export default Index;
