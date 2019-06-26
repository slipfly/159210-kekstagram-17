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
