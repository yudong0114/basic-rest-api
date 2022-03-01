// 即時関数のモジュール化
const indexModule = (() => {
  // 現在のパスを取得
  const path = window.location.pathname;
  switch (path) {
    case '/': 
      // 検索時のイベントリスナーの登録
      document.getElementById('search-btn')
        .addEventListener('click', () => {
          return searchModule.searchUsers();
        });
      // ユーザー一覧の取得のメソッドを呼び出し
      return usersModule.fetchAllUsers();
      break;
    
    case '/create.html':
      // ユーザーの登録
      document.getElementById('save-btn')
        .addEventListener('click', () => {
          return usersModule.createUser();
        });

      // キャンセルボタン
      document.getElementById('cancel-btn')
        .addEventListener('click', () => {
          return window.location.href = '/';
        });
      break;

    default:
      break;
  }
  
})();