const NOTE_FOLDER_ID = '1_5uv1-bj3pz2sHPmPmUWACXR7iWYjBcV';
const NOTE_FILE_NAME = '記事本.txt';

function doGet() {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <base target="top">
    <meta charset="UTF-8">
    <title>線上記事本</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; }
      textarea { width: 100%; height: 72vh; resize: vertical; font-size: 14px; padding: 12px; line-height: 1.5; }
      button { padding: 10px 18px; font-size: 16px; margin-top: 12px; }
      #status { margin-top: 12px; color: #333; }
    </style>
  </head>
  <body>
    <h1>線上記事本</h1>
    <textarea id="noteArea" placeholder="載入記事本中..." disabled></textarea>
    <br>
    <button id="saveButton" disabled>儲存記事本</button>
    <div id="status">正在載入記事本...</div>

    <script>
      function setStatus(message, isError) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.style.color = isError ? '#c00' : '#333';
      }

      function enableEditor() {
        const textarea = document.getElementById('noteArea');
        const button = document.getElementById('saveButton');
        textarea.disabled = false;
        button.disabled = false;
      }

      function loadNote() {
        google.script.run.withSuccessHandler(function(content) {
          document.getElementById('noteArea').value = content;
          enableEditor();
          setStatus('已載入記事本，請開始編輯。');
        }).withFailureHandler(function(error) {
          setStatus('載入失敗：' + error.message, true);
        }).getNoteContent();
      }

      function saveNote() {
        const content = document.getElementById('noteArea').value;
        document.getElementById('saveButton').disabled = true;
        setStatus('正在儲存...');
        google.script.run.withSuccessHandler(function(message) {
          setStatus(message);
          document.getElementById('saveButton').disabled = false;
        }).withFailureHandler(function(error) {
          setStatus('儲存失敗：' + error.message, true);
          document.getElementById('saveButton').disabled = false;
        }).saveNoteContent(content);
      }

      document.getElementById('saveButton').addEventListener('click', saveNote);
      window.addEventListener('load', loadNote);
    </script>
  </body>
</html>`;

  return HtmlService.createHtmlOutput(html)
    .setTitle('線上記事本');
}

function getNoteFolder() {
  return DriveApp.getFolderById(NOTE_FOLDER_ID);
}

function getNoteFile() {
  const folder = getNoteFolder();
  const files = folder.getFilesByName(NOTE_FILE_NAME);
  if (files.hasNext()) {
    return files.next();
  }
  return folder.createFile(NOTE_FILE_NAME, '', MimeType.PLAIN_TEXT);
}

function getNoteContent() {
  const file = getNoteFile();
  return file.getBlob().getDataAsString('UTF-8');
}

function saveNoteContent(content) {
  const file = getNoteFile();
  file.setContent(content);
  return '已儲存 article 本檔案：' + NOTE_FILE_NAME;
}
