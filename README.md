## 概要

- とらゼミ Web API 入門【実践編】の動画を見ながらハンズオン
- 開発者にとって使いやすい + 運用・保守がしやすい設計を行うことを目標
- https://github.com/deatiger/basic-rest-api

## 進捗

1. [初めての REST API【Re:ゼロから始める Web API 入門実践編#1】](https://www.youtube.com/watch?v=9GGRICOjA4c)
2. [環境構築と Hello World【Re:ゼロから始める Web API 入門実践編#2】](https://www.youtube.com/watch?v=DrxcoMMgZKg)
3. [リソース設計と DB 設計【Re:ゼロから始める Web API 入門実践編#3】](https://www.youtube.com/watch?v=x4ZrmnqoS1Y)
4. [GET 用 API のハンズオン開発【Re:ゼロから始める Web API 入門実践編#4】](https://www.youtube.com/watch?v=dURpu7Bjr_Y)
5. [HTML のフォームから API を実行しよう【Re:ゼロから始める Web API 入門実践編#5】](https://www.youtube.com/watch?v=pRoIxvhFbow)
6. [CRUD な API を開発しよう【Re:ゼロから始める Web API 入門実践編#6】](https://www.youtube.com/watch?v=GffwSIY_7xE)
7. [ユーザー作成フォームと API を繋げよう【Re:ゼロから始める Web API 入門実践編#7】】](https://www.youtube.com/watch?v=ye5hs_ZBhcM)
8. [ユーザーの編集と削除を操作しよう【Re:ゼロから始める Web API 入門実践編#8】](https://www.youtube.com/watch?v=QO39f8Ztc1E)
9. [ステータスコードを使った適切なエラーハンドリング【Re:ゼロから始める Web API 入門実践編#9】](https://www.youtube.com/watch?v=faCCTvt1_Ic)
10. [実務レベルの API 設計と実装【Re:ゼロから始める Web API 入門実践編#10】](https://www.youtube.com/watch?v=faCCTvt1_Ic)

## データ特定 ＆ リソース設計

- ユーザー情報：ユーザー ID、ユーザー名、プロフィール、写真 etc...
- フォロー情報：フォロワー ID、フォロー ID
- 対象のリソース
  - ユーザーリソース
  - 検索結果リソース

## URI 設計

### ユーザー

| メソッド | URI                   | 詳細                     |
| -------- | --------------------- | ------------------------ |
| GET      | /api/v1/users         | ユーザーリストの取得     |
| GET      | /api/v1/users/123     | ユーザー情報の取得       |
| POST     | /api/v1/users         | 新規ユーザーの作成       |
| PUT      | /api/v1/users/123     | ユーザー情報の更新       |
| DELETE   | /api/v1/users/123     | ユーザーの削除           |
| GET      | /api/v1/search?q=hoge | ユーザーの検索結果の取得 |

### フォロー/フォロワー

| メソッド | URI                         | 詳細                                 |
| -------- | --------------------------- | ------------------------------------ |
| GET      | /api/v1/users/1/following   | フォローしているユーザーリストの取得 |
| GET      | /api/v1/users/1/following/2 | フォローしているユーザー情報の取得   |
| POST     | /api/v1/users/1/following/2 | フォローする(未作成)                 |
| DELETE   | /api/v1/users/1/following/2 | フォロー解除(未作成)                 |
| GET      | /api/v1/users/1/followers   | フォロワーリストの取得               |
| GET      | /api/v1/users/1/followers/2 | フォロワー情報の取得                 |

## データベース設計(sqlite3 用)

### ユーザー

| フィールド名  | データ型 | NULL 許容 | その他                    |
| ------------- | -------- | --------- | ------------------------- |
| id            | INTERGER | NOT NULL  | PK                        |
| name          | TEXT     | NOT NULL  | -                         |
| profile       | TEXT     | -         | -                         |
| date_of_birth | TEXT     | -         | -                         |
| created_at    | TEXT     | NOT NULL  | datetime 関数で日付を取得 |
| updated_at    | TEXT     | NOT NULL  | datetime 関数で日付を取得 |

### フォロー/フォロワーテーブル

| フィールド名 | データ型 | NULL 許容 | その他                    |
| ------------ | -------- | --------- | ------------------------- |
| id           | INTERGER | NOT NULL  | PK                        |
| following_id | INTERGER | NOT NULL  | FK                        |
| followed_id  | INTERGER | NOT NULL  | FK                        |
| created_at   | TEXT     | NOT NULL  | datetime 関数で日付を取得 |
| updated_at   | TEXT     | NOT NULL  | datetime 関数で日付を取得 |

## メモ

- 構成

  - `Node.js`
  - `express`
  - `sqlite3`

- リソース指向アーキテクチャ

  - Web サービスで利用するデータの特定
    - 例：ユーザーの情報を扱う、投稿内容を扱う
  - データをリソースに分ける -> リソース設計
    - 例：「ユーザー」「投稿」
  - リソースに URI で名前をつける -> URI 設計
    - 例：「ユーザー：Users」「投稿：Posts」
  - リソースの表現を設計する -> 今回は全て JSON で
    - 例：「JSON」->どんな key: value にするか
  - リンクとフォームでリソースを結びつける
  - イベントの標準的なコースを設計する -> 正常動作時
  - エラーを想定する -> 例外発生時

- Node.js の sqlite 基本メソッド
  - データベース接続の開始
    - `const dbPath = 'app/db/database.sqlite3';`
    - `const db = new sqlite3.Database(dbPath);`
  - 内部の SQL クエリを同期的に実行
    - `db.serialize(() => { // queries });`
  - 全ての結果を 1 度に取得
    - `db.all(sql, (err, rows));`
  - 1 つだけ結果を取得
    - `db.get(sql, (err, row));`
  - SQL クエリを実行
    - `db.run(sql, (err));`
  - データベース接続を終了
    - `db.close();`

## コマンド

### Node.js のホットリロード用に`node-dev`をグローバルインストール

```
$ npm install -g node-dev
```

### sqlite3：DB 接続

```
$ npm run connect
```

### sqlite3：テーブル確認

```
$ .schema
```

### sqlite3：テーブル一覧取得

```
$ .tables
```
