import imagesGallery from './gallery-items.js';

const refs = {
  galleryListRef: document.querySelector('.js-gallery'),
  modalRef: document.querySelector('.js-lightbox'),
  buttonCLoseRef: document.querySelector(
    'button[data-action="close-lightbox"]',
  ),
  originalImage: document.querySelector('.lightbox__image'),
};

let originalImageUrl = '';
let currentIndex = 0;

// Создание и рендер разметки по массиву данных и предоставленному шаблону.

function getAdjacentHTMLfromArray(array) {
  let gallaryStringLayout = '';
  array.forEach(image => {
    gallaryStringLayout += `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${image.original}"
  >
    <img
      class="gallery__image"
      src="${image.preview}"
      data-source="${image.original}"
      alt="${image.description}"
      data-index="${currentIndex}"
    />
  </a>
</li>`;
    currentIndex += 1;
  });
  return gallaryStringLayout;
}

refs.galleryListRef.insertAdjacentHTML(
  'afterbegin',
  getAdjacentHTMLfromArray(imagesGallery),
);

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

refs.galleryListRef.addEventListener('click', onGalleryListClickHandler);

function onGalleryListClickHandler(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') return;
  modalOpen();
  originalImageUrl = event.target.dataset.source;
  setImageSrc(originalImageUrl);
  currentIndex = Number(event.target.dataset.index);
}

// Открытие модального окна по клику на элементе галереи.
function modalOpen() {
  refs.modalRef.classList.add('is-open');
}
// Подмена значения атрибута src элемента img.lightbox__image.
function setImageSrc(url) {
  refs.originalImage.setAttribute('src', url);
}

// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Закрытие модального окна по клику на div.lightbox__overlay.

refs.modalRef.addEventListener('click', onModalClickHandler);

function onModalClickHandler(event) {
  if (event.target === refs.originalImage) return;
  modalClose();
}

function modalClose() {
  refs.modalRef.classList.remove('is-open');
  clearImageSrc();
}
// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того,
// чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
function clearImageSrc() {
  refs.originalImage.setAttribute('src', '');
}

// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

window.addEventListener('keydown', onKeyPressHandler);

function onKeyPressHandler(event) {
  const isModalOpen = refs.modalRef.classList.contains('is-open');
  const keyPressed = event.key;
  if (!isModalOpen) return;
  switch (keyPressed) {
    case 'Escape':
      modalClose();
      break;
    case 'ArrowRight':
      slideToNextImage();
      break;
    case 'ArrowLeft':
      slideToPrevImage();
      break;
  }
}

function slideToNextImage() {
  const nextImageUrl = imagesGallery[getIncrementedIndex()].original;
  clearImageSrc();
  setImageSrc(nextImageUrl);
}

function slideToPrevImage() {
  const prevImageUrl = imagesGallery[getDecrementedIndex()].original;
  setImageSrc(prevImageUrl);
}

function getIncrementedIndex() {
  currentIndex =
    currentIndex + 1 >= imagesGallery.length ? 0 : currentIndex + 1;
  return Number(currentIndex);
}

function getDecrementedIndex() {
  currentIndex =
    currentIndex - 1 < 0 ? imagesGallery.length - 1 : currentIndex - 1;
  return Number(currentIndex);
}
