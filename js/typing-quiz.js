/**
 * 로마자 -> 히라가나 매핑 테이블
 */
var ROMAJI_TABLE = {
  // 4글자 / 3글자
  "xtsu": "っ", "xtu": "っ", "ltsu": "っ", "ltu": "っ",
  "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ", "kye": "きぇ", "kyi": "きぃ",
  "sha": "しゃ", "shu": "しゅ", "sho": "しょ", "she": "しぇ",
  "sya": "しゃ", "syu": "しゅ", "syo": "しょ", "sye": "しぇ",
  "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ", "che": "ちぇ",
  "tya": "ちゃ", "tyu": "ちゅ", "tyo": "ちょ", "tye": "ちぇ",
  "cya": "ちゃ", "cyu": "ちゅ", "cyo": "ちょ", "cye": "ちぇ",
  "tsu": "つ",
  "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ", "nye": "にぇ",
  "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ", "hye": "ひぇ",
  "mya": "みゃ", "myu": "みゅ", "myo": "みょ", "mye": "みぇ",
  "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ", "rye": "りぇ",
  "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ", "gye": "ぎぇ",
  "zya": "じゃ", "zyu": "じゅ", "zyo": "じょ", "zye": "じぇ",
  "jya": "じゃ", "jyu": "じゅ", "jyo": "じょ", "jye": "じぇ",
  "dya": "ぢゃ", "dyu": "ぢゅ", "dyo": "ぢょ", "dye": "ぢぇ",
  "bya": "びゃ", "byu": "びゅ", "byo": "びょ", "bye": "びぇ",
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
  "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
  "ya": "や", "yu": "ゆ", "yo": "よ",
  "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
  "wa": "わ", "wo": "를",
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

    // 1. 촉음 체크:
    // (A) tch -> っch (예: chotto -> ちょっと)
    if (i + 1 < len) {
      var nextCh = text[i + 1].toLowerCase();
      if (chLower === 't' && nextCh === 'c' && i + 2 < len && text[i + 2].toLowerCase() === 'h') {
        result += "っ";
        i++;
        continue;
      }
      // (B) 같은 자음 2연속: tt -> っt, kk -> っk, ss -> っs 등 (단, nn, aeiouwn- 제외)
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

    // 3. 1글자 모음 매칭
    // 만약 현재 문자가 자음이고 뒤에 y 또는 h(ch, sh 등)가 온다면 조합 대기
    if (i + 1 < len) {
      var nextChar = text[i + 1].toLowerCase();
      if (nextChar === 'y' || (chLower === 's' && nextChar === 'h') || (chLower === 'c' && nextChar === 'h')) {
        result += ch;
        i++;
        continue;
      }
    }

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
 * [최종 수정 문장 목록] (유저 제공 최종안 100% 반영)
 */
var exactSentenceList = [
  { "sentence": "うどんに　します。", "mean": "우동으로 하겠습니다.", "chunks": ["うどん", "に", "します"] },
  { "sentence": "じゅぎょうは　なんじからですか。", "mean": "수업은 몇시부터 입니까?", "chunks": ["じゅぎょう", "は", "なんじ", "から", "ですか"] },
  { "sentence": "くじからです", "mean": "9시부터입니다.", "chunks": ["くじ", "から", "です"] },
  { "sentence": "たなかさん、なにに　しますか。", "mean": "다나카씨, 무엇으로 하시겠습니까?", "chunks": ["たなかさん", "なに", "に", "しますか"] },
  { "sentence": "カレーと　ジュースに　します。", "mean": "카레와 주스로 하겠습니다.", "chunks": ["カレー", "と", "ジュース", "に", "します"] },
  { "sentence": "そばの　ほうが　おいしいです。", "mean": "메밀국수 쪽이 (더) 맛있어요.", "chunks": ["そば", "の", "ほう", "が", "おいしいです"] },
  { "sentence": "えいごと　すうがくと　どちらが　むずかしいですか。", "mean": "영어와 수학 중에 어느 쪽이 어렵습니까?", "chunks": ["えいご", "と", "すうがく", "と", "どちら", "が", "むずかしいですか"] },
  { "sentence": "すうがくの　ほうが　むずかしいです。", "mean": "수학 쪽이 (더) 어렵습니다.", "chunks": ["すうがく", "の", "ほう", "가", "おいしいです", "むずかしいです"] },
  { "sentence": "パリの　なつは　あついですか。", "mean": "파리의 여름은 덥습니까?", "chunks": ["パリ", "の", "なつ", "は", "あついですか"] },
  { "sentence": "いいえ、あまり　あつくないです。", "mean": "아니요, 그다지 덥지 않습니다.", "chunks": ["いいえ", "あまり", "あつくないです"] },
  { "sentence": "あした、おひる　いっしょに　どう？", "mean": "내일, 점심 같이 어때?", "chunks": ["あした", "おひる", "いっしょに", "どう"] },
  { "sentence": "いいよ。", "mean": "좋아.", "chunks": ["いいよ"] },
  { "sentence": "この　おみせ、やすくて　おいしいよ。", "mean": "이 가게, 싸고 맛있어.", "chunks": ["この", "おみせ", "やすくて", "おいしいよ"] },
  { "sentence": "いいね。カレーと　てんぷら、どっちが　おいしいかな。", "mean": "좋네. 카레와 튀김, 어느쪽이 맛있을까?", "chunks": ["いいね", "カレー", "と", "てんぷら", "どっち", "が", "おいしいかな"] },
  { "sentence": "この　みせ、カレーうどんが　にんきだよ。", "mean": "이 가게, 카레우동이 인기야.", "chunks": ["この", "みせ", "カレーうどん", "が", "にんきだよ"] },
  { "sentence": "じゃあ、カレーうどんに　する。", "mean": "그럼, 카레우동으로 할게.", "chunks": ["じゃあ", "カレーうどん", "に", "する"] },
  { "sentence": "わたしも", "mean": "나도", "chunks": ["わたしも"] },
  { "sentence": "ぼくは　てんぷらうどんに　するよ。", "mean": "나는 튀김우동으로 할게.", "chunks": ["ぼく", "は", "てんぷらうどん", "に", "するよ"] },
  { "sentence": "うどんに　カレーは　ちょっと", "mean": "우동에 카레는 좀...", "chunks": ["うどん", "に", "カレー", "は", "ちょっと"] },
  { "sentence": "じゃあ、あした 12じに　がっこうの　まえで。", "mean": "그럼, 내일 12시에 학교 앞에서.", "chunks": ["じゃあ", "あした", "12じ", "に", "がっこう", "の", "まえで"] },
  { "sentence": "は～い。", "mean": "네~에", "chunks": ["はーい", "は～い"] },
  { "sentence": "とても　きれいです。", "mean": "매우 예쁘다.", "chunks": ["とても", "きれい", "です"] },
  { "sentence": "田中さん、のみものでは　何が　好きですか。", "mean": "다나카씨, 음료중에서 무엇을 좋아합니까?", "chunks": ["田中さん", "たなかさん", "のみもの", "何が", "なにが", "好き", "すき", "ですか"] },
  { "sentence": "コーラが　好きです。", "mean": "콜라를 좋아합니다.", "chunks": ["コーラ", "こーら", "好き", "すき", "です"] },
  { "sentence": "あの　おんせんは　どうですか。", "mean": "저 온천은 어때요?", "chunks": ["あの", "おんせん", "は", "どうですか"] },
  { "sentence": "とても　ゆうめいです。", "mean": "매우 유명합니다.", "chunks": ["とても", "ゆうめい", "です"] },
  { "sentence": "あまり　ゆうめいじゃ　ありません。", "mean": "그다지 유명하지 않습니다.", "chunks": ["あまり", "ゆうめい", "じゃ", "ありません"] },
  { "sentence": "にぎやかだね。", "mean": "번화하네.", "chunks": ["にぎやか", "だね"] },
  { "sentence": "うん。がいこくの　人も　おおいね。", "mean": "응. 외국인도 많네.", "chunks": ["うん", "がいこく", "人", "ひと", "おおいね"] },
  { "sentence": "あの　ふね、いくらかな。", "mean": "저 배는 얼마일까?", "chunks": ["あの", "ふね", "いくらかな"] },
  { "sentence": "ええと、ひとり 900円。", "mean": "음, 한 사람에 900엔.", "chunks": ["ええと", "ひとり", "900円", "きゅうひゃくえん"] },
  { "sentence": "シウ君は　日本の　どんな　たべものが　好き？", "mean": "시우 군은 일본의 어떤 음식을 좋아해?", "chunks": ["シウ君", "シウくん", "日本", "にほん", "どんな", "たべもの", "好き", "すき"] },
  { "sentence": "たこやきが　いちばん　好き。", "mean": "타코야끼를 가장 좋아해.", "chunks": ["たこやき", "いちばん", "好き", "すき"] },
  { "sentence": "すみません。これ、ふたつ　ください。", "mean": "실례합니다. 이거, 두 개 주세요.", "chunks": ["すみません", "これ", "ふたつ", "ください"] },
  { "sentence": "はい、ふたつですね。1200円です。", "mean": "네, 두 개네요. 1200엔입니다.", "chunks": ["はい", "ふたつですね", "1200円", "せんにひゃくえん", "です"] },
  { "sentence": "わあ、すごく　おいしい！", "mean": "와, 대단하고 맛있어!", "chunks": ["わあ", "すごく", "おいしい"] },
  { "sentence": "わあ、はやい。おもしろいね。", "mean": "와, 빠르다. 재미있네", "chunks": ["わあ", "はやい", "おもしろいね"] }
];

var currentTypeSentence = null;
var isTypeChecked = false;
var typeSolved = 0;

/**
 * 문장에서 클릭 가능한 단어 힌트 칩 목록 추출
 */
function getSentenceHintChips(item) {
  if (!item) return [];
  var set = [];

  // 1. 가타카나 단어 최우선 등록
  var kataMatches = item.sentence.match(/[\u30A0-\u30FFー]+/g);
  if (kataMatches) {
    kataMatches.forEach(function(k) {
      if (!set.includes(k)) set.push(k);
    });
  }

  // 2. chunks 단어들 등록
  if (item.chunks && item.chunks.length > 0) {
    item.chunks.forEach(function(chk) {
      var clean = chk.replace(/[\s\u3000.。、,?!？！~～]/g, '').trim();
      if (clean && clean.length > 1 && !set.includes(clean)) {
        set.push(clean);
      }
    });
  }

  return set;
}

/**
 * 커서 위치에 단어 칩 삽입
 */
function insertChipText(text) {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  var start = input.selectionStart != null ? input.selectionStart : input.value.length;
  var end = input.selectionEnd != null ? input.selectionEnd : input.value.length;
  var val = input.value;

  input.value = val.substring(0, start) + text + val.substring(end);
  var newPos = start + text.length;
  input.setSelectionRange(newPos, newPos);
  input.focus();
}

/**
 * 하단 단어 칩 목록 갱신 렌더러
 */
function updateHintShelf(item) {
  var box = document.getElementById('katakanaBoxBottom');
  var shelf = document.getElementById('katakanaShelfBottom');
  if (!box || !shelf) return;

  shelf.innerHTML = '';
  var chips = getSentenceHintChips(item);

  if (chips && chips.length > 0) {
    box.style.display = 'block';
    chips.forEach(function(word) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'katakana-chip';
      btn.innerText = word;
      btn.title = '클릭하면 문장에 자동 삽입됩니다';
      btn.onclick = function() {
        insertChipText(word);
      };
      shelf.appendChild(btn);
    });
  } else {
    box.style.display = 'none';
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

  // 하단 단어 칩 갱신
  updateHintShelf(currentTypeSentence);

  setTimeout(function() {
    if (input) input.focus();
  }, 100);
}

/**
 * 가타카나를 히라가나로 변환하는 유틸리티
 */
function katakanaToHiragana(str) {
  if (!str) return "";
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * 한자 및 표기를 가나 발음으로 정규화하는 사전
 * (유저가 한자로 넣든 히라가나로 넣든 모두 정답 인정)
 */
function normalizeKanjiAndReadings(str) {
  if (!str) return "";
  return str
    .replace(/田中さん/g, 'たなかさん')
    .replace(/何が/g, 'なにが')
    .replace(/何/g, 'なに')
    .replace(/好き/g, 'すき')
    .replace(/人/g, 'ひと')
    .replace(/12じ/g, 'じゅうにじ')
    .replace(/１２じ/g, 'じゅうにじ')
    .replace(/900円/g, 'きゅうひゃくえん')
    .replace(/９００円/g, 'きゅうひゃくえん')
    .replace(/1200円/g, 'せんにひゃくえん')
    .replace(/１２００円/g, 'せんにひゃくえん')
    .replace(/シウ君/g, 'シウくん')
    .replace(/日本/g, 'にほん');
}

/**
 * 문장 정규화:
 * - 물결표, 온점, 쉼표, 물음표, 느낌표, 공백 완전 제거
 * - 가타카나/한자를 히라가나로 정규화
 */
function stripAllPunctuationAndSpace(str) {
  if (!str) return "";
  var norm = normalizeKanjiAndReadings(str);
  var hira = katakanaToHiragana(norm);
  return hira
    .replace(/[\s\u3000]+/g, '')                             // 모든 공백 제거
    .replace(/[~～.。、,?!？！…\(\)（）"'`·\-_~]/g, '')     // 모든 문장부호 제거
    .trim();
}

/**
 * 종결어미(よ, ね, だよ, だね 등) 유연화 함수
 */
function stripSentenceEndings(str) {
  if (!str) return str;
  return str
    .replace(/(だよ|だね)$/, '')
    .replace(/(よ|ね)$/, '');
}

/**
 * 정답 확인
 */
function checkTypeSentence() {
  if (isTypeChecked) return;
  var input = document.getElementById('typeSentenceInput');
  if (!input) return;

  // 끝에 남은 미변환 n 처리 (예: ...desun -> ...ですん)
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

  // 1. 완전 일치 (공백/부호/가타카나/한자 차이 무시)
  var isCorrect = (cleanUser === cleanTarget);

  // 2. 종결어미(よ, ね 등) 눈치껏 맞다 해주기
  if (!isCorrect) {
    var baseUser = stripSentenceEndings(cleanUser);
    var baseTarget = stripSentenceEndings(cleanTarget);
    if (baseUser === baseTarget) {
      isCorrect = true;
    }
  }

  if (isCorrect) {
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

      // 3. 로마자 -> 히라가나 변환 (chotto, motto, kya, sha 등 완벽 지원)
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
