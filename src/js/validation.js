`use strict`;

/**
 * Устанавливает стили ошибки для поля input
 * @param {object} input элемент формы
 */
const inputErrorActive = (input) => {
  input.setAttribute("style", "outline: 1px solid #ff3030;");
  input.nextElementSibling.setAttribute("style", "visibility: visible;");
};

/**
 * Удаляет стили ошибки для поля input
 * @param {object} input элемент формы
 */
const inputErrorDisable = (input) => {
  input.removeAttribute("style");
  input.nextElementSibling.removeAttribute("style");
};

document.addEventListener(`DOMContentLoaded`, () => {
  const formArr = document.querySelectorAll(".js-form");

  formArr.forEach((form) => {
    form.querySelectorAll(".input").forEach((input) => {
      input.addEventListener("input", () => inputErrorDisable(input));
      input.addEventListener("focus", () => inputErrorDisable(input));
    });

    form.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      let isValid = true;

      form.querySelectorAll(".input").forEach((input) => {
        if (!new RegExp(input.pattern).test(input.value)) {
          isValid = false;
          inputErrorActive(input);
        }
      });

      if (isValid) {
        const formData = new FormData(form);
        let response = await fetch(`../phpmailer/sendmail.php`, {
          method: `POST`,
          body: formData,
        });

        if (response?.ok) {
          const result = await response.json();

          alert(result.message);
          evt.target.reset();
        } else {
          alert("Ошибка HTTP: " + response.status);
        }
      }
    });
  });
});
