import { startGame } from "./startGameModule.js";

const GAME_DATA = {
  difficulty: {
    easy: {
      cardsNum: 16,
      imgsNum: 8,
      widthRate: 0.009,
    },
    normal: {
      cardsNum: 32,
      imgsNum: 16,
      widthRate: 0.0045,
    },
    hard: {
      cardsNum: 48,
      imgsNum: 12,
      widthRate: 0.003,
    },
  },
  ImgsCategories: "coding",
};

const labels = document.querySelectorAll(".difficulty-label");
const radioInputs = document.getElementsByName("difficulty");
const startBtn = document.querySelector(".start-btn");
const landingPage = document.querySelector(".landing-page-container");

labels.forEach((label) => {
  label.addEventListener("click", (e) => {
    label.previousElementSibling.checked = true;

    radioInputs.forEach((radio) => {
      const radioLabel = document.querySelector(`.${radio.id}`);

      radioLabel.style.transform = `translateX(${radio.checked ? 30 : 0}px)`;
      radioLabel.style.opacity = radio.checked ? 1 : 0.6;
    });
  });
});

const categoriesImgs = document
  .querySelector(".imgs-categories")
  .querySelectorAll("img");

categoriesImgs.forEach((img) => {
  img.addEventListener("click", () => {
    img.classList.add("choosen");
    img.style.transform = "translateY(-40px)";

    categoriesImgs.forEach((notClickedImg) => {
      if (img.src != notClickedImg.src) {
        notClickedImg.classList.remove("choosen");
        notClickedImg.style.transform = "translateY(0px)";
      }
    });
  });

  img.addEventListener("mouseover", () => {
    if (img.classList.contains("choosen")) return;

    img.style.transform = "translateY(-15px)";
  });

  img.addEventListener("mouseout", () => {
    if (img.classList.contains("choosen")) return;

    img.style.transform = "translateY(0px)";
  });
});

startBtn.addEventListener("click", () => {
  GAME_DATA.ImgsCategories = document.querySelector(".choosen").id;
  const gameDifficulty = [...radioInputs].filter((inp) => inp.checked)[0].id;

  landingPage.style.transform = "translateY(-20px)";
  landingPage.style.opacity = "0";

  startGame(gameDifficulty, GAME_DATA);
});

window.addEventListener("load", () => {
  document.querySelector(".preloader").style.display = "none";
});
