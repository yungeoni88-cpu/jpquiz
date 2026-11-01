/**
 * 로마자 -> 히라가나 자동 변환 테이블 (Hepburn / Kunrei 호환)
 */
var ROMAJI_TABLE = {
  // 모음
  "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
  
  // k
  "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
  "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
  
  // s
  "sa": "さ", "si": "し", "shi": "し", "su": "す", "se": "せ", "so": "そ",
  "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
  "sya": "しゃ", "syu": "しゅ", "syo": "しょ",

  // t
  "ta": "た", "ti": "ち", "chi": "ち", "tu": "つ", "tsu": "つ", "te": "て", "to": "と",
  "cha": "ちゃ", "chu": "ちゅ", "che": "ちぇ", "cho": "ちょ",
  "tya": "ちゃ", "tyu": "ちゅ", "tyo": "ちょ",

  // n
  "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
  "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
  "nn": "ん", "xn": "ん",

  // h
  "ha": "は", "hi": "ひ", "hu": "ふ", "fu": "ふ", "he": "へ", "ho": "ほ",
  "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
  "fa": "ふぁ", "fi": "ふぃ", "fe": "ふぇ", "fo": "ふぉ",

  // m
  "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
  "mya": "みゃ", "myu": "みゅ", "myo": "みょ",

  // y
  "ya": "や", "yu": "ゆ", "yo": "よ",

  // r
  "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
  "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",

  // w
  "wa": "わ", "wo": "を",

  // g
  "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
  "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",

  // z / j
  "za": "ざ", "zi": "じ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
  "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
  "zya": "じゃ", "zyu": "じゅ", "zyo": "じょ",

  // d
  "da": "だ", "di": "ぢ", "du": "づ", "de": "で", "do": "ど",
  "dya": "ぢゃ", "dyu": "ぢゅ", "dyo": "ぢょ",

  // b
  "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
  "bya": "びゃ", "byu": "びゅ", "byo": "びょ",

  // p
  "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
  "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ",

  // 소문자/특수 (x 또는 l 접두사)
  "xa": "ぁ", "xi": "ぃ", "xu": "ぅ", "xe": "ぇ", "xo": "ぉ",
  "xtu": "っ", "xtsu": "っ", "xya": "ゃ", "xyu": "ゅ", "xyo": "ょ",
  "la": "ぁ", "li": "ぃ", "lu": "ぅ", "le": "ぇ", "lo": "ぉ",
  "ltu": "っ", "ltsu": "っ", "lya": "ゃ", "lyu": "ゅ", "lyo": "ょ",
  "-" : "ー"
};

/**
 * 직접 입력 문장 완성 퀴즈 로직 (QWERTY 가상 키보드 + 로마자 히라가나 자동 변환)
 */
var currentTypeSentence = null;
var isTypeChecked = false;
var typeSolved = 0;
var romajiBuffer = ""; // 변환 대기 중인 로마자 버퍼

// QWERTY 가상 키보드 레이아웃
var QWERTY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
  ["z", "x", "c", "v", "b", "n", "m", "、", "。"]
];

/**
 * 가상 키보드 렌더링
 */
function initVirtualKeyboard() {
  var container = document.getElementById('vkQwertyRows');
  if (!container) return;
  container.innerHTML = '';

  QWERTY_ROWS.forEach(function(rowKeys) {
    var rowDiv = document.createElement('div');
    rowDiv.className = 'qwerty-row';

    rowKeys.forEach(function(k) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qwerty-key';
      btn.innerText = k;
      btn.onclick = function() {
        handleKeyInput(k);
      };
      rowDiv.appendChild(btn);
    });

    container.appendChild(rowDiv);
  });
}

/**
 * 키 입력 처리 (QWERTY 키 터치 또는 물리 키보드 입력 공통 처리)
 */
function handleKeyInput(char) {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  var lower = char.toLowerCase();

  // 구두점이나 기호인 경우 버퍼 플러시 후 그대로 추가
  if (lower === '、' || lower === '。' || lower === '?' || lower === '!' || lower === '？' || lower === '！') {
    flushRomajiBuffer();
    appendStringToInput(lower === '?' ? '？' : (lower === '!' ? '！' : lower));
    return;
  }

  // 특수 장음 부호
  if (lower === '-') {
    flushRomajiBuffer();
    appendStringToInput('ー');
    return;
  }

  // 자음/모음 로마자 추가
  romajiBuffer += lower;
  processRomajiBuffer();
}

/**
 * 로마자 버퍼 -> 히라가나 변환 로직
 */
function processRomajiBuffer() {
  var buf = romajiBuffer;

  // 1. 촉음 처리: 자음 2개 연속 (단, 'nn'은 제외)
  // 예: "tt" -> "っ" + "t", "kk" -> "っ" + "k", "ss" -> "っ" + "s"
  if (buf.length >= 2 && buf[0] === buf[1] && !"aeiouwn".includes(buf[0])) {
    appendStringToInput("っ");
    romajiBuffer = buf.substring(1);
    buf = romajiBuffer;
  }

  // 2. 긴 조합부터 테이블 매칭 시도 (예: kya, sha, chi, tsu ...)
  for (var len = Math.min(buf.length, 4); len >= 1; len--) {
    var prefix = buf.substring(0, len);
    if (ROMAJI_TABLE[prefix]) {
      appendStringToInput(ROMAJI_TABLE[prefix]);
      romajiBuffer = buf.substring(len);
      updateRomajiGuide();
      return;
    }
  }

  // 3. n 처리: n 뒤에 자음이 오거나 단어 끝일 때 'ん'
  // (모음 a, i, u, e, o, y가 아닌 자음이 붙었을 경우 앞 n은 'ん')
  if (buf.length >= 2 && buf[0] === 'n' && !"aeiouy".includes(buf[1])) {
    appendStringToInput("ん");
    romajiBuffer = buf.substring(1);
    processRomajiBuffer();
    return;
  }

  // 아직 완성되지 않은 조합 (예: 'k', 'sh')은 가이드에 표시
  updateRomajiGuide();
}

/**
 * 버퍼에 남은 로마자 강제 플러시 (공백/체크 시 호출)
 */
function flushRomajiBuffer() {
  if (romajiBuffer === 'n') {
    appendStringToInput('ん');
  } else if (romajiBuffer.length > 0) {
    if (ROMAJI_TABLE[romajiBuffer]) {
      appendStringToInput(ROMAJI_TABLE[romajiBuffer]);
    } else {
      appendStringToInput(romajiBuffer);
    }
  }
  romajiBuffer = "";
  updateRomajiGuide();
}

/**
 * 입력창에 문자열 추가
 */
function appendStringToInput(str) {
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;
  var start = input.selectionStart || input.value.length;
  var end = input.selectionEnd || input.value.length;
  var val = input.value;

  input.value = val.substring(0, start) + str + val.substring(end);
  var newPos = start + str.length;
  input.setSelectionRange(newPos, newPos);
  input.focus();
}

/**
 * 로마자 조합 중 상태 표시
 */
function updateRomajiGuide() {
  var guide = document.getElementById('romajiPending');
  if (guide) {
    if (romajiBuffer) {
      guide.innerText = "입력 중: " + romajiBuffer;
      guide.style.display = "inline-block";
    } else {
      guide.innerText = "";
      guide.style.display = "none";
    }
  }
}

/**
 * 백스페이스 (한 글자 지우기)
 */
function deleteLastChar() {
  if (isTypeChecked) return;

  // 만약 로마자 입력 버퍼에 남아있다면 버퍼부터 한 글자 지움
  if (romajiBuffer.length > 0) {
    romajiBuffer = romajiBuffer.substring(0, romajiBuffer.length - 1);
    updateRomajiGuide();
    return;
  }

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
 * 스페이스바 (공백 삽입)
 */
function handleSpaceKey() {
  if (isTypeChecked) return;
  flushRomajiBuffer();
  appendStringToInput(' ');
}

/**
 * 전체 지우기
 */
function clearTypeInput() {
  if (isTypeChecked) return;
  romajiBuffer = "";
  updateRomajiGuide();
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;
  input.value = '';
  input.focus();
}

/**
 * 가타카나 칩 삽입 (단어 단위 클릭)
 */
function insertKatakanaWord(kata) {
  if (isTypeChecked) return;
  flushRomajiBuffer();
  appendStringToInput(kata);
}

/**
 * 문장에서 가타카나 단어 추출
 */
function extractKatakanaWords(sentence) {
  var katakanaRegex = /[\u30A0-\u30FF]+/g;
  var matches = sentence.match(katakanaRegex);
  if (!matches) return [];
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
  romajiBuffer = "";
  updateRomajiGuide();

  document.getElementById('typeFeedback').innerText = '';
  document.getElementById('btnNextType').disabled = true;
  document.getElementById('btnCheckType').disabled = false;

  var input = document.getElementById('typeSentenceInput');
  if (input) {
    input.value = '';
    input.readOnly = false;
  }

  currentTypeSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
  typeSolved++;
  document.getElementById('typeCount').innerText = typeSolved;
  document.getElementById('typeKoreanHint').innerText = currentTypeSentence.mean;

  var fullTargetText = currentTypeSentence.chunks.join('');
  currentTypeSentence.fullText = fullTargetText;

  // 가타카나 칩 렌더링
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
      kBtn.title = '클릭하여 입력창에 넣기';
      kBtn.onclick = function() {
        insertKatakanaWord(kata);
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
  flushRomajiBuffer();

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

// 키보드 직접 입력(PC 키보드 등) 이벤트 리스너 연동
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('typeSentenceInput');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (isTypeChecked) return;

      // 알파벳 키 입력 시 자동 로마자 변환 처리
      if (/^[a-zA-Z\-]$/.test(e.key)) {
        e.preventDefault();
        handleKeyInput(e.key.toLowerCase());
      } else if (e.key === 'Backspace') {
        if (romajiBuffer.length > 0) {
          e.preventDefault();
          deleteLastChar();
        }
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleSpaceKey();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        checkTypeSentence();
      }
    });
  }
});
