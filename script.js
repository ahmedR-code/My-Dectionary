// الكلمات والمصفوفة الأساسية
let words = JSON.parse(localStorage.getItem("words")) || [];

// العناصر الأساسية
const mainContent = document.getElementById("main-content");
const homeLink = document.getElementById("home-link");
const addWordLink = document.getElementById("add-word-link");
const reviewLink = document.getElementById("review-link");
const viewWordsLink = document.getElementById("view-words-link");

// اختيار كلمات المراجعة اليومية بناءً على التاريخ
function getDailyReviewWords() {
  const today = new Date().toISOString().split("T")[0];
  let reviewWords = JSON.parse(localStorage.getItem("dailyReviewWords")) || {};

  if (reviewWords.date !== today) {
    reviewWords = {
      date: today,
      words: words.sort(() => 0.5 - Math.random()).slice(0, 50),
    };
    localStorage.setItem("dailyReviewWords", JSON.stringify(reviewWords));
  }

  return reviewWords.words;
}

// الوظائف الأساسية
function renderHomePage() {
  const reviewWords = getDailyReviewWords();
  const today = new Date().toLocaleDateString();

  if (reviewWords.length === 0) {
    mainContent.innerHTML = "<h1>لا توجد كلمات في قائمة المراجعة.</h1>";
    return;
  }

  mainContent.innerHTML = `
    <div class="container">
      <h1>المراجعة اليومية (${today})</h1>
      <h2 class="word" id="word">${reviewWords[0].word}</h2>
      <button id="speak-word" class="speak-btn">🔊 </button>
      <p class="example" id="example">${reviewWords[0].example}</p>
      <button id="speak-example" class="speak-btn">🔊 </button>
      <button id="show-meaning-btn" class="meaning-btn">عرض المعنى بالعربي</button>
      <p class="meaning" style="display: none;" id="meaning">${reviewWords[0].meaning}</p>
      <div class="buttons">
        <button id="prev-btn">Previous</button>
        <button id="next-btn">Next</button>
      </div>
    </div>
  `;

  let currentIndex = 0;

  function updateContent() {
    const currentWord = reviewWords[currentIndex];
    document.getElementById("word").textContent = currentWord.word;
    document.getElementById("example").textContent = currentWord.example;
    document.getElementById("meaning").textContent = currentWord.meaning;
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + reviewWords.length) % reviewWords.length;
    updateContent();
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % reviewWords.length;
    updateContent();
  });

  document.getElementById("speak-word").addEventListener("click", () => {
    speak(reviewWords[currentIndex].word);
  });

  document.getElementById("speak-example").addEventListener("click", () => {
    speak(reviewWords[currentIndex].example);
  });

  document.getElementById("show-meaning-btn").addEventListener("click", () => {
    const meaningElement = document.getElementById("meaning");
    meaningElement.style.display = meaningElement.style.display === "none" ? "block" : "none";
  });
}

function renderAddWordPage() {
  mainContent.innerHTML = `
    <div class="container">
      <h1>Add a New Word</h1>
      <input id="new-word" placeholder="Enter word" style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
      <textarea id="new-example" placeholder="Enter example" style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;"></textarea>
      <input id="new-meaning" placeholder="Enter meaning in Arabic" style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
      <button id="add-word-btn">Add Word</button>
    </div>
  `;

  document.getElementById("add-word-btn").addEventListener("click", () => {
    const newWord = document.getElementById("new-word").value;
    const newExample = document.getElementById("new-example").value;
    const newMeaning = document.getElementById("new-meaning").value;
    if (newWord && newExample && newMeaning) {
      words.push({ word: newWord, example: newExample, meaning: newMeaning });
      localStorage.setItem("words", JSON.stringify(words));
      alert("Word added successfully!");
    } else {
      alert("Please fill in all fields.");
    }
  });
}

function renderViewWordsPage() {
  mainContent.innerHTML = `
    <div class="container">
      <h1>View Words</h1>
      <input id="search-bar" placeholder="Search words..." style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
      <table>
        <thead>
          <tr>
            <th>الكلمة</th>
            <th>النطق</th>
            <th>المثال</th>
            <th>النطق</th>
            <th>الترجمة</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody id="words-table">
          ${words
            .map(
              (w) => `
                <tr>
                  <td>${w.word}</td>
                  <td><button class="speak-btn small-btn" onclick="speak('${w.word}')">🔊</button></td>
                  <td>${w.example}</td>
                  <td><button class="speak-btn small-btn" onclick="speak('${w.example}')">🔊</button></td>
                  <td>${w.meaning}</td>
                  <td><button class="delete-btn" onclick="deleteWord('${w.word}')">حذف</button></td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("search-bar").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredWords = words.filter((w) =>
      w.word.toLowerCase().includes(searchTerm) ||
      w.example.toLowerCase().includes(searchTerm) ||
      w.meaning.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.getElementById("words-table");
    tableBody.innerHTML = filteredWords
      .map(
        (w) => `
          <tr>
            <td>${w.word}</td>
            <td><button class="speak-btn small-btn" onclick="speak('${w.word}')">🔊</button></td>
            <td>${w.example}</td>
            <td><button class="speak-btn small-btn" onclick="speak('${w.example}')">🔊</button></td>
            <td>${w.meaning}</td>
            <td><button class="delete-btn" onclick="deleteWord('${w.word}')">حذف</button></td>
          </tr>`
      )
      .join("");
  });
}

function renderReviewPage() {
  const reviewWords = getDailyReviewWords();
  const today = new Date().toLocaleDateString();

  mainContent.innerHTML = `
    <div class="container">
      <h1>مراجعة يومية (${today})</h1>
      <table>
        <thead>
          <tr>
            <th>الكلمة</th>
            <th>النطق</th>
            <th>المثال</th>
            <th>النطق</th>
            <th>الترجمة</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          ${reviewWords
            .map(
              (w) => `
                <tr>
                  <td>${w.word}</td>
                  <td><button class="speak-btn" onclick="speak('${w.word}')">🔊</button></td>
                  <td>${w.example}</td>
                  <td><button class="speak-btn" onclick="speak('${w.example}')">🔊</button></td>
                  <td>${w.meaning}</td>
                  <td><button class="delete-btn" onclick="deleteWord('${w.word}')">حذف</button></td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function deleteWord(word) {
  words = words.filter((w) => w.word !== word);
  localStorage.setItem("words", JSON.stringify(words));
  renderViewWordsPage();
}

homeLink.addEventListener("click", renderHomePage);
addWordLink.addEventListener("click", renderAddWordPage);
reviewLink.addEventListener("click", renderReviewPage);
viewWordsLink.addEventListener("click", renderViewWordsPage);

// عرض الصفحة الرئيسية عند التحميل
renderHomePage();
