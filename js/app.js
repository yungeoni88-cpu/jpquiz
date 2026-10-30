/**
 * 앱 공통 상태 및 제어 로직
 */

// 현재 상태 변수
var currentMode = 'word';
var currentWord = null;
var currentSentence = null;
var selectedOption = null;

var isWordChecked = false;
var isSentChecked = false;
var wordSolved = 0;
var wordScore = 0;
var sentSolved = 0;

// 문장 블록 나열 퀴즈 잠금 해제 여부 (세션 동안 유지)
var isSentenceUnlocked = false;

/**
 * 문장 블록 나열 퀴즈 비밀번호 검증 및 잠금 해제
 */
function unlockSentenceQuiz() {
  var inputEl = document.getElementById('sentPwInput');
  var input = inputEl.value.trim();
  var err = document.getElementById('sentLockError');

  if (input === SENTENCE_PW) {
    isSentenceUnlocked = true;
    err.innerText = "";
    document.getElementById('sentLockBox').style.display = 'none';
    document.getElementById('sentQuizContent').style.display = 'block';
    nextSentence();
  } else {
    err.innerText = "❌ 비밀번호가 올바르지 않습니다.";
    inputEl.value = '';
    inputEl.focus();
  }
}

/**
 * 일본어 발음 음성 출력 (Web Speech API)
 * @param {string} text - 음성으로 읽을 텍스트
 */
function speak(text) {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }
}

/**
 * 퀴즈 모드 전환 (단어 맞히기 / 문장 블록 나열)
 * @param {string} mode - 'word' 또는 'sentence'
 */
function changeMode(mode) {
  currentMode = mode;
  document.getElementById('btnTabWord').className = (mode === 'word') ? 'tab-btn active' : 'tab-btn';
  document.getElementById('btnTabSent').className = (mode === 'sentence') ? 'tab-btn active' : 'tab-btn';

  if (mode === 'word') {
    document.getElementById('wordQuizArea').style.display = 'block';
    document.getElementById('sentQuizArea').style.display = 'none';
    if (!currentWord) nextWord();
  } else {
    document.getElementById('wordQuizArea').style.display = 'none';
    document.getElementById('sentQuizArea').style.display = 'block';

    // 문장 퀴즈는 비밀번호가 해제되어 있어야만 문제 화면 표시
    if (isSentenceUnlocked) {
      document.getElementById('sentLockBox').style.display = 'none';
      document.getElementById('sentQuizContent').style.display = 'block';
      if (!currentSentence) nextSentence();
    } else {
      document.getElementById('sentLockBox').style.display = 'block';
      document.getElementById('sentQuizContent').style.display = 'none';
      setTimeout(function() {
        var pwInput = document.getElementById('sentPwInput');
        if (pwInput) pwInput.focus();
      }, 50);
    }
  }
}

/**
 * data/words.json 파일로부터 단어 데이터 동적 로드 (웹 서버/API 환경 지원)
 */
async function loadWordsFromJSON() {
  try {
    var response = await fetch('data/words.json');
    if (response.ok) {
      var data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        wordList = data;
        console.log('✅ data/words.json 로드 성공 (' + wordList.length + '개 단어)');
        if (currentMode === 'word' && !currentWord) nextWord();
      }
    }
  } catch (e) {
    console.log('ℹ️ 로컬(file://) 환경이거나 fetch 불가 시 내장된 wordList 데이터를 사용합니다.');
  }
}

/**
 * data/sentences.json 파일로부터 문장 데이터 동적 로드 (웹 서버/API 환경 지원)
 */
async function loadSentencesFromJSON() {
  try {
    var response = await fetch('data/sentences.json');
    if (response.ok) {
      var data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        sentenceList = data;
        console.log('✅ data/sentences.json 로드 성공 (' + sentenceList.length + '개 문장)');
      }
    }
  } catch (e) {
    console.log('ℹ️ 로컬(file://) 환경이거나 fetch 불가 시 내장된 sentenceList 데이터를 사용합니다.');
  }
}

// 스크립트 로드 시 실행: 데이터 동기화 및 단어 퀴즈 자동 시작
loadWordsFromJSON();
loadSentencesFromJSON();

window.addEventListener('DOMContentLoaded', function() {
  nextWord();
});
