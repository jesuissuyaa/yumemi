# 都道府県別の総人口推移グラフ

都道府県ごとの総人口推移をグラフで描画するReactアプリです
データは[RESAS API](https://opendata.resas-portal.go.jp/)から取得しています

## 環境構築

リポジトリをクローンしたあとに、APIキーを取得し、それを`next.config.js`というファイルに格納します

### 1. リポジトリのクローン

```
# clone repository
git clone https://github.com/jesuissuyaa/yumemi.git
cd yumemi

# install packages
yarn
```

### 2. APIキーの取得

https://opendata.resas-portal.go.jp/

RESAS APIのページから利用登録をして、APIキーを取得します

### 3. `next.config.js`の作成

`next.config.js`はルート直下にあります

```
# create file
touch next.config.js
```

中身は以下をコピペして、自分のAPIキーを設定してください

```
module.exports = {
  env: {
    RESAS_API_KEY: "自分のAPIキー"
  }
};
```

### 4. アプリの起動

```
# start app
yarn dev
```

http://localhost:3000 でアプリが起動します

## 使用技術

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [RESAS-API](https://opendata.resas-portal.go.jp/)
- [Data Color Picker](https://learnui.design/tools/data-color-picker.html#palette) (グラフの色の生成)

## 参考資料

Atomic Design: Reactプロジェクトでcomponentを整理する考え方
- https://dev.to/maciekchmura/how-i-structure-a-react-project-3c2i

