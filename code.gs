// ================================================================
// Google Apps Script: Voting Backend
// このスクリプトをGoogle Apps Scriptプロジェクトにコピーして
// ウェブアプリとしてデプロイしてください
// ================================================================

const SHEET_NAME = 'Votes';

function doGet(e) {
  return HtmlService.createHtmlOutput('Voting API is running.');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.gameId || !data.gameTitle) {
      return createResponse('error', '必須フィールドが不足しています');
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['投票ID', 'ゲームID', 'ゲーム名', '投票日時', 'IPアドレス']);
    }

    const ip = e.parameter.userIp || 'unknown';
    const voteId = 'VOTE-' + Utilities.getUuid();

    sheet.appendRow([
      voteId,
      data.gameId,
      data.gameTitle,
      new Date(data.votedAt),
      ip
    ]);

    return createResponse('ok', '投票が記録されました');

  } catch(err) {
    Logger.log('Error: ' + err);
    return createResponse('error', 'サーバーエラー: ' + err.message);
  }
}

function createResponse(status, message) {
  const payload = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// デバッグ用：スプレッドシートからサマリーを取得
function getVoteSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  const votes = {};

  for (let i = 1; i < data.length; i++) {
    const gameId = data[i][1];
    const gameTitle = data[i][2];
    votes[gameTitle] = (votes[gameTitle] || 0) + 1;
  }

  return votes;
}
