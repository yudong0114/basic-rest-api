// express
const express = require('express');
const app = express();
// sqlite3の設定
const sqlite3 = require('sqlite3');
const dbPath = 'app/db/database.sqlite3';
// 静的ファイルのドキュメントルート設定
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// GETメソッド(Hello World!を返す)
app.get('/api/v1/hello', (req, res) => {
  res.json({'message': 'Hello World!'});
});

// GETメソッド(全てのユーザーを取得)
app.get('/api/v1/users', (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // usersの取得
  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows);
  });
  // DB接続の終了
  db.close();
});

// GETメソッド(単一のユーザーを取得)
app.get('/api/v1/users/:id', (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // idを変数に格納
  const id = req.params.id;
  // id指定のusersの取得
  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    res.json(row);
  });
  // DB接続の終了
  db.close();
});

// GETメソッド(検索にマッチした全てのユーザーを取得)
app.get('/api/v1/search', (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // クエリパラメータの検索キーワード(q)を変数に格納
  const keyword = req.query.q;
  // 検索にマッチしたusersの取得
  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows);
  });
  // DB接続の終了
  db.close();
});

// ポート設定
const port = process.env.PORT || 3000;

// listenメソッドで指定ポートで待ち受ける
app.listen(port);

// ポートが読み込まれているか確認用コンソールログ
// console.log('Listen on port:' + port);