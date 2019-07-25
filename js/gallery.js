'use strict';

(function () {
  var photoAmount = 25;
  var avatarsAmount = 6;
  var Likes = {
    min: 15,
    max: 200
  };
  var photos = [];

  var commentatorNames = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];

  var commentOptions = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var generatePhoto = function () {
    for (var i = 1; i <= photoAmount; i++) {
      var photo = {};

      photo.url = 'photos/' + i + '.jpg';
      photo.likes = getRandom(Likes.min, Likes.max + 1);
      photo.comments = getComments(getRandom(1, commentOptions.length + 1));

      photos.push(photo);
    }
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

  generatePhoto();

  window.picture = photos;
})();
