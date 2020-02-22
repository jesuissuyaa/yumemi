import React, { useState, useEffect } from "react";
import instance from "@/utils/instance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

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
  // データのdomain
  // const [dataMax, setDataMax] = useState(0);
  const dataMax = 15000000;
  const base = 1000000;
  const YTicks = [5 * base, 10 * base, 15 * base];
  const XTicks = [...Array(10)].map((_, i) => 1960 + i * 10);

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

  // Y axisの最大値を更新
  // useEffect(() => {
  //   // 初期状態では更新しない
  //   if (!data.length) return;
  //   if (Object.keys(data[0]).length === 1) {
  //     return;
  //   }
  //   // yearのpropertyを削除した配列
  //   let ary = data;
  //   // ary = ary.map(item => {
  //   //   delete item.year;
  //   //   return item;
  //   // });
  //   // objectのvalueだけ格納
  //   ary = ary.map(item => Object.values(item));
  //   // 配列のnestを解消
  //   const values = ary.flat();
  //   // 配列の最大値
  //   const max = Math.max(...values);
  //   setDataMax(max);
  // }, [data]);
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

      <section className="chart-container">
        {data.length !== 0 && (
          <LineChart
            width={800}
            height={600}
            data={data}
            margin={{ top: 50, left: 50, bottom: 50, right: 50 }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="year"
              ticks={XTicks}
              domain={[XTicks[0], XTicks[XTicks.length - 1]]}
              label={{
                value: "年度 (年) ",
                position: "insideBottomRight",
                offset: -20
              }}
            />
            <YAxis
              domain={[0, YTicks[YTicks.length - 1]]}
              ticks={YTicks}
              label={{
                value: "人口総数 (人) ",
                position: "insideTopLeft",
                offset: -40
              }}
            />
            {data.length && <Tooltip />}]
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{
                height: "50px",
                display: "flex",
                alignItems: "flex-end",
                left: "200px",
                width: "500px",
                top: "40px"
              }}
            />
            {Object.keys(data[0])
              .filter(item => item !== "year")
              .map(item => (
                <Line
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stroke="#8884d8"
                />
              ))}
          </LineChart>
        )}
      </section>
      <style jsx>{`
        .chart-container {
          display: flex;
          justify-content: center;
          margin-top: 5rem;
        }
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
