// express
const express = require('express');
const app = express();

// GETメソッド(Hello World!を返す)
app.get('/api/v1/hello', (req, res) => {
  res.json({'message': 'Hello World!'});
});

// ポート設定
const port = process.env.PORT || 3000;

// listenメソッドで指定ポートで待ち受ける
app.listen(port);

// ポートが読み込まれているか確認用コンソールログ
// console.log('Listen on port:' + port);