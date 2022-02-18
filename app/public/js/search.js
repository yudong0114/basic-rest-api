/**
 * ユーザー検索モジュール
 */
const searchModule = (() => {
  // APIのURL
  const BASE_URL = 'http://localhost:3000/api/v1/search';

  return {
    searchUsers: async () => {
      // 検索入力値の取得
      const query = document.getElementById('search').value;
      // APIを叩く
      const res = await fetch(`${BASE_URL}?q=${query}`);
      // jsonをobjectに変換
      const results = await res.json();
      // テーブル書き換え用HTML格納変数
      let body = '';
      // ループ
      results.forEach(result => {
        body += `<tr>
                  <td>${result.id}</td>
                  <td>${result.name}</td>
                  <td>${result.profile}</td>
                  <td>${result.date_of_birth}</td>
                  <td>${result.created_at}</td>
                  <td>${result.updated_at}</td>
                </tr>`;
      });
      // テーブルの書き換え
      document.getElementById('users-list').innerHTML = body;
    }
  }
})();