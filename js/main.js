'use strict';

var ESC_KEYCODE = 27;

var photos = [];

var photoAmount = 25;
var minLikes = 15;
var maxLikes = 200;
var avatarsAmount = 6;

var commentOptions = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var commentatorNames = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];

var photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var fragment = document.createDocumentFragment();

var picturesBlock = document.querySelector('.pictures');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getComments = function (amount) {
  var comments = [];
  for (var i = 0; i < amount; i++) {
    var comment = {};

    comment.avatar = 'img/avatar-' + getRandom(1, avatarsAmount + 1) + '.svg';
    comment.message = commentOptions[getRandom(0, commentOptions.length)];
    comment.name = commentatorNames[getRandom(0, commentatorNames.length)];

    comments.push(comment);
  }

  return comments;
};

var generatePhoto = function () {
  for (var i = 1; i <= photoAmount; i++) {
    var photo = {};

    photo.url = 'photos/' + i + '.jpg';
    photo.likes = getRandom(minLikes, maxLikes + 1);
    photo.comments = getComments(getRandom(1, commentOptions.length + 1));

    photos.push(photo);
  }
};

var makePhotoElement = function (picture) {
  var pictureElement = photoTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture__likes').innerText = picture.likes;
  pictureElement.querySelector('.picture__comments').innerText = picture.comments.length;

  return pictureElement;
};

var getPhotoStack = function () {
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(makePhotoElement(photos[i]));
  }

  picturesBlock.appendChild(fragment);
};

generatePhoto();
getPhotoStack();

// логика загрузки изображения

var uploadButton = document.getElementById('upload-file');
var photoEditForm = document.querySelector('.img-upload__overlay');
var uploadCancelButton = photoEditForm.querySelector('.img-upload__cancel');

var closeUpload = function () {
  uploadButton.value = '';
  photoEditForm.classList.add('hidden');
  clearEffect();

  document.removeEventListener('keydown', onUploadEscPress);
  uploadCancelButton.removeEventListener('click', onCancelClick);
  scaleSmallerButton.removeEventListener('click', onScaleSmallerClick);
  scaleBiggerButton.removeEventListener('click', onScaleBiggerClick);
  sliderPin.removeEventListener('mouseup', onSliderPinMouseUp);
  effectList.removeEventListener('click', onEffectListClick);
  uploadButton.addEventListener('change', onUploadChange);
};

var openUpload = function () {
  photoEditForm.classList.remove('hidden');

  document.addEventListener('keydown', onUploadEscPress);
  uploadCancelButton.addEventListener('click', onCancelClick);
  scaleSmallerButton.addEventListener('click', onScaleSmallerClick);
  scaleBiggerButton.addEventListener('click', onScaleBiggerClick);
  sliderPin.addEventListener('mouseup', onSliderPinMouseUp);
  effectList.addEventListener('click', onEffectListClick);
  uploadButton.removeEventListener('change', onUploadChange);
};

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUpload();
  }
};

var onCancelClick = function () {
  closeUpload();
};

var onUploadChange = function () {
  openUpload();
};

uploadButton.addEventListener('change', onUploadChange);

// изменение масштаба фото

var Scale = {
  min: 25,
  max: 100
};

var scaleSmallerButton = photoEditForm.querySelector('.scale__control--smaller');
var scaleBiggerButton = photoEditForm.querySelector('.scale__control--bigger');
var scaleControlValueContainer = photoEditForm.querySelector('.scale__control--value');
var scaleControlValue = parseInt(scaleControlValueContainer.value, 10);
var photoUploadPreview = photoEditForm.querySelector('.img-upload__preview');

var setScale = function () {
  var scaleNum = scaleControlValue / Scale.max;
  photoUploadPreview.style.transform = 'scale(' + scaleNum + ')';
};

var onScaleSmallerClick = function () {
  scaleControlValue = ((scaleControlValue - Scale.min) < Scale.min) ? Scale.min : (scaleControlValue - Scale.min);

  setScale();
  scaleControlValueContainer.value = scaleControlValue + '%';
};

var onScaleBiggerClick = function () {
  scaleControlValue = ((scaleControlValue + Scale.min) > Scale.max) ? Scale.max : (scaleControlValue + Scale.min);

  setScale();
  scaleControlValueContainer.value = scaleControlValue + '%';
};

// фотофильтры


var sliderEffectLevel = photoEditForm.querySelector('.effect-level');
var sliderPin = photoEditForm.querySelector('.effect-level__pin');
var sliderLevelLine = photoEditForm.querySelector('.effect-level__line');
var sliderLevelDepth = photoEditForm.querySelector('.effect-level__depth');
var effectList = photoEditForm.querySelector('.effects__list');
var photoPreview = document.querySelector('.img-upload__preview');
var sliderLevelLineWidth = sliderLevelLine.offsetWidth;
var currentEffect = 'none';

var calculatePercents = function (pin, maxWidth) {
  return (pin.style.left.slice(0, -2)) / maxWidth;
};

var onSliderPinMouseUp = function () {
  calculatePercents(sliderPin, sliderLevelLineWidth);
};

var clearEffect = function () {
  photoPreview.classList.remove('effects__preview--' + currentEffect);
  photoPreview.style.filter = '';
};

var onEffectListClick = function (evt) {
  if (evt.target.classList.contains('effects__preview')) {

    clearEffect();

    currentEffect = evt.target.parentElement.parentElement.children[0].value;
    if (currentEffect === 'none') {
      sliderEffectLevel.classList.add('visually-hidden');
    } else {
      sliderEffectLevel.classList.remove('visually-hidden');
    }

    var depthValue = calculatePercents(sliderPin, sliderLevelLineWidth);

    var effects = {
      none: '',
      chrome: 'grayscale(' + depthValue + ')',
      sepia: 'sepia(' + depthValue + ')',
      marvin: 'invert(' + (depthValue * 100) + '%)',
      phobos: 'blur(' + (depthValue * 3) + 'px)',
      heat: 'brightness(' + (depthValue * 3) + ')'
    };

    sliderLevelDepth.style.width = '91px';
    sliderPin.style.left = '91px';


    photoPreview.classList.add('effects__preview--' + currentEffect);
    photoPreview.style.filter = effects[currentEffect];
  }
};


