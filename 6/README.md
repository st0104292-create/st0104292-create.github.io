使用說明 — English Quiz (GAS)

目的
- 從指定的 Google 試算表自動產生一份包含 20 題的 Google Form 測驗（每題為多選題、4 選 1、每題 5 分）。

試算表格式（建議）
- 第 1 列為標題：Question | Option A | Option B | Option C | Option D | Answer
- `Answer` 可為字母 A/B/C/D，或直接填入正確選項的文字。

如何執行
1. 開啟 https://script.google.com 並建立一個新的 Apps Script 專案。
2. 將 `6/code.gs` 的內容貼上到專案中。
3. 儲存，選取函式 `createQuizFromSheet` 並執行（第一次會要求授權）。
4. 執行完成後，請查看 Log（`View > Logs`）取得建立的表單編輯網址。

備註
- 程式會讀取工作表的第 1 張表（sheet[0]），並從第 2 列開始往下取題，直到取得 20 題或資料結束為止。
- 若試算表欄位標題不同，程式會嘗試比對常用標題（例如 'Question','Option A','Answer'），若找不到會預設使用前 6 欄。

試算表連結
- 已設定為讀取: https://docs.google.com/spreadsheets/d/1RZNcLDbXHGbHQncufIu1PAEF7LSWREAPTFjvXDVfHdc

示範（已部署）
- Apps Script 執行網址（示範）: https://script.google.com/macros/s/AKfycby9YsUTxJQfWfAUSl1Vcvua_jkMf1thho2sjAC_Y7I/dev

需要我幫你：
- 將這段程式直接部署到該試算表的 Apps Script（掛在該試算表上），並代為執行一次嗎？
