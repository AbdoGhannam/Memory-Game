const colors = [
  "#C7FFD8",
  "#FF1F5A",
  "#D0A2F7",
  "#45FFCA",
  "#D0E8F2",
  "#F9FF21",
  "#FF8A8A",
  "#A5DD9B",
  "#F7418F",
];

let colorNum = 0;
let zeroOne = 0;

const timeBar = document.querySelector(".timer");

function showResult(result, gameDifficulty, GAME_DATA) {
  const div = document.createElement("div");
  div.classList.add("result-screen");
  div.innerHTML = `
  <h1>YOU ${result}</h1>
  <button class="start-again">Start again</button>
  <button class="main-menu">Main menu</button>
  `;

  document.querySelector("body").appendChild(div);
  document.querySelector(".app").remove();

  const restartBtn = document.querySelector(".start-again");
  const mainBtn = document.querySelector(".main-menu");

  restartBtn.addEventListener("click", (e) => {
    document.querySelector(".result-screen").remove();
    timeBar.style.setProperty("--width", 0);
    startGame(gameDifficulty, GAME_DATA);
  });

  mainBtn.addEventListener("click", () => {
    document.querySelector(".result-screen").remove();

    const landingPage = document.querySelector(".landing-page-container");

    timeBar.style.setProperty("--width", 0);
    landingPage.style.transform = "translateY(0px)";
    landingPage.style.opacity = "1";
  });
}

function startGame(gameDifficulty, GAME_DATA) {
  let doneCards = 2;

  const appContainer = document.createElement("main");
  appContainer.classList.add("app");
  appContainer.style.gridTemplateColumns = GAME_DATA.difficulty[gameDifficulty];
  document.querySelector("body").appendChild(appContainer);
  appContainer.style.opacity = 0;

  setTimeout(() => {
    appContainer.style.translate = "50% -50%";
    appContainer.style.opacity = 1;
  }, 1000);

  const Timer = setInterval(() => {
    const width = +getComputedStyle(timeBar).getPropertyValue("--width");
    if (width >= 100) {
      clearInterval(Timer);
      clearInterval(colorChange);
      clearInterval(borderBlur);
      showResult("LOST 😢", gameDifficulty, GAME_DATA);
      return;
    }
    timeBar.style.setProperty(
      "--width",
      width + GAME_DATA.difficulty[gameDifficulty].widthRate
    );
  }, 5);

  const colorChange = setInterval(() => {
    timeBar.style.backgroundColor = colors[colorNum];
    colorNum = (colorNum + 1) % colors.length;
  }, 2000);

  const borderBlur = setInterval(() => {
    appContainer.style.borderColor = `rgba(255, 255, 255, ${zeroOne})`;
    zeroOne = (zeroOne + 1) % 2;
  }, 2500);

  let columns = "";
  for (let i = 1; i <= GAME_DATA.difficulty[gameDifficulty].cardsNum / 4; i++) {
    columns += "1fr ";
  }
  appContainer.style.gridTemplateColumns = columns;

  let cardChecking = false;

  function createAndCheckRandom() {
    const random =
      Math.floor(Math.random() * GAME_DATA.difficulty[gameDifficulty].imgsNum) +
      1;

    const allImgs = [...document.querySelectorAll(`#img-${random}`)];
    const imgsNumLimit = gameDifficulty == "hard" ? 4 : 2;
    if (allImgs.length == imgsNumLimit) return createAndCheckRandom();

    return random;
  }

  for (let i = 1; i <= GAME_DATA.difficulty[gameDifficulty].cardsNum; i++) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("flip-card");

    // Random number between 1 and 8
    const randomNum = createAndCheckRandom();
    cardContainer.id = randomNum;

    cardContainer.innerHTML = `
    <div class="flip-card-inner">
    <div class="flip-card-front">
    <img src="images/cover--icon.png" id=${randomNum}/>
    </div>
    <div class="flip-card-back">
    <img src="images/main-icons/${GAME_DATA.ImgsCategories}/icon-${randomNum}.png" id='img-${randomNum}'/>
    </div>
    </div>  
    `;

    appContainer.append(cardContainer);
  }

  const flipCards = document.querySelectorAll(".flip-card");

  if ([...flipCards].every((card) => card.classList.contains("done"))) {
    console.log("allll");
    showResult("WON 😊", gameDifficulty, GAME_DATA);
    clearInterval(Timer);
    clearInterval(colorChange);
    clearInterval(borderBlur);
    return;
  }

  flipCards.forEach((card) => {
    const innerCard = card.querySelector(".flip-card-inner");

    card.addEventListener("click", (e) => {
      if (cardChecking) return;
      if (card.classList.contains("done")) return;

      const flippedCard = document.querySelector(".flipped");

      if (flippedCard == card) return;

      if (!flippedCard) {
        innerCard.style.transform = "rotateY(180deg)";
        card.classList.add("flipped");
      } else {
        innerCard.style.transform = "rotateY(180deg)";

        cardChecking = true;
        setTimeout(() => {
          if (flippedCard.id == card.id) {
            card.style.opacity = "0";
            flippedCard.style.opacity = "0";

            card.classList.add("done");
            flippedCard.classList.add("done");

            card.style.cursor = "auto";
            flippedCard.style.cursor = "auto";

            cardChecking = false;
            if (doneCards == GAME_DATA.difficulty[gameDifficulty].cardsNum) {
              showResult("WON 😊", gameDifficulty, GAME_DATA);
              clearInterval(Timer);
              clearInterval(colorChange);
              clearInterval(borderBlur);
              return;
            } else {
              doneCards += 2;
              return;
            }
          }

          innerCard.style.transform = "rotateY(0deg)";
          flippedCard.querySelector(".flip-card-inner").style.transform =
            "rotateY(0deg)";
          cardChecking = false;
        }, 1000);

        flippedCard.classList.remove("flipped");
      }
    });
  });
}

export { startGame };
