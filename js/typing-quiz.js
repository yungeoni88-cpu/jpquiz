/**
 * 직접 입력 문장 완성 퀴즈 로직 (가상 키보드 + 가타카나 블록)
 */

var currentTypeSentence = null;
var isTypeChecked = false;
var typeSolved = 0;
var currentInputText = "";

// 50음도 기본 행 목록 (청음)
var hiraganaRows = [
  { row: "あ", chars: ["あ", "い", "う", "え", "お"] },
  { row: "か", chars: ["か", "き", "く", "け", "こ"] },
  { row: "さ", chars: ["さ", "し", "す", "せ", "そ"] },
  { row: "た", chars: ["た", "ち", "つ", "て", "と"] },
  { row: "な", chars: ["な", "に", "ぬ", "ね", "の"] },
  { row: "は", chars: ["は", "ひ", "ふ", "へ", "ほ"] },
  { row: "ま", chars: ["ま", "み", "む", "め", "も"] },
  { row: "や", chars: ["や", "ゆ", "よ"] },
  { row: "ら", chars: ["ら", "り", "る", "れ", "ろ"] },
  { row: "わ", chars: ["わ", "を", "ん"] }
];

// 탁음/반탁음
var voicedRows = [
  { row: "が行", chars: ["が", "ぎ", "ぐ", "げ", "ご"] },
  { row: "ざ行", chars: ["ざ", "じ", "ず", "ぜ", "ぞ"] },
  { row: "だ行", chars: ["だ", "ぢ", "づ", "で", "ど"] },
  { row: "ば行", chars: ["ば", "び", "ぶ", "べ", "ぼ"] },
  { row: "ぱ行", chars: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"] },
  { row: "促音·기호", chars: ["っ", "ー", "、", "。"] }
];

var selectedRowIndex = 0;

/**
 * 가상 키보드 행 탭 및 문자 버튼 렌더링
 */
function initVirtualKeyboard() {
  var rowTabsEl = document.getElementById('vkRowTabs');
  if (!rowTabsEl) return;
  rowTabsEl.innerHTML = '';

  var allRows = hiraganaRows.concat(voicedRows);

  allRows.forEach(function(r, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vk-row-tab' + (idx === selectedRowIndex ? ' active' : '');
    btn.innerText = r.row;
    btn.onclick = function() {
      selectedRowIndex = idx;
      renderKeyboardKeys();
    };
    rowTabsEl.appendChild(btn);
  });

  renderKeyboardKeys();
}

/**
 * 선택된 행의 글자 버튼들 표시
 */
function renderKeyboardKeys() {
  var rowTabsEl = document.getElementById('vkRowTabs');
  if (rowTabsEl) {
    var tabs = rowTabsEl.querySelectorAll('.vk-row-tab');
    tabs.forEach(function(t, idx) {
      if (idx === selectedRowIndex) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  var keysBox = document.getElementById('vkCharKeys');
  if (!keysBox) return;
  keysBox.innerHTML = '';

  var allRows = hiraganaRows.concat(voicedRows);
  var activeGroup = allRows[selectedRowIndex] || allRows[0];

  activeGroup.chars.forEach(function(ch) {
    var kBtn = document.createElement('button');
    kBtn.type = 'button';
    kBtn.className = 'vk-char-key';
    kBtn.innerText = ch;
    kBtn.onclick = function() {
      insertChar(ch);
    };
    keysBox.appendChild(kBtn);
  });
}

/**
 * 텍스트 입력 처리
 */
function insertChar(ch) {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  var start = input.selectionStart || input.value.length;
  var end = input.selectionEnd || input.value.length;
  var val = input.value;

  input.value = val.substring(0, start) + ch + val.substring(end);
  var newPos = start + ch.length;
  input.setSelectionRange(newPos, newPos);
  input.focus();
}

/**
 * 백스페이스 (한 글자 지우기)
 */
function deleteLastChar() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  var start = input.selectionStart;
  var end = input.selectionEnd;
  var val = input.value;

  if (start === end) {
    if (start > 0) {
      input.value = val.substring(0, start - 1) + val.substring(end);
      input.setSelectionRange(start - 1, start - 1);
    }
  } else {
    input.value = val.substring(0, start) + val.substring(end);
    input.setSelectionRange(start, start);
  }
  input.focus();
}

/**
 * 전체 지우기
 */
function clearTypeInput() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;
  input.value = '';
  input.focus();
}

/**
 * 문장에서 가타카나 단어 추출
 * (유니코드 30A0-30FF 범위)
 */
function extractKatakanaWords(sentence) {
  var katakanaRegex = /[\u30A0-\u30FF]+/g;
  var matches = sentence.match(katakanaRegex);
  if (!matches) return [];
  // 중복 제거
  return Array.from(new Set(matches));
}

/**
 * 다음 문제 출제
 */
function nextTypeSentence() {
  if (!sentenceList || sentenceList.length === 0) {
    alert("문장 데이터가 없습니다.");
    return;
  }

  isTypeChecked = false;
  document.getElementById('typeFeedback').innerText = '';
  document.getElementById('btnNextType').disabled = true;
  document.getElementById('btnCheckType').disabled = false;

  var input = document.getElementById('typeSentenceInput');
  if (input) {
    input.value = '';
    input.readOnly = false;
  }

  // 문장 랜덤 출제
  currentTypeSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
  typeSolved++;
  document.getElementById('typeCount').innerText = typeSolved;
  document.getElementById('typeKoreanHint').innerText = currentTypeSentence.mean;

  // 전체 목표 일본어 정답 문장
  var fullTargetText = currentTypeSentence.chunks.join('');
  currentTypeSentence.fullText = fullTargetText;

  // 가타카나 블록 렌더링
  var katakanaBox = document.getElementById('katakanaBox');
  var katakanaShelf = document.getElementById('katakanaShelf');
  katakanaShelf.innerHTML = '';

  var kataList = extractKatakanaWords(fullTargetText);
  if (kataList.length > 0) {
    katakanaBox.style.display = 'block';
    kataList.forEach(function(kata) {
      var kBtn = document.createElement('button');
      kBtn.type = 'button';
      kBtn.className = 'katakana-chip';
      kBtn.innerText = kata;
      kBtn.title = '클릭하여 입력칸에 삽입';
      kBtn.onclick = function() {
        insertChar(kata);
      };
      katakanaShelf.appendChild(kBtn);
    });
  } else {
    katakanaBox.style.display = 'none';
  }

  initVirtualKeyboard();
  setTimeout(function() {
    if (input) input.focus();
  }, 100);
}

/**
 * 정답 확인
 */
function checkTypeSentence() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  var userText = (input ? input.value : "").trim();
  var feedback = document.getElementById('typeFeedback');

  if (!userText) {
    feedback.innerText = "문장을 입력해주세요!";
    feedback.style.color = "var(--orange-deep)";
    return;
  }

  isTypeChecked = true;
  document.getElementById('btnCheckType').disabled = true;
  document.getElementById('btnNextType').disabled = false;
  if (input) input.readOnly = true;

  // 공백 및 구두점 차이 등에 대한 유연한 비교를 위해 정규화
  var cleanUser = userText.replace(/\s+/g, '');
  var cleanTarget = currentTypeSentence.fullText.replace(/\s+/g, '');

  if (cleanUser === cleanTarget) {
    feedback.innerText = "🎉 대단해요! 완벽하게 문장을 작성했습니다!";
    feedback.style.color = "#059669";
    speak(cleanTarget);
  } else {
    feedback.innerHTML = "❌ 아쉬워요! <br>정답: <b style='color:#1E3D31;'>" + currentTypeSentence.fullText + "</b>";
    feedback.style.color = "#DC2626";
    speak(cleanTarget);
  }
}
