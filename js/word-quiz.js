/**
 * 단어 뜻 맞히기 퀴즈 로직 (전체 무작위 셔플 랜덤 출제)
 */

/**
 * 현재 출제된 단어 발음 듣기
 */
function speakCurrentWord() {
  if (currentWord) {
    speak(currentWord.reading || currentWord.word);
  }
}

/**
 * 다음 단어 퀴즈 문제 출제 (전체 단어 랜덤 셔플)
 */
function nextWord() {
  if (!wordList || wordList.length < 4) {
    alert("단어 데이터가 부족합니다.");
    return;
  }

  isWordChecked = false;
  selectedOption = null;
  document.getElementById('wordFeedback').innerText = '';
  document.getElementById('btnNextWord').disabled = true;
  document.getElementById('btnCheckWord').disabled = false;

  // 전체 단어 풀에서 완전 무작위 랜덤 출제
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  document.getElementById('targetHiragana').innerText = currentWord.word;

  // 오답 보기 3개 무작위 추출
  var wrongMeans = wordList
    .filter(function(w) { return w.mean !== currentWord.mean; })
    .map(function(w) { return w.mean; });

  wrongMeans = Array.from(new Set(wrongMeans))
    .sort(function() { return 0.5 - Math.random(); })
    .slice(0, 3);

  // 정답과 오답을 합쳐서 4지선다 무작위 셔플
  var choices = [currentWord.mean]
    .concat(wrongMeans)
    .sort(function() { return 0.5 - Math.random(); });

  var box = document.getElementById('optionsBox');
  box.innerHTML = '';

  var labels = ['A', 'B', 'C', 'D'];
  choices.forEach(function(choice, idx) {
    var item = document.createElement('div');
    item.className = 'option-item';
    item.innerHTML = '<span class="option-label">' + labels[idx] + '</span> <span>' + choice + '</span>';
    item.onclick = function() {
      if (isWordChecked) return;
      var all = document.querySelectorAll('.option-item');
      for (var k = 0; k < all.length; k++) all[k].classList.remove('selected');
      item.classList.add('selected');
      selectedOption = choice;
    };
    box.appendChild(item);
  });
}

/**
 * 선택한 단어 보기 정답 확인
 */
function checkWord() {
  if (isWordChecked) return;
  if (!selectedOption) {
    alert("보기(A, B, C, D) 중 하나를 선택해주세요!");
    return;
  }

  isWordChecked = true;
  wordSolved++;
  document.getElementById('wordCount').innerText = wordSolved;
  document.getElementById('btnCheckWord').disabled = true;
  document.getElementById('btnNextWord').disabled = false;

  speakCurrentWord();
  var allItems = document.querySelectorAll('.option-item');

  for (var i = 0; i < allItems.length; i++) {
    var text = allItems[i].querySelector('span:nth-child(2)').innerText;
    if (text === currentWord.mean) allItems[i].classList.add('correct');
  }

  var fb = document.getElementById('wordFeedback');
  if (selectedOption === currentWord.mean) {
    wordScore++;
    document.getElementById('wordScore').innerText = wordScore;
    fb.innerText = '✨ 정답입니다!';
    fb.style.color = '#10B981';
  } else {
    for (var j = 0; j < allItems.length; j++) {
      var t = allItems[j].querySelector('span:nth-child(2)').innerText;
      if (t === selectedOption) allItems[j].classList.add('wrong');
    }
    fb.innerText = '오답입니다! 정답은 "' + currentWord.mean + '" 입니다.';
    fb.style.color = '#EF4444';
  }
}
