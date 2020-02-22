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
import CheckItem from "@/components/molecules/CheckItem";

const Index = () => {
  // 都道府県のデータ
  const [prefs, setPrefs] = useState([{ prefCode: 0, prefName: "" }]);
  // 年のデータ; 1960-2045まで5年刻み
  const years = [...Array(18)].map((_, i) => 1960 + i * 5);
  // 人口構成のデータ
  const [data, setData] = useState([]);
  // グラフのticks
  const base = 1000000;
  const YTicks = [5 * base, 10 * base, 15 * base];
  const XTicks = [...Array(10)].map((_, i) => 1960 + i * 10);
  // グラフのstyles
  const colors = [
    "#003f5c",
    "#ffa600",
    "#2f4b7c",
    "#ff7c43",
    "#665191",
    "#f95d6a",
    "#a05195",
    "#d45087"
  ];

  // 都道府県のデータを取得→stateに格納
  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/api/v1/prefectures");
      setPrefs(res.data.result);
    };
    fetchData();
    // 人口構成のstateを初期化
    setData(years.map(item => ({ year: item })));
  }, []);

  // チェックボックスの状態が変わったときのハンドラー
  const handleChange = async event => {
    const prefCode = parseInt(event.target.value, 10); // 都道府県のコード
    const prefName = prefs.find(item => item.prefCode === prefCode).prefName; // 都道府県の名前
    const keys = Object.keys(data[0]); // グラフ用データのキー

    // checked --> uncheckedの場合
    if (keys.includes(prefName)) {
      // stateを更新
      setData(
        data.map(item => {
          delete item[prefName];
          return item;
        })
      );
    }

    // unchecked --> checkedの場合
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
  };

  return (
    <>
      <h1>都道府県別の人口推移グラフ</h1>

      <section>
        <h2>都道府県</h2>
        <div className="CheckItem-container">
          {prefs.map(item => (
            <CheckItem
              key={item.prefCode}
              label={item.prefName}
              value={item.prefCode}
              onChange={handleChange}
            />
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
              tickFormatter={tick => tick.toLocaleString()}
              label={{
                value: "人口総数 (人) ",
                position: "insideTopLeft",
                offset: -40
              }}
            />
            <Tooltip
              labelFormatter={label => label + "年"}
              formatter={value => value + "人"}
            />
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
              .map((item, i) => (
                <Line
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
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
        .CheckItem-container {
          display: flex;
          flex-flow: row wrap;
        }
      `}</style>
    </>
  );
};

export default Index;
