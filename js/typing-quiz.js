/**
 * 로마자 -> 히라가나 매핑 테이블 (긴 음절 우선)
 */
var ROMAJI_TABLE = {
  // 4글자 / 3글자 (요음 및 특수음)
  "xtsu": "っ", "xtu": "っ", "ltsu": "っ", "ltu": "っ",
  "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ", "kye": "きぇ", "kyi": "きぃ",
  "sha": "しゃ", "shu": "しゅ", "sho": "しょ", "she": "しぇ",
  "sya": "しゃ", "syu": "しゅ", "syo": "しょ", "sye": "しぇ",
  "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ", "che": "ちぇ",
  "tya": "ちゃ", "tyu": "ちゅ", "tyo": "ちょ", "tye": "ちぇ",
  "tsu": "つ",
  "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ", "nye": "にぇ",
  "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ", "hye": "ひぇ",
  "mya": "みゃ", "myu": "みゅ", "myo": "みょ", "mye": "みぇ",
  "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ", "rye": "りぇ",
  "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ", "gye": "ぎぇ",
  "zya": "じゃ", "zyu": "じゅ", "zyo": "じょ", "zye": "じぇ",
  "dya": "ぢゃ", "dyu": "ぢゅ", "dyo": "ぢょ", "dye": "ぢぇ",
  "bya": "비ゃ", "byu": "びゅ", "byo": "びょ", "bye": "びぇ",
  "bya": "びゃ",
  "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ", "pye": "ぴぇ",
  "xya": "ゃ", "xyu": "ゅ", "xyo": "ょ",
  "lya": "ゃ", "lyu": "ゅ", "lyo": "ょ",

  // 2글자
  "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
  "sa": "さ", "si": "し", "shi": "し", "su": "す", "se": "せ", "so": "そ",
  "ta": "た", "ti": "ち", "chi": "ち", "tu": "つ", "te": "て", "to": "と",
  "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
  "nn": "ん", "xn": "ん",
  "ha": "は", "hi": "ひ", "hu": "ふ", "fu": "ふ", "he": "へ", "ho": "ほ",
  "fa": "ふぁ", "fi": "ふぃ", "fe": "ふぇ", "fo": "ふぉ",
  "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "모",
  "mo": "も",
  "ya": "や", "yu": "ゆ", "yo": "よ",
  "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
  "wa": "わ", "wo": "を",
  "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
  "za": "ざ", "zi": "じ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
  "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
  "da": "だ", "di": "ぢ", "du": "づ", "de": "で", "do": "ど",
  "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
  "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
  "xa": "ぁ", "xi": "ぃ", "xu": "ぅ", "xe": "ぇ", "xo": "ぉ",
  "la": "ぁ", "li": "ぃ", "lu": "ぅ", "le": "ぇ", "lo": "ぉ",
  "-": "ー",

  // 1글자
  "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お"
};

/**
 * 텍스트 내의 알파벳 로마자를 히라가나로 변환하는 함수
 */
function convertRomajiTextToHiragana(text) {
  var result = "";
  var i = 0;
  var len = text.length;

  while (i < len) {
    var ch = text[i];
    var chLower = ch.toLowerCase();

    // 알파벳 또는 하이픈이 아니면 그대로 유지
    if (!/^[a-z\-]$/.test(chLower)) {
      result += ch;
      i++;
      continue;
    }

    // 1. 촉음 체크: 같은 자음 2연속 (예: tt -> っt, kk -> っk) (단, nn, aeiouwn- 제외)
    if (i + 1 < len) {
      var nextCh = text[i + 1].toLowerCase();
      if (chLower === nextCh && !"aeiouwn-".includes(chLower)) {
        result += "っ";
        i++;
        continue;
      }
    }

    // 2. 최장 일치 매칭 (4, 3, 2글자)
    var matched = false;
    for (var l = Math.min(4, len - i); l >= 2; l--) {
      var sub = text.substring(i, i + l).toLowerCase();
      if (ROMAJI_TABLE[sub]) {
        result += ROMAJI_TABLE[sub];
        i += l;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 3. 1글자 모음 매칭 (단, 뒤에 y가 붙는 자음이 아니어야 함)
    // 만약 현재 문자가 자음(k, s, t, n, h, m, r, g, z, d, b, p 등)이고 뒤에 y가 온다면 1글자로 변환하지 않고 유지
    if (i + 1 < len && text[i + 1].toLowerCase() === 'y') {
      result += ch;
      i++;
      continue;
    }

    // 뒤에 모음이나 다른 자음이 올 수 있는 1글자 자음(k, s 등)은 모음이 아니므로 변환 테이블에 없음
    // 모음 (a, i, u, e, o)인 경우에만 1글자 매칭
    if (ROMAJI_TABLE[chLower]) {
      result += ROMAJI_TABLE[chLower];
      i++;
      continue;
    }

    // 4. n 처리: n 뒤에 자음이 오는 경우 (a,i,u,e,o,y 제외) -> ん
    if (chLower === 'n' && i + 1 < len) {
      var nextCh2 = text[i + 1].toLowerCase();
      if (!"aeiouy".includes(nextCh2)) {
        result += "ん";
        i++;
        continue;
      }
    }

    // 아직 완성되지 않은 자음은 그대로 유지
    result += ch;
    i++;
  }

  return result;
}

/**
 * 3-4과 문장 CSV 데이터 목록 (37문장)
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
  { "sentence": "じゃあ、あした 12じに　가っこうの　まえで。", "mean": "그럼, 내일 12시에 학교 앞에서." },
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

// 중복 제거
exactSentenceList = exactSentenceList.filter(function(item, index, self) {
  return index === self.findIndex(function(t) { return t.sentence === item.sentence; });
});

var currentTypeSentence = null;
var isTypeChecked = false;
var typeSolved = 0;

/**
 * 문장에서 가타카나 단어 추출 (유니코드 30A0-30FF 범위)
 */
function extractKatakanaWords(sentence) {
  if (!sentence) return [];
  var katakanaRegex = /[\u30A0-\u30FFー]+/g;
  var matches = sentence.match(katakanaRegex);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

/**
 * 커서 위치에 가타카나 단어 삽입
 */
function insertKatakanaChip(kata) {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  var start = input.selectionStart != null ? input.selectionStart : input.value.length;
  var end = input.selectionEnd != null ? input.selectionEnd : input.value.length;
  var val = input.value;

  input.value = val.substring(0, start) + kata + val.substring(end);
  var newPos = start + kata.length;
  input.setSelectionRange(newPos, newPos);
  input.focus();
}

/**
 * 가타카나 하단 단어 칩 갱신 렌더러
 */
function updateKatakanaShelf(sentence) {
  var kataBox = document.getElementById('katakanaBoxBottom');
  var kataShelf = document.getElementById('katakanaShelfBottom');
  if (!kataBox || !kataShelf) return;

  kataShelf.innerHTML = '';
  var kataList = extractKatakanaWords(sentence);

  if (kataList && kataList.length > 0) {
    kataBox.style.display = 'block';
    kataList.forEach(function(kata) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'katakana-chip';
      btn.innerText = kata;
      btn.title = '클릭하면 문장에 삽입됩니다';
      btn.onclick = function() {
        insertKatakanaChip(kata);
      };
      kataShelf.appendChild(btn);
    });
  } else {
    kataBox.style.display = 'none';
  }
}

/**
 * 입력창 전체 지우기
 */
function clearTypeInput() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;
  input.value = '';
  input.focus();
}

/**
 * 다음 문제 출제
 */
function nextTypeSentence() {
  if (!exactSentenceList || exactSentenceList.length === 0) {
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

  currentTypeSentence = exactSentenceList[Math.floor(Math.random() * exactSentenceList.length)];
  typeSolved++;
  document.getElementById('typeCount').innerText = typeSolved;
  document.getElementById('typeKoreanHint').innerText = currentTypeSentence.mean;

  // 가타카나 주황색 블록 갱신
  updateKatakanaShelf(currentTypeSentence.sentence);

  setTimeout(function() {
    if (input) input.focus();
  }, 100);
}

/**
 * 문장 정규화 (문장부호 및 띄어쓰기 완전 배제 비교)
 * - 온점(., 。), 쉼표(,, 、), 물음표(?, ？), 느낌표(!, ！), 물결표(~, ～), 따옴표, 괄호, 공백 전면 제거
 */
function stripAllPunctuationAndSpace(str) {
  if (!str) return "";
  return str
    .replace(/[\s\u3000]+/g, '')                             // 모든 공백(반각/전각) 제거
    .replace(/[.。、,?!？！\~～…\(\)（）"'`·\-_]/g, '')     // 모든 문장부호 제거
    .trim();
}

/**
 * 정답 확인 (문장부호 유무 상관없이 문자 알맹이만 일치하면 정답 인정)
 */
function checkTypeSentence() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  // 혹시 끝에 남은 미변환 n 처리 (예: ...desun -> ...ですん)
  var val = input.value;
  if (/n$/i.test(val)) {
    val = val.replace(/n$/i, 'ん');
    input.value = val;
  }

  var userText = input.value.trim();
  var feedback = document.getElementById('typeFeedback');

  if (!userText) {
    feedback.innerText = "문장을 입력해주세요!";
    feedback.style.color = "var(--orange-deep)";
    return;
  }

  isTypeChecked = true;
  document.getElementById('btnCheckType').disabled = true;
  document.getElementById('btnNextType').disabled = false;
  input.readOnly = true;

  var exactTarget = currentTypeSentence.sentence;
  var cleanUser = stripAllPunctuationAndSpace(userText);
  var cleanTarget = stripAllPunctuationAndSpace(exactTarget);

  if (cleanUser === cleanTarget) {
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
 * 이벤트 리스너 등록
 */
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('typeSentenceInput');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkTypeSentence();
      }
    });

    input.addEventListener('input', function(e) {
      if (isTypeChecked) return;

      var oldVal = input.value;
      var curPos = input.selectionStart;

      // 1. 온점 '.' 입력 시 일본어 온점 '。'로 변환
      var converted = oldVal.replace(/\./g, '。');

      // 2. 쉼표 ',' 입력 시 일본어 쉼표 '、'로 변환
      converted = converted.replace(/,/g, '、');

      // 3. 로마자 -> 히라가나 변환 (요음 kya, kyu, kyo, sha, cha, nya 등 완벽 처리)
      converted = convertRomajiTextToHiragana(converted);

      if (converted !== oldVal) {
        var lengthDiff = converted.length - oldVal.length;
        input.value = converted;
        var newPos = Math.max(0, curPos + lengthDiff);
        input.setSelectionRange(newPos, newPos);
      }
    });
  }
});
