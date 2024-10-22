`use strict`;

document.addEventListener(`DOMContentLoaded`, () => {
  /** click on search button  */
  const tlSearch = gsap
    .timeline({ paused: true })
    .fromTo(
      `.search__input`,
      { x: `100`, scaleX: 0, opacity: 0 },
      { display: `block`, x: 0, scaleX: 1, opacity: 1, duration: 0.25 }
    )
    .to(
      `.search__open-btn`,
      { display: `none`, opacity: 0, duration: 0.25 },
      `<`
    )
    .to(
      `.search__close-btn`,
      { display: `block`, opacity: 1, duration: 0.25 },
      `<`
    );

  document.querySelector(`.js-open-search`).onclick = () => tlSearch.play();
  document.querySelector(`.js-close-search`).onclick = () => tlSearch.reverse();

  /** click on burger button */
  let mm = gsap.matchMedia();

  mm.add("(max-width: 576px)", () => {
    const navElem = document.querySelector(`.nav`);
    const navListElem = document.querySelector(`.nav__list`);
    const navItemsElem = document.querySelectorAll(`.nav__item`);

    const tlMenu = gsap
      .timeline({
        paused: true,
        onStart: () => {
          navElem.classList.add(`nav-open`);
          navListElem.classList.add(`nav-open__list`);
          navItemsElem.forEach((elem) => elem.classList.add(`nav-open__item`));
        },
        onReverseComplete: () => {
          navElem.classList.remove(`nav-open`);
          navListElem.classList.remove(`nav-open__list`);
          navItemsElem.forEach((elem) =>
            elem.classList.remove(`nav-open__item`)
          );
        },
      })
      .to(`.nav__burger-btn`, { visibility: `hidden` })
      .fromTo(
        `.nav__list`,
        { y: `-50%`, scaleY: 0 },
        { y: 0, scaleY: 1, duration: 0.25 },
        `<`
      )
      .fromTo(
        `.nav__close-btn`,
        { opacity: 0 },
        { display: `block`, opacity: 1, duration: 0.25 }
      )
      .fromTo(
        `.nav__item`,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
        `<`
      );

    document.querySelector(`.js-open-menu`).onclick = () => tlMenu.play();
    document.querySelector(`.js-close-menu`).onclick = () => tlMenu.reverse();
    document
      .querySelectorAll(`.nav__link`)
      .forEach((elem) => (elem.onclick = () => tlMenu.reverse()));
  });

  /** click on close button on map  */
  const tlMap = gsap
    .timeline({ paused: true })
    .to(`.contacts__map-cover`, { display: `none`, opacity: 0, duration: 0.5 })
    .to(`.contacts__content`, { y: `89%`, duration: 0.5 }, `<`)
    .to(`.contacts__wrap`, { opacity: 0, duration: 0.25 }, `<`)
    .to(`.js-close-contacts`, { display: `none`, opacity: 0, duration: 0.1 })
    .fromTo(
      `.js-open-contacts`,
      { opacity: 0 },
      { display: `block`, opacity: 1, duration: 0.1 },
      `<`
    );

  document.querySelector(`.js-close-contacts`).onclick = () => tlMap.play();
  document.querySelector(`.js-open-contacts`).onclick = () => tlMap.reverse();
});
