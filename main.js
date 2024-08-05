// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
async function getQuestions() {
  try {
    let myData = await fetch("html-questions.json");
    let myQuestions = await myData.json();
    let qCount = myQuestions.length;

    // Create Bullets + Set Questions Count
    createBullets(qCount);

    // Add Question Data
    addQuestionData(myQuestions[currentIndex], qCount);

    // Start Countdown
    countdown(15, qCount);
    // Click On Submit Button
    submitButton.addEventListener("click", () => {
      // Get Right Answer
      let theRightAnswer = myQuestions[currentIndex].right_answer;

      // Increase Index
      currentIndex++;

      // Check the Answer
      checkAnswer(theRightAnswer, qCount);

      // Remove Previous Question
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";

      // Add Question Data
      addQuestionData(myQuestions[currentIndex], qCount);

      // Handle Bullets Class
      handleBullets();

      // Start Countdown
      clearInterval(countdownInterval);
      countdown(15, qCount);

      // Show Results
      showResults(qCount);
    });
  } catch (reason) {
    console.log(reason);
  }
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.append(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Questions Title
    let questionTitle = document.createElement("h2");

    //Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Text To Heading
    questionTitle.append(questionText);

    //Append H2 To Quiz Area
    quizArea.append(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Checked
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.append(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.append(radioInput, theLabel);

      // Append All Divs To Aswers Area
      answersArea.append(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class = "good">Good</span>, ${rightAnswers} From ${count}.`;
    } else if (rightAnswers === count) {
      theResults = `<span class = "perfect">perfect</span>, All Answers Are Good.`;
    } else {
      theResults = `<span class = "bad">Bad</span>, ${rightAnswers} From ${count}.`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
