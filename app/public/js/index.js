// 即時関数のモジュール化
const indexModule = (() => {
  // 検索時のイベントリスナーの登録
  document.getElementById('search-btn')
    .addEventListener('click', () => {
      return searchModule.searchUsers();
    });
  // ユーザー一覧の取得のメソッドを呼び出し
  return usersModule.fetchAllUsers();
})();