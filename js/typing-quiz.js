/**
 * 로마자 -> 히라가나 매핑 테이블
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
  "ra": "ら", "ri": "り", "ru": "る", "re": "레", "ro": "ろ",
  "re": "れ",
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

  // 소문자 / 특수
  "xa": "ぁ", "xi": "ぃ", "xu": "ぅ", "xe": "ぇ", "xo": "ぉ",
  "xtu": "っ", "xtsu": "っ", "xya": "ゃ", "xyu": "ゅ", "xyo": "ょ",
  "la": "ぁ", "li": "ぃ", "lu": "ぅ", "le": "ぇ", "lo": "ぉ",
  "ltu": "っ", "ltsu": "っ", "lya": "ゃ", "lyu": "ゅ", "lyo": "ょ",
  "-": "ー"
};

/**
 * 특정 가타카나 단어 자동 치환 맵
 * (학생들이 로마자로 입력하더라도 교과서 CSV의 가타카나 단어는 자동으로 가타카나로 변환)
 */
var KATAKANA_AUTO_CONVERT = [
  { kana: "じゅーす", kata: "ジュース" },
  { kana: "じゅうす", kata: "ジュース" },
  { kana: "こーら", kata: "コーラ" },
  { kana: "かれー", kata: "カレー" },
  { kana: "しう", kata: "シウ" },
  { kana: "ぱり", kata: "パリ" }
];

/**
 * 텍스트 내의 특정 단어를 가타카나로 자동 교정
 */
function applySpecificKatakana(text) {
  var res = text;
  KATAKANA_AUTO_CONVERT.forEach(function(item) {
    res = res.split(item.kana).join(item.kata);
  });
  return res;
}

/**
 * 3-4과 문장 CSV 데이터 목록 (정확한 문장 및 의미)
 */
var exactSentenceList = [
  { "sentence": "うどんに　します。", "mean": "우동으로 하겠습니다." },
  { "sentence": "じゅぎょうは　なんじからですか。", "mean": "수업은 몇시부터 입니까?" },
  { "sentence": "くじからです", "mean": "9시부터입니다." },
  { "sentence": "たなかさん、なにに　しますか。", "mean": "다나카씨, 무엇으로 하시겠습니까?" },
  { "sentence": "カレーと　ジュースに　します。", "mean": "카레와 주스로 하겠습니다." },
  { "sentence": "そばの　ほうが　おいしいです。", "mean": "메밀국수 쪽이 (더) 맛있어요." },
  { "sentence": "えいごと　すうがくと　どちらが　むずかしいですか。", "mean": "영어와 수학 중에 어느 쪽이 어렵습니까?" },
  { "sentence": "すうがくの　ほうが　むずかしいです。", "mean": "수학 쪽이 (더) 어렵습니다." },
  { "sentence": "パリの　なつは　あついですか。", "mean": "파리의 여름은 덥습니까?" },
  { "sentence": "いいえ、あまり　あつくないです。", "mean": "아니요, 그다지 덥지 않습니다." },
  { "sentence": "あした、おひる　いっしょに　どう？", "mean": "내일, 점심 같이 어때?" },
  { "sentence": "いいよ！", "mean": "좋아!" },
  { "sentence": "この　おみせ、やすくて　おいしいよ。", "mean": "이 가게, 싸고 맛있어" },
  { "sentence": "いいね。カレーと　てんぷら、どっちが　おいしいかな。", "mean": "좋네. 카레와 튀김, 어느쪽이 맛있을까?" },
  { "sentence": "この　みせ、カレーうどんが　にんきだよ。", "mean": "이 가게는 카레우동이 인기야." },
  { "sentence": "じゃあ、カレーうどんに　する。", "mean": "그럼, 카레우동으로 할게." },
  { "sentence": "わたしも～", "mean": "나도~" },
  { "sentence": "ぼくは　てんぷらうどんに　するよ。", "mean": "나는 튀김우동으로 할게." },
  { "sentence": "うどんに　カレーは　ちょっと", "mean": "우동에 카레는 좀..." },
  { "sentence": "じゃあ、あした 12じに　がっこうの　まえで。", "mean": "그럼, 내일 12시에 학교 앞에서." },
  { "sentence": "は～い。", "mean": "네~" },
  { "sentence": "とても　きれいです。", "mean": "매우 예쁘다." },
  { "sentence": "田中さん、のみものでは　何が　好きですか。", "mean": "다나카씨는 음료중에서 무엇을 좋아합니까?" },
  { "sentence": "コーラが　好きです。", "mean": "콜라를 좋아합니다." },
  { "sentence": "あの　おんせんは　どうですか。", "mean": "저 온천은 어때요?" },
  { "sentence": "とても　ゆうめいです。", "mean": "매우 유명합니다." },
  { "sentence": "あまり　ゆうめいじゃ　ありません", "mean": "그다지 유명하지 않습니다." },
  { "sentence": "にぎやかだね。", "mean": "번화하네." },
  { "sentence": "うん。だいこくの　人も　おおいね。", "mean": "응. 외국인도 많네." },
  { "sentence": "あの　ふね、いくらかな。", "mean": "저 배는 얼마일까?" },
  { "sentence": "ええと、ひとり 900円。", "mean": "음, 한 사람에 900엔." },
  { "sentence": "シウ君は　日本の　どんな　たべものが　好き？", "mean": "시우 군은 일본의 어떤 음식을 좋아해?" },
  { "sentence": "たこやきが　いちばん　好き。", "mean": "타코야끼를 가장 좋아해." },
  { "sentence": "すみません。これ、ふたつ　ください。", "mean": "실례합니다. 이거, 두 개 주세요." },
  { "sentence": "はい、ふたつですね。1200円です。", "mean": "네, 두 개네요. 1200엔입니다." },
  { "sentence": "わあ、すごく　おいしい！", "mean": "와, 정말 맛있어!" },
  { "sentence": "わあ、はやい。おもしろいね。", "mean": "와, 빠르다. 재미있네" }
];

var currentTypeSentence = null;
var isTypeChecked = false;
var typeSolved = 0;
var romajiBuffer = "";

/**
 * 로마자 버퍼 처리 및 입력창 반영
 */
function processRomajiInput(inputEl) {
  var buf = romajiBuffer;
  var appended = "";

  while (buf.length > 0) {
    // 촉음 처리 (tt -> っt, kk -> っk)
    if (buf.length >= 2 && buf[0] === buf[1] && !"aeiouwn".includes(buf[0])) {
      appended += "っ";
      buf = buf.substring(1);
      continue;
    }

    // 최장 일치 검색
    var matched = false;
    for (var len = Math.min(buf.length, 4); len >= 1; len--) {
      var prefix = buf.substring(0, len);
      if (ROMAJI_TABLE[prefix]) {
        appended += ROMAJI_TABLE[prefix];
        buf = buf.substring(len);
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // n + 자음 -> ん
    if (buf.length >= 2 && buf[0] === 'n' && !"aeiouy".includes(buf[1])) {
      appended += "ん";
      buf = buf.substring(1);
      continue;
    }

    break; // 아직 변환 불가능한 미완성 로마자는 버퍼에 유지
  }

  romajiBuffer = buf;

  if (appended.length > 0) {
    var start = inputEl.selectionStart || inputEl.value.length;
    var end = inputEl.selectionEnd || inputEl.value.length;
    var val = inputEl.value;

    inputEl.value = val.substring(0, start) + appended + val.substring(end);
    var newPos = start + appended.length;
    inputEl.setSelectionRange(newPos, newPos);
  }

  // 가타카나 지정 단어 실시간 교정 적용
  var corrected = applySpecificKatakana(inputEl.value);
  if (corrected !== inputEl.value) {
    var curPos = inputEl.selectionStart;
    var diff = corrected.length - inputEl.value.length;
    inputEl.value = corrected;
    inputEl.setSelectionRange(curPos + diff, curPos + diff);
  }

  updateRomajiGuide();
}

/**
 * 버퍼에 남은 미완성 로마자 강제 플러시
 */
function flushRomajiBuffer(inputEl) {
  if (!inputEl) inputEl = document.getElementById('typeSentenceInput');
  if (!inputEl) return;

  var appended = "";
  if (romajiBuffer === 'n') {
    appended = "ん";
  } else if (romajiBuffer.length > 0) {
    if (ROMAJI_TABLE[romajiBuffer]) {
      appended = ROMAJI_TABLE[romajiBuffer];
    } else {
      appended = romajiBuffer;
    }
  }

  romajiBuffer = "";

  if (appended.length > 0) {
    var start = inputEl.selectionStart || inputEl.value.length;
    var end = inputEl.selectionEnd || inputEl.value.length;
    var val = inputEl.value;

    inputEl.value = val.substring(0, start) + appended + val.substring(end);
    var newPos = start + appended.length;
    inputEl.setSelectionRange(newPos, newPos);
  }

  var corrected = applySpecificKatakana(inputEl.value);
  if (corrected !== inputEl.value) {
    inputEl.value = corrected;
  }

  updateRomajiGuide();
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
 * 다음 문제 출제 (3-4과 문장 CSV 풀에서 무작위 선택)
 */
function nextTypeSentence() {
  if (!exactSentenceList || exactSentenceList.length === 0) {
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

  currentTypeSentence = exactSentenceList[Math.floor(Math.random() * exactSentenceList.length)];
  typeSolved++;
  document.getElementById('typeCount').innerText = typeSolved;
  document.getElementById('typeKoreanHint').innerText = currentTypeSentence.mean;

  setTimeout(function() {
    if (input) input.focus();
  }, 100);
}

/**
 * 정답 비교 시 불필요한 차이 정규화 함수
 * - 전각/반각 공백 통일
 * - 일본어 물결표(～)와 일반 물결표(~) 통일
 * - 마침표/쉼표/물음표/느낌표 전각 통일
 */
function normalizeSentence(str) {
  if (!str) return "";
  return str
    .trim()
    .replace(/\s+/g, '') // 공백 제거 비교 (또는 동일 띄어쓰기)
    .replace(/~/g, '～')
    .replace(/\./g, '。')
    .replace(/,/g, '、')
    .replace(/\?/g, '？')
    .replace(/!/g, '！');
}

/**
 * 정답 확인 (CSV 원본 문장과 엄격하게 대조)
 */
function checkTypeSentence() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  flushRomajiBuffer(input);

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

  var exactTarget = currentTypeSentence.sentence;
  var normUser = normalizeSentence(userText);
  var normTarget = normalizeSentence(exactTarget);

  if (normUser === normTarget) {
    feedback.innerHTML = "🎉 <b>정답입니다!</b> 완벽하게 작성했습니다.";
    feedback.style.color = "#059669";
    speak(exactTarget);
  } else {
    feedback.innerHTML = "❌ <b>오답입니다!</b><br>정답: <b style='color:#1E3D31; font-size:1.08rem;'>" + exactTarget + "</b>";
    feedback.style.color = "#DC2626";
    speak(exactTarget);
  }
}

/**
 * 키보드 이벤트 리스너 등록 (디바이스 실제 키보드 연동)
 */
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('typeSentenceInput');
  if (input) {
    // 키 다운 이벤트
    input.addEventListener('keydown', function(e) {
      if (isTypeChecked) return;

      // 1. 알파벳 (a-z, A-Z, -)
      if (/^[a-zA-Z\-]$/.test(e.key)) {
        e.preventDefault();
        romajiBuffer += e.key.toLowerCase();
        processRomajiInput(input);
        return;
      }

      // 2. 온점 '.' 입력 시 일본어 온점 '。'로 자동 변환
      if (e.key === '.') {
        e.preventDefault();
        flushRomajiBuffer(input);
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '。' + input.value.substring(end);
        input.setSelectionRange(start + 1, start + 1);
        return;
      }

      // 3. 쉼표 ',' 입력 시 일본어 쉼표 '、'로 자동 변환
      if (e.key === ',') {
        e.preventDefault();
        flushRomajiBuffer(input);
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '、' + input.value.substring(end);
        input.setSelectionRange(start + 1, start + 1);
        return;
      }

      // 4. 물음표 '?' / 느낌표 '!' 입력 시 전각 변환
      if (e.key === '?') {
        e.preventDefault();
        flushRomajiBuffer(input);
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '？' + input.value.substring(end);
        input.setSelectionRange(start + 1, start + 1);
        return;
      }
      if (e.key === '!') {
        e.preventDefault();
        flushRomajiBuffer(input);
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = input.value.substring(0, start) + '！' + input.value.substring(end);
        input.setSelectionRange(start + 1, start + 1);
        return;
      }

      // 5. 백스페이스
      if (e.key === 'Backspace') {
        if (romajiBuffer.length > 0) {
          e.preventDefault();
          romajiBuffer = romajiBuffer.substring(0, romajiBuffer.length - 1);
          updateRomajiGuide();
        }
        return;
      }

      // 6. 스페이스바 (공백)
      if (e.key === ' ' || e.key === 'Spacebar') {
        flushRomajiBuffer(input);
        return;
      }

      // 7. 엔터 (정답 확인)
      if (e.key === 'Enter') {
        e.preventDefault();
        checkTypeSentence();
        return;
      }
    });

    // 모바일 등 가상 키패드 또는 붙여넣기 input 이벤트 대응
    input.addEventListener('input', function(e) {
      if (isTypeChecked) return;
      var curVal = input.value;
      // 온점 마침표가 들어간 경우 '。'로 치환
      if (curVal.indexOf('.') !== -1) {
        var pos = input.selectionStart;
        input.value = curVal.split('.').join('。');
        input.setSelectionRange(pos, pos);
      }
      // 가타카나 자동 변환
      var corrected = applySpecificKatakana(input.value);
      if (corrected !== input.value) {
        var pos = input.selectionStart;
        input.value = corrected;
        input.setSelectionRange(pos, pos);
      }
    });
  }
});
