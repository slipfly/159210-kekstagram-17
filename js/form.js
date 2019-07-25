'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // логика загрузки изображения

  var uploadButton = document.getElementById('upload-file');
  var photoEditForm = document.querySelector('.img-upload__overlay');
  var uploadCancelButton = photoEditForm.querySelector('.img-upload__cancel');

  var closeUpload = function () {
    uploadButton.value = '';
    photoEditForm.classList.add('hidden');
    clearEffect();
    clearScale();

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
    if (evt.keyCode === ESC_KEYCODE && !evt.target.classList.contains('text__description')) {
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

  var setScale = function (num) {
    var scaleNum = num || (scaleControlValue / Scale.max);
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

  var clearScale = function () {
    setScale(1);
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
  var effectLevelValue = photoEditForm.querySelector('.effect-level__value');

  var calculatePercents = function (pin, maxWidth) {
    return (pin.style.left.slice(0, -2)) / maxWidth;
  };

  var onSliderPinMouseUp = function () {
    calculatePercents(sliderPin, sliderLevelLineWidth);
  };

  var clearEffect = function () {
    photoPreview.classList.remove('effects__preview--' + currentEffect);
    photoPreview.style.filter = '';
    sliderEffectLevel.classList.add('visually-hidden');
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

      var depthValue = 1;

      var effects = {
        none: '',
        chrome: 'grayscale(' + depthValue + ')',
        sepia: 'sepia(' + depthValue + ')',
        marvin: 'invert(' + (depthValue * 100) + '%)',
        phobos: 'blur(' + (depthValue * 3) + 'px)',
        heat: 'brightness(' + (depthValue * 3) + ')'
      };

      sliderLevelDepth.style.width = sliderLevelLine.offsetWidth + 'px';
      sliderPin.style.left = sliderLevelLine.offsetWidth + 'px';


      photoPreview.classList.add('effects__preview--' + currentEffect);
      photoPreview.style.filter = effects[currentEffect];
    }
  };

  // обработчик слайдера

  var putEffect = function () {
    var depthValue = calculatePercents(sliderPin, sliderLevelLine.offsetWidth);

    currentEffect = photoEditForm.querySelector('input:checked').value;

    var effects = {
      none: '',
      chrome: 'grayscale(' + depthValue + ')',
      sepia: 'sepia(' + depthValue + ')',
      marvin: 'invert(' + (depthValue * 100) + '%)',
      phobos: 'blur(' + (depthValue * 3) + 'px)',
      heat: 'brightness(' + (depthValue * 3) + ')'
    };

    photoPreview.style.filter = effects[currentEffect];
    effectLevelValue.value = Math.round(depthValue * 100);
  };

  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoordX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoordX - moveEvt.clientX;

      startCoordX = moveEvt.clientX;

      var newCoordX = sliderPin.offsetLeft - shift;

      if (newCoordX > 0 && newCoordX < sliderLevelLine.offsetWidth) {
        sliderPin.style.left = newCoordX + 'px';
        sliderLevelDepth.style.width = newCoordX + 'px';
      }

      putEffect();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      putEffect();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
