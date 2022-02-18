## 概要
* とらゼミ Web API入門【実践編】の動画を見ながらハンズオン
* 開発者にとって使いやすい + 運用・保守がしやすい設計を行うことを目標

## 進捗
1. [初めてのREST API【Re:ゼロから始めるWeb API入門実践編#1】](https://www.youtube.com/watch?v=9GGRICOjA4c)
2. [環境構築とHello World【Re:ゼロから始めるWeb API入門実践編#2】](https://www.youtube.com/watch?v=DrxcoMMgZKg)
3. [リソース設計とDB設計【Re:ゼロから始めるWeb API入門実践編#3】](https://www.youtube.com/watch?v=x4ZrmnqoS1Y)
4. [GET用APIのハンズオン開発【Re:ゼロから始めるWeb API入門実践編#4】](https://www.youtube.com/watch?v=dURpu7Bjr_Y)
5. [HTMLのフォームからAPIを実行しよう【Re:ゼロから始めるWeb API入門実践編#5】](https://www.youtube.com/watch?v=pRoIxvhFbow)

## データ特定 ＆ リソース設計
* ユーザー情報：ユーザーID、ユーザー名、プロフィール、写真 etc...
* フォロー情報：フォロワーID、フォローID
* 対象のリソース
  * ユーザーリソース
  * 検索結果リソース

## URI設計
| メソッド | URI | 詳細 |
| - | - | - |
| GET | /api/v1/users | ユーザーリストの取得 |
| GET | /api/v1/users/123 | ユーザー情報の取得 |
| POST | /api/v1/users | 新規ユーザーの作成 |
| PUT | /api/v1/users/123 | ユーザー情報の更新 |
| DELETE | /api/v1/users/123 | ユーザーの削除 |
| GET | /api/v1/search?q=hoge | ユーザーの検索結果の取得 |

## データベース設計(sqlite3用)
| フィールド名 | データ型 | NULL許容 | その他 |
| - | - | - | - |
| id | INTERGER | NOT NULL | PK |
| name | TEXT | NOT NULL | - |
| profile | TEXT | - | - |
| date_of_birth | TEXT | - | - |
| created_at | TEXT | NOT NULL | datetime関数で日付を取得 |
| updated_at | TEXT | NOT NULL | datetime関数で日付を取得 |

## メモ
* 構成
  * `Node.js`
  * `express`
  * `sqlite3` 

* リソース指向アーキテクチャ
  * Webサービスで利用するデータの特定
    * 例：ユーザーの情報を扱う、投稿内容を扱う
  * データをリソースに分ける -> リソース設計
    * 例：「ユーザー」「投稿」
  * リソースにURIで名前をつける -> URI設計
    * 例：「ユーザー：Users」「投稿：Posts」
  * リソースの表現を設計する -> 今回は全てJSONで
    * 例：「JSON」->どんなkey: valueにするか
  * リンクとフォームでリソースを結びつける
  * イベントの標準的なコースを設計する -> 正常動作時
  * エラーを想定する -> 例外発生時

* Node.jsのsqlite基本メソッド
  * データベース接続の開始
    * `const dbPath = 'app/db/database.sqlite3';`
    * `const db = new sqlite3.Database(dbPath);`
  * 内部のSQLクエリを同期的に実行
    * `db.serialize(() => { // queries });`
  * 全ての結果を1度に取得
    * `db.all(sql, (err, rows));`
  * 1つだけ結果を取得
    * `db.get(sql, (err, row));`
  * SQLクエリを実行
    * `db.run(sql, (err));`
  * データベース接続を終了
    * `db.close();`

## コマンド
### Node.jsのホットリロード用に`node-dev`をグローバルインストール
```
$ npm install -g node-dev
```
### sqlite3：DB接続
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