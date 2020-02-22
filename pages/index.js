import React, { useState, useEffect } from "react";
import instance from "@/utils/instance";

const Index = () => {
  // 都道府県のデータ
  const [prefs, setPrefs] = useState([{ prefCode: 0, prefName: "" }]);
  // 人口構成のデータ; 削除はしない
  const [cmps, setCmps] = useState([]);
  // チェックされた都道府県のprefCode
  const [checked, setChecked] = useState([]);
  // 年のデータ; 1960-2045まで5年刻み
  const years = [...Array(18)].map((_, i) => 1960 + i * 5);
  // 人口構成のデータ
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/api/v1/prefectures");
      setPrefs(res.data.result);
    };
    fetchData();
    // 人口構成のstateを初期化
    setData(years.map(item => ({ year: item })));
  }, []);

  // DEBUG
  useEffect(() => {
    console.log(data);
  }, [data]);

  // チェックボックスの状態が変わったときのハンドラー
  // 人口データの取得とチェックされた都道府県リストの更新をする
  const handleChange = async event => {
    // const value = event.target.value;
    const prefCode = parseInt(event.target.value, 10);
    const prefName = prefs.find(item => item.prefCode === prefCode).prefName;

    console.log(prefName);
    const keys = Object.keys(data[0]); // グラフ用データのキー

    // checked --> uncheckedの場合
    if (keys.includes(prefName)) {
      // stateを更新
      setData(
        // TODO: もっと良い消し方があれば修正
        data.map(item => {
          delete item[prefName];
          return item;
        })
      );
    }
    // checked --> uncheckedの場合
    if (!keys.includes(prefName)) {
      // APIから人口データを取得
      const res = await instance.get("/api/v1/population/composition/perYear", {
        params: {
          prefCode,
          cityCode: "-" // 市区町村はすべて
        }
      });
      // responseから総人口のデータだけ格納
      const population = res.data.result.data[0].data;
      setData(
        data.map((item, i) => {
          // 都道府県:人口 のpropertyを追加
          const obj = {};
          obj[prefName] = population[i].value;
          return { ...item, ...obj };
        })
      );
    }
    /*
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
    */
  };

  // DEBUG
  // useEffect(() => {
  //   console.log(checked);
  // }, [checked]);
  // useEffect(() => {
  //   console.log(cmps);
  // }, [cmps]);

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
