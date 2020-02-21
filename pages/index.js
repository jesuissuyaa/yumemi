import React, { useState, useEffect } from "react";
import instance from "@/utils/instance";

const Index = () => {
  // 都道府県のデータ
  const [data, setData] = useState([{ prefCode: 0, prefName: "" }]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/api/v1/prefectures");
      setData(res.data.result);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>都道府県別の人口推移グラフ</h1>

      <section>
        <h2>都道府県</h2>
        <div>
          {data.map(item => (
            <>
              <input
                type="checkbox"
                name={item.prefName}
                value={item.prefCode}
              />
              <label htmlFor={item.prefName}>{item.prefName}</label>
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
