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

// 문장 블록 나열 퀴즈 잠금 해제 여부 (비밀번호 없이 즉시 공개)
var isSentenceUnlocked = true;

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
 * 퀴즈 모드 전환 (단어 맞히기 / 문장 블록 나열 / 직접 입력 완성)
 * @param {string} mode - 'word', 'sentence', 'typing'
 */
function changeMode(mode) {
  currentMode = mode;
  var btnWord = document.getElementById('btnTabWord');
  var btnSent = document.getElementById('btnTabSent');
  var btnType = document.getElementById('btnTabType');

  if (btnWord) btnWord.className = (mode === 'word') ? 'tab-btn active' : 'tab-btn';
  if (btnSent) btnSent.className = (mode === 'sentence') ? 'tab-btn active' : 'tab-btn';
  if (btnType) btnType.className = (mode === 'typing') ? 'tab-btn active' : 'tab-btn';

  var areaWord = document.getElementById('wordQuizArea');
  var areaSent = document.getElementById('sentQuizArea');
  var areaType = document.getElementById('typeQuizArea');

  if (areaWord) areaWord.style.display = (mode === 'word') ? 'block' : 'none';
  if (areaSent) areaSent.style.display = (mode === 'sentence') ? 'block' : 'none';
  if (areaType) areaType.style.display = (mode === 'typing') ? 'block' : 'none';

  if (mode === 'word') {
    if (!currentWord) nextWord();
  } else if (mode === 'sentence') {
    // 문장 블록 퀴즈 즉시 출제
    nextSentence();
  } else if (mode === 'typing') {
    if (!currentTypeSentence) nextTypeSentence();
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
