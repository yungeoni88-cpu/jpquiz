/**
 * 문장 블록 나열 퀴즈 로직 (전체 무작위 셔플 랜덤 출제)
 */

/**
 * 다음 문장 퀴즈 문제 출제 (전체 문장 랜덤 셔플)
 */
function nextSentence() {
  if (!sentenceList || sentenceList.length === 0) {
    alert("문장 데이터가 없습니다.");
    return;
  }

  isSentChecked = false;
  document.getElementById('sentFeedback').innerText = '';
  document.getElementById('btnNextSent').disabled = true;
  document.getElementById('btnCheckSent').disabled = false;

  // 전체 문장 풀에서 완전 무작위 랜덤 출제
  currentSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
  document.getElementById('targetKorean').innerText = currentSentence.mean;

  var tray = document.getElementById('answerTray');
  var shelf = document.getElementById('blockShelf');
  tray.innerHTML = '';
  shelf.innerHTML = '';

  // 블록 순서 무작위 셔플
  var shuffledChunks = currentSentence.chunks.slice().sort(function() { return 0.5 - Math.random(); });

  shuffledChunks.forEach(function(text) {
    var block = document.createElement('div');
    block.className = 'hiragana-block';
    block.innerText = text;
    block.onclick = function() { moveBlock(block); };
    shelf.appendChild(block);
  });
}

/**
 * 단어 블록 터치 시 위치 이동 (보관함 <-> 답안 트레이)
 * @param {HTMLElement} block - 클릭된 단어 블록 요소
 */
function moveBlock(block) {
  if (isSentChecked) return;
  var tray = document.getElementById('answerTray');
  var shelf = document.getElementById('blockShelf');

  if (block.parentElement === shelf) {
    tray.appendChild(block);
  } else {
    shelf.appendChild(block);
  }
}

/**
 * 답안 트레이에 놓인 모든 블록을 보관함으로 리셋
 */
function resetSentenceBlocks() {
  if (isSentChecked) return;
  var tray = document.getElementById('answerTray');
  var shelf = document.getElementById('blockShelf');
  while (tray.firstChild) {
    shelf.appendChild(tray.firstChild);
  }
  document.getElementById('sentFeedback').innerText = '';
}

/**
 * 나열된 문장 블록 정답 확인
 */
function checkSentence() {
  if (isSentChecked) return;

  var tray = document.getElementById('answerTray');
  var userOrder = [];
  for (var i = 0; i < tray.children.length; i++) {
    userOrder.push(tray.children[i].innerText);
  }

  if (userOrder.length === 0) {
    alert("단어 블록을 눌러 문장을 완성해보세요!");
    return;
  }

  var fullSentence = currentSentence.chunks.join('');
  var fb = document.getElementById('sentFeedback');

  if (userOrder.join('') === fullSentence) {
    isSentChecked = true;
    sentSolved++;
    document.getElementById('sentCount').innerText = sentSolved;
    fb.innerText = '🎉 훌륭합니다! 완벽한 문장입니다.';
    fb.style.color = '#10B981';
    document.getElementById('btnCheckSent').disabled = true;
    document.getElementById('btnNextSent').disabled = false;
    speak(fullSentence);
  } else {
    fb.innerText = '순서가 틀렸습니다. 다시 놓기를 눌러 시도해보세요!';
    fb.style.color = '#EF4444';
  }
}
