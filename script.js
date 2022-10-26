const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.querySelector("#typeDisplay");
const typeInput = document.querySelector("#typeInput");
const timer = document.querySelector("#timer");
const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// inputテキスト入力が合っているかどうかの判定
typeInput.addEventListener("input", () => {
  //タイピング音をつける
  typeSound.volume = 0.3;
  typeSound.play();
  typeSound.currentTime = 0;

  //inputされるたびに関数を実行
  const sentenceArray = typeDisplay.querySelectorAll("span"); //spanタグの文字をすべて取得
  const arrayValue = typeInput.value.split(""); //テキストボックスの中身を取得し分解

  let correct = true;

  sentenceArray.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      //inputに文字が入力されていなければ
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false; //間違えるとfalseになる
    } else if (characterSpan.innerText == arrayValue[index]) {
      //spanタグの中身とテキストボックスの中身が同じならば
      characterSpan.classList.add("correct"); // correctクラスを追加
      characterSpan.classList.remove("incorrect"); // correctクラスを追加
    } else {
      //タイピングミスした場合
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      wrongSound.volume = 0.1;
      wrongSound.play();
      wrongSound.currentTime = 0;
      correct = false;
    }
  });

  //　正解すると次のテキストへ
  if (correct == true) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

// 非同期でランダムな文章を取得する
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// ランダムな文章を取得して、表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplay.innerText = "";

  //文章を1文字ずつ分解して、spanタグを生成する
  let oneText = sentence.split(""); //1文字ずつ分解
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span"); //文字数の数だけspanタグを生成
    characterSpan.innerText = character; //生成したspanタグの中に文字を入れる
    // console.log(characterSpan);
    typeDisplay.appendChild(characterSpan); //typeDisplay要素の子要素にspanタグを生成する
  });

  //テキストボックスの中身を消す
  typeInput.value = "";

  StartTimer();
}

let startTime;
let originTime = 60;

function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = originTime - getTimerTIme();
    if (timer.innerText <= 0) timeUp();
  }, 1000);
}

function getTimerTIme() {
  return Math.floor((new Date() - startTime) / 1000);
}

function timeUp() {
  RenderNextSentence();
}

RenderNextSentence();
