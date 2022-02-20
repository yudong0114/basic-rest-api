// expressの設定
const express = require('express');
const app = express();

// sqlite3の設定
const sqlite3 = require('sqlite3');
const dbPath = 'app/db/database.sqlite3';

// 静的ファイルのドキュメントルート設定
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// リクエストのbodyを読み取る設定
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

// POSTメソッド(ユーザーの作成)
app.post('/api/v1/users', async (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // リクエスト内容を変数に格納
  // ※idはAutoIncrementで設定、profileとdate_of_birthは任意
  const name = req.body.name;
  const profile = req.body.profile || '';
  const dateOfBirth = req.body.date_of_birth || '';
  // SQL実行関数の作成
  const run = async(sql) => {
    // Promiseオブジェクトの作成
    return new Promise((resolve, reject) => {
      // エラー時の処理
      // db.runはsqlite3のメソッド
      db.run(sql, (err) => {
        if (err) {
          res.status(500).send(err);
          return reject();
        } else {
          res.json({message: '新規ユーザーを作成しました！'});
          return resolve();
        }
        
      })
    })
  }

  // resolve or rejectが返るまで処理を待つ
  await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`)

  // DB接続の終了(runが終わるまでここは実行されない)
  db.close();
});

// ポート設定
const port = process.env.PORT || 3000;

// listenメソッドで指定ポートで待ち受ける
app.listen(port);

// ポートが読み込まれているか確認用コンソールログ
// console.log('Listen on port:' + port);