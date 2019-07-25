'use strict';

(function () {
  var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var fragment = document.createDocumentFragment();

  var picturesBlock = document.querySelector('.pictures');

  var makePhotoElement = function (picture) {
    var pictureElement = photoTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').setAttribute('src', picture.url);
    pictureElement.querySelector('.picture__likes').innerText = picture.likes;
    pictureElement.querySelector('.picture__comments').innerText = picture.comments.length;

    return pictureElement;
  };

  var getPhotoStack = function () {
    for (var i = 0; i < window.picture.length; i++) {
      fragment.appendChild(makePhotoElement(window.picture[i]));
    }

    picturesBlock.appendChild(fragment);
  };

  getPhotoStack();
})();
