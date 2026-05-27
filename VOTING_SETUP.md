# June 2026 投票ページ セットアップガイド

このガイドでは、投票ページを実際に機能させるための設定手順を説明します。

## ファイル構成

- `voting_form.html` - 投票ページのフロントエンド
- `code.gs` - Google Apps Script バックエンド（投票データ保存）

## セットアップ手順

### 1. Google Apps Scriptプロジェクトを作成

1. [Google Apps Script コンソール](https://script.google.com) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を入力（例：「June 2026 Voting」）

### 2. バックエンドコードを設定

1. `code.gs` の内容をすべてコピー
2. Google Apps Scriptの `Code.gs` に貼り付け
3. 保存（Ctrl+S または Cmd+S）

### 3. スプレッドシートを準備

1. [Google Drive](https://drive.google.com) で新しいスプレッドシートを作成
2. スプレッドシート名を設定（例：「June 2026 Votes」）
3. Google Apps Scriptプロジェクトと同じGoogleアカウントで所有していることを確認

### 4. Google Apps Scriptをスプレッドシートに連携

1. Google Apps Script エディタで、プロジェクト設定（左側の歯車アイコン）をクリック
2. 「プロジェクトの設定」ページで「GCP プロジェクト番号」を確認
3. `code.gs` の最初の行に、スプレッドシートIDを使用するように修正
   
   ```javascript
   // スプレッドシートIDを設定（スプレッドシートのURLから取得）
   // https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid=0
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   
   // 既存のコードを修正：
   const ss = SpreadsheetApp.openById(SHEET_ID);
   ```

### 5. ウェブアプリとしてデプロイ

1. Google Apps Scriptで、「デプロイ」 > 「新しいデプロイ」をクリック
2. デプロイタイプで「ウェブアプリ」を選択
3. 以下のように設定：
   - **実行者**: 自分
   - **次のユーザーとして実行**: 自分
4. デプロイをクリック
5. **ウェブアプリのURLをコピー**（後で使用します）

### 6. 投票ページのHTMLを更新

1. `voting_form.html` をテキストエディタで開く
2. 以下の行を見つけます：
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/d/{SCRIPT_ID}/usercontent';
   ```
3. `{SCRIPT_ID}` を、手順5でコピーしたURLのスクリプトIDで置き換え
   
   例えば、デプロイURLが以下の場合：
   ```
   https://script.google.com/macros/d/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxx/usercontent
   ```
   
   スクリプトIDは `AKfycbxxxxxxxxxxxxxxxxxxxxxxxxx` です。
   
   HTMLを以下のように更新：
   ```javascript
   const GAS_URL = 'https://script.google.com/macros/d/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxx/usercontent';
   ```

### 7. ページをホスト

投票ページをウェブで公開する方法を選択：

#### オプションA: GitHub Pages を使用（推奨）
1. `voting_form.html` をGitHubリポジトリにコミット・プッシュ
2. リポジトリの設定で GitHub Pages を有効化
3. ページがアクセス可能になります

#### オプションB: Google Drive でホスト
1. Google Drive で新しいHTMLファイルを作成
2. `voting_form.html` の内容を貼り付け
3. 公開設定で「リンクを知っている全員が閲覧可能」に設定

#### オプションC: その他のホスティング
- Vercel, Netlify, Firebase Hosting など、任意のサービスを使用

## テスト方法

1. 投票ページを開く
2. いずれかのゲームの「投票する」ボタンをクリック
3. 投票が成功するとメッセージが表示されます
4. Google Apps Scriptのスプレッドシートで「Votes」シートを確認し、データが記録されているか確認

## トラブルシューティング

### エラー: "送信に失敗しました"

1. GAS_URL が正しいか確認
2. Google Apps Scriptがウェブアプリとして正しくデプロイされているか確認
3. ブラウザのコンソール（F12キー）でエラーメッセージを確認

### エラー: "スプレッドシートが見つかりません"

1. `SHEET_ID` が正しく設定されているか確認
2. Google Apps Scriptが、スプレッドシートへのアクセス権限を持っているか確認

## セキュリティに関する注意

- このシステムは基本的な投票機能を提供します
- 本番環境では、以下の実装を検討してください：
  - CORS設定
  - レート制限
  - IPアドレスベースの重複投票防止
  - より詳細なログ記録

## よくある質問

**Q: 1つのデバイスから複数回投票できますか？**
A: 現在のシステムではブラウザのlocalStorageで防止しています。複数のブラウザ・デバイスから投票することは可能です。より厳密な制御が必要な場合は、code.gs を修正してください。

**Q: 投票データはどこに保存されますか？**
A: Google Spreadsheet（指定したシート）に保存されます。

**Q: 投票後、選択を変更できますか？**
A: いいえ。設計上、1デバイスにつき1票のみで、変更はできません。

## サポート

問題が発生した場合は、以下を確認してください：
1. Google Apps Scriptコンソールのログ（実行 > 実行ログを表示）
2. ブラウザの開発者ツール（F12キー）
3. このドキュメントの「トラブルシューティング」セクション
