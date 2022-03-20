// expressの設定
const express = require("express");
const app = express();

// sqlite3の設定
const sqlite3 = require("sqlite3");
const dbPath = "app/db/database.sqlite3";

// 静的ファイルのドキュメントルート設定
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// リクエストのbodyを読み取る設定
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GETメソッド(Hello World!を返す)
app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

// GETメソッド(全てのユーザーを取得)
app.get("/api/v1/users", (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // usersの取得
  db.all("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });
  // DB接続の終了
  db.close();
});

// GETメソッド(単一のユーザーを取得)
app.get("/api/v1/users/:id", (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // idを変数に格納
  const id = req.params.id;
  // id指定のusersの取得
  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    // ユーザー名が取得できない場合、404エラー
    if (!row) {
      res.status(404).send({ error: "Not Found!" });
    } else {
      res.status(200).json(row);
    }
  });
  // DB接続の終了
  db.close();
});

// GETメソッド(単一のユーザーのフォローしているユーザーを取得)
app.get("/api/v1/users/:id/following", (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // idを変数に格納
  const id = req.params.id;
  // 全てを取得(getだとマッチした一つ)
  db.all(
    `SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id = ${id};`,
    (err, rows) => {
      // ユーザー名が取得できない場合、404エラー
      if (!rows) {
        res.status(404).send({ error: "Not Found!" });
      } else {
        res.status(200).json(rows);
      }
    }
  );
  // DB接続の終了
  db.close();
});

// GETメソッド(単一のユーザーのフォローしている単一ユーザーを取得)
app.get("/api/v1/users/:id/following/:followed_id", (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // idを変数に格納
  const id = req.params.id;
  // followed_idを変数に格納
  const followed_id = req.params.followed_id;
  // 全てを取得
  db.get(
    `SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id = ${id} AND followed_id = ${followed_id};`,
    (err, row) => {
      // ユーザー名が取得できない場合、404エラー
      if (!row) {
        res.status(404).send({ error: "Not Found!" });
      } else {
        res.status(200).json(row);
      }
    }
  );
  // DB接続の終了
  db.close();
});

// GETメソッド(検索にマッチした全てのユーザーを取得)
app.get("/api/v1/search", (req, res) => {
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
app.post("/api/v1/users", async (req, res) => {
  // 必須のnameがない場合、400エラー
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザー名が指定されていません。" });
  } else {
    // DBに接続
    const db = new sqlite3.Database(dbPath);
    // リクエスト内容を変数に格納
    // ※idはAutoIncrementで設定、profileとdate_of_birthは任意
    const name = req.body.name;
    const profile = req.body.profile || "";
    const dateOfBirth = req.body.date_of_birth || "";

    try {
      // resolve or rejectが返るまで処理を待つ
      await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
        db
      );
      res.status(201).send({ message: "新規ユーザーを作成しました！" });
    } catch (e) {
      // rejectでerrを返す、eで受け取る
      res.status(500).send({ error: e });
    }
    // DB接続の終了(runが終わるまでここは実行されない)
    db.close();
  }
});

// PUTメソッド(ユーザーの更新)
app.put("/api/v1/users/:id", async (req, res) => {
  // 必須のnameがない場合、400エラー
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ error: "ユーザー名が指定されていません。" });
  } else {
    // DBに接続
    const db = new sqlite3.Database(dbPath);
    // リクエスト内容を変数に格納
    const id = req.params.id;

    // 現在のユーザー情報を取得
    db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
      // ユーザー名が取得できない場合、404エラー
      if (!row) {
        res.status(404).send({ error: "指定されたユーザーが存在しません！" });
      } else {
        const name = req.body.name || row.name;
        const profile = req.body.profile || row.profile;
        const dateOfBirth = req.body.date_of_birth || row.date_of_birth;

        try {
          // resolve or rejectが返るまで処理を待つ
          await run(
            `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
            db
          );
          res.status(200).send({ message: "ユーザー情報を更新しました！" });
        } catch (e) {
          // rejectでerrを返す、eで受け取る
          res.status(500).send({ error: e });
        }
      }
    });
    // DB接続の終了(runが終わるまでここは実行されない)
    db.close();
  }
});

// DELETEメソッド(ユーザーの削除)
app.delete("/api/v1/users/:id", async (req, res) => {
  // DBに接続
  const db = new sqlite3.Database(dbPath);
  // リクエスト内容を変数に格納
  const id = req.params.id;

  // 現在のユーザー情報を取得
  db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
    // ユーザー名が取得できない場合、404エラー
    if (!row) {
      res.status(404).send({ error: "指定されたユーザーが存在しません！" });
    } else {
      try {
        // resolve or rejectが返るまで処理を待つ
        await run(`DELETE FROM users WHERE id="${id}"`, db);
        res.status(200).send({ message: "ユーザーを削除しました！" });
      } catch (e) {
        // rejectでerrを返す、eで受け取る
        res.status(500).send({ error: e });
      }
    }
  });

  // DB接続の終了(runが終わるまでここは実行されない)
  db.close();
});

/**
 * SQL実行関数
 *
 * @param sql {string} 実行するSQL文
 * @param db  {sqlite3.Database} DBの接続情報
 * @param res  {Response} リクエストに対するレスポンス構成のオブジェクト
 * @param message  {string} 実行完了のメッセージ
 * @returns {Promise} SQLの実行のPromise
 */
const run = async (sql, db) => {
  // Promiseオブジェクトの作成
  return new Promise((resolve, reject) => {
    // エラー時の処理
    // db.runはsqlite3のメソッド
    db.run(sql, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
};

// ポート設定
const port = process.env.PORT || 3000;

// listenメソッドで指定ポートで待ち受ける
app.listen(port);

// ポートが読み込まれているか確認用コンソールログ
// console.log('Listen on port:' + port);
