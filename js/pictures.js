'use strict';

(function () {
  var picturesParameters = [];
  var images = [];
  var gallery = document.querySelector('.gallery-area');
  // window.script.inputBlocks = window.script.gallery.querySelectorAll('input');
  var pictures;


  window.pictures = {
    blocks: pictures,
    setSizes: function () {
      window.pictures.blocks = gallery.querySelectorAll('.picture');
      window.pictures.blocks.forEach(function (element, index) {
        // Сохраняем элементы image в соответствующий массив:
        images[index] = element.querySelector('.image');
        var image = images[index];
        // Сохраняем параметры картины
        var pictureParameters = {
          width: image.offsetWidth,
          height: image.offsetHeight,
        };
        // Смена ориентации на альбомную
        if (image.classList.contains('image--album')) {
          var width = pictureParameters.height;
          var height = pictureParameters.width;
          image.style.width = width + 'px';
          image.style.height = height + 'px';
        }
        var widthInSm = window.util.getSizeInSm(pictureParameters.width);
        var heightInSm = window.util.getSizeInSm(pictureParameters.height);
        var imageSizeBlock = image.querySelector('.image-size');
        imageSizeBlock.insertAdjacentText('afterbegin', widthInSm + ' x ' + heightInSm);
        picturesParameters[index] = pictureParameters;
      });
    },
  };
})();
