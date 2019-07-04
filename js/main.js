'use strict';

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

var ESC_KEYCODE = 27;

var uploadButton = document.getElementById('upload-file');
var photoEditForm = document.querySelector('.img-upload__overlay');
var uploadCancelButton = photoEditForm.querySelector('.img-upload__cancel');

var closeUpload = function () {
  uploadButton.value = '';
  photoEditForm.classList.add('hidden');

  document.removeEventListener('keydown', onUploadEscPress);
  uploadCancelButton.removeEventListener('click', onCancelClick);
  scaleSmallerButton.removeEventListener('click', onScaleSmallerClick);
  scaleBiggerButton.removeEventListener('click', onScaleBiggerClick);
  sliderPin.removeEventListener('mouseup', onSliderPinMouseUp);
  effectList.removeEventListener('mouseup', onEffectListMouseup);
  uploadButton.addEventListener('change', onUploadChange);
};

var openUpload = function () {
  photoEditForm.classList.remove('hidden');

  document.addEventListener('keydown', onUploadEscPress);
  uploadCancelButton.addEventListener('click', onCancelClick);
  scaleSmallerButton.addEventListener('click', onScaleSmallerClick);
  scaleBiggerButton.addEventListener('click', onScaleBiggerClick);
  sliderPin.addEventListener('mouseup', onSliderPinMouseUp);
  effectList.addEventListener('mouseup', onEffectListMouseup);
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

var scaleSmallerButton = photoEditForm.querySelector('.scale__control--smaller');
var scaleBiggerButton = photoEditForm.querySelector('.scale__control--bigger');
var scaleControlValueContainer = photoEditForm.querySelector('.scale__control--value');
var scaleControlValue = parseInt(scaleControlValueContainer.value.slice(0, -1), 10);
var photoUploadPreview = photoEditForm.querySelector('.img-upload__preview img');

var setScale = function () {
  var scaleNum = scaleControlValue / 100;
  photoUploadPreview.style.transform = 'scale(' + scaleNum + ')';
};

var onScaleSmallerClick = function () {
  if ((scaleControlValue - 25) < 0) {
    scaleControlValue = 0;
  } else {
    scaleControlValue = scaleControlValue - 25;
  }

  setScale();
  scaleControlValueContainer.value = scaleControlValue + '%';
};

var onScaleBiggerClick = function () {
  if ((scaleControlValue + 25) > 100) {
    scaleControlValue = 100;
  } else {
    scaleControlValue = scaleControlValue + 25;
  }

  setScale();
  scaleControlValueContainer.value = scaleControlValue + '%';
};

// фотофильтры

var sliderPin = photoEditForm.querySelector('.effect-level__pin');
var sliderLevelLine = photoEditForm.querySelector('.effect-level__line');
var sliderLevelDepth = photoEditForm.querySelector('.effect-level__depth');
var effectList = photoEditForm.querySelector('.effects__list');
var photoPreview = document.querySelector('.img-upload__preview');
var sliderLevelLineWidth = sliderLevelLine.offsetWidth;

var calculatePercents = function (pin, maxWidth) {
  return (pin.style.left.slice(0, -2)) / maxWidth;
};

var onSliderPinMouseUp = function () {
  calculatePercents(sliderPin, sliderLevelLineWidth);
};

var onEffectListMouseup = function (evt) {
  if (evt.target.classList.contains('effects__preview')) {
    var nameOfClass = evt.target.parentNode.getAttribute('for');
    var effectName = 'effects__preview--' + nameOfClass.slice(7);
    var depthValue = calculatePercents(sliderPin, sliderLevelLineWidth);

    photoPreview.style.filter = '';
    sliderLevelDepth.style.width = '91px';
    sliderPin.style.left = '91px';
    photoPreview.className = '';
    photoPreview.classList.add('img-upload__preview');
    photoPreview.classList.add(effectName);

    if (photoPreview.className === 'img-upload__preview effects__preview--chrome') {
      photoPreview.style.filter = 'grayscale(' + depthValue + ')';
    }	else if (photoPreview.className === 'img-upload__preview effects__preview--sepia')	{
      photoPreview.style.filter = 'sepia(' + depthValue + ')';
    } else if (photoPreview.className === 'img-upload__preview effects__preview--marvin')	{
      photoPreview.style.filter = 'invert(' + (depthValue * 100) + '%)';
    } else if (photoPreview.className === 'img-upload__preview effects__preview--phobos')	{
      photoPreview.style.filter = 'blur(' + (depthValue * 3) + 'px)';
    } else if (photoPreview.className === 'img-upload__preview effects__preview--heat')	{
      photoPreview.style.filter = 'brightness(' + (depthValue * 3) + ')';
    } else {
      photoPreview.style.filter = '';
    }
  }
};


