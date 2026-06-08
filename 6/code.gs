/**
 * 從指定的 Google 試算表建立一個 20 題的英文測驗（選擇題，每題 4 選 1，每題 5 分）。
 *
 * 試算表建議格式（第 1 列為標題）：
 * Question | Option A | Option B | Option C | Option D | Answer
 * Answer 可為 A/B/C/D 或是與選項完全相同的文字。
 *
 * 使用方式：
 * 1) 在 Google Apps Script（script.google.com）建立新專案並貼上此檔案。
 * 2) 執行 createQuizFromSheet() 並授權。
 * 3) 執行後 Log 中會顯示建立的表單編輯網址。
 */

function createQuizFromSheet() {
  var ssId = '1RZNcLDbXHGbHQncufIu1PAEF7LSWREAPTFjvXDVfHdc';
  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    Logger.log('No data found in sheet.');
    return;
  }
  var header = data[0].map(function(h){ return (h || '').toString().trim(); });
  var qIdx = indexOfAny(header, ['Question','問','問題']);
  var aIdx = indexOfAny(header, ['Option A','A','A選項','A.']);
  var bIdx = indexOfAny(header, ['Option B','B','B選項','B.']);
  var cIdx = indexOfAny(header, ['Option C','C','C選項','C.']);
  var dIdx = indexOfAny(header, ['Option D','D','D選項','D.']);
  var ansIdx = indexOfAny(header, ['Answer','答案','Correct']);
  if (qIdx < 0) qIdx = 0;
  if (aIdx < 0) aIdx = 1;
  if (bIdx < 0) bIdx = 2;
  if (cIdx < 0) cIdx = 3;
  if (dIdx < 0) dIdx = 4;
  if (ansIdx < 0) ansIdx = 5;

  var form = FormApp.create('English Quiz (20 Q)').setIsQuiz(true);
  form.setCollectEmail(false);

  var added = 0;
  for (var r = 1; r < data.length && added < 20; r++) {
    var row = data[r];
    var question = (row[qIdx] || '').toString().trim();
    if (!question) continue;
    var opts = [
      (row[aIdx] || '').toString(),
      (row[bIdx] || '').toString(),
      (row[cIdx] || '').toString(),
      (row[dIdx] || '').toString()
    ];
    var answerCell = (row[ansIdx] || '').toString().trim();
    var item = form.addMultipleChoiceItem().setTitle(question).setPoints(5);
    var choices = [];
    for (var j = 0; j < 4; j++) {
      var opt = opts[j] || '';
      var isCorrect = false;
      if (answerCell) {
        var uc = answerCell.toUpperCase();
        if (uc === String.fromCharCode(65 + j)) isCorrect = true; // 'A','B','C','D'
        else if (answerCell === opt) isCorrect = true;
        else if (uc === opt.toUpperCase()) isCorrect = true;
      }
      choices.push(item.createChoice(opt, isCorrect));
    }
    item.setChoices(choices);
    added++;
  }
  Logger.log('Created form edit URL: ' + form.getEditUrl());
  Logger.log('Form published URL: ' + form.getPublishedUrl());
}

function indexOfAny(arr, candidates) {
  for (var i = 0; i < arr.length; i++) {
    var v = (arr[i] || '').toString().trim();
    for (var j = 0; j < candidates.length; j++) {
      if (!candidates[j]) continue;
      if (v === candidates[j]) return i;
      if (v.toUpperCase() === candidates[j].toUpperCase()) return i;
    }
  }
  return -1;
}
