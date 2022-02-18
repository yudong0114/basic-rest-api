/**
 * ユーザーモジュール
 */
const usersModule = (() => {
  // APIのURL
  const BASE_URL = 'http://localhost:3000/api/v1/users';

  return {
    fetchAllUsers: async () => {
      // APIを叩く
      const res = await fetch(BASE_URL);
      // jsonをobjectに変換
      const users = await res.json();
      // ループ
      users.forEach(user => {
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                      </tr>`;
        // テーブルに追加
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      });
    }
  }
})();