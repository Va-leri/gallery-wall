'use strict';

(function () {
  var patternsBlock = document.querySelector('.patterns');
  var patternButtons = patternsBlock.querySelectorAll('.pattern-button');
  var patternButtonPrefix = 'patternBtn';

  var galleryBlock = document.querySelector('.gallery-area');
  var currentPattern;

  var pattern1 = {
    id: 'pattern1',
    columnsQuantity: 4,
    picturesQuantity: 9,
    picturesInColumns: {
      1: 3,
      2: 2,
      3: 1,
      4: 3,
    },
    picturesToImageSize: {
      1: 'medium',
      2: 'extra-small',
      3: 'small',
      4: 'big',
      5: 'medium',
      6: 'extra-big',
      7: 'small',
      8: 'extra-small',
      9: 'big',
    },
    albumPictures: [1, 5, 9],
  };

  var pattern2 = {
    id: 'pattern2',
    columnsQuantity: 4,
    picturesQuantity: 7,
    picturesInColumns: {
      1: 3,
      2: 1,
      3: 2,
      4: 1,
    },
    picturesToImageSize: {
      1: 'extra-small',
      2: 'extra-small',
      3: 'small',
      4: 'extra-big',
      5: 'medium',
      6: 'medium',
      7: 'small',
    },
    albumPictures: [],
  };

  var pattern3 = {
    id: 'pattern3',
    columnsQuantity: 3,
    picturesQuantity: 5,
    picturesInColumns: {
      1: 1,
      2: 2,
      3: 2,
    },
    picturesToImageSize: {
      1: 'medium',
      2: 'small',
      3: 'small',
      4: 'extra-small',
      5: 'extra-small',
    },
    albumPictures: [],
  }

  var patterns = {
    1: pattern1,
    2: pattern2,
    3: pattern3,
  };

  var renderPattern = function (patternNumber) {
    var fragment = document.createDocumentFragment();
    var columnTemplate = document.querySelector('#column-template').content.querySelector('.column');
    var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');
    // Находим нужный паттерн в массиве patterns
    var pattern = patterns[patternNumber];
    // Определяем количество колонок в паттерне
    var columnsQuantity = pattern.columnsQuantity;
    // Для каждой колонки создаем узел, добавляем ID и класс
    for (var i = 1; i <= columnsQuantity; i++) {
      var column = columnTemplate.cloneNode(true);
      column.classList.add('column--' + i);
      column.id = 'column' + i;
      // Определяем количество картин в колонке
      var picturesQuantity = pattern.picturesInColumns[i];
      // Для каждой картины создаем узел и вставляем его в узел колонки
      for (var j = 1; j <= picturesQuantity; j++) {
        var picture = pictureTemplate.cloneNode(true);
        column.appendChild(picture);
      }
      // Добавляем каждую колонку во фрагмент
      fragment.appendChild(column);
    }
    //  Находим все картины во фрагменте
    var pictures = fragment.querySelectorAll('.picture');
    // Для каждой картины и инпута добаляем ID
    pictures.forEach(function (picture, index) {
      var pictureNumber = index + 1;
      // var pictureNumberBlock = picture.querySelector('.picture-number');
      // pictureNumberBlock.insertAdjacentText('afterbegin', pictureNumber);

      picture.id = 'picture' + pictureNumber;
      var input = picture.querySelector('input');
      var inputID = 'input' + pictureNumber;
      input.id = inputID;
      var image = picture.querySelector('.image');
      image.htmlFor = inputID;
      var overflowBlock = picture.querySelector('.overflow');
      var pictureNumberBlock = overflowBlock.querySelector('.picture-number');
      pictureNumberBlock.insertAdjacentText('afterbegin', pictureNumber);
      // Определяем, какого размера должна быть картина в соответствии с шаблоном
      var imageSize = pattern.picturesToImageSize[pictureNumber];
      // Добавляем соответствующий класс изображению
      image.classList.add('image--' + imageSize);
      // Если картина д.б. в альбомной ориентации, добавляем ей соответствующий класс
      if (pattern.albumPictures.includes(pictureNumber)) {
        image.classList.add('image--album');
        var width = image.height;
        var height = image.width;
        image.style.width = width + 'px';
        image.style.height = height + 'px';
      }
    })
    // Удаляем разметку прошлых паттернов
    galleryBlock.innerHTML = '';
    // Добавляем разметку выбранного паттерна
    galleryBlock.appendChild(fragment);
  };


  var onPatternButtonClick = function (evt) {
    var activeBtn = patternsBlock.querySelector('.pattern-button--active');
    if (activeBtn) {
      activeBtn.classList.remove('pattern-button--active');
      activeBtn.removeAttribute('disabled');
    }
    var currentBtn = evt.currentTarget;
    currentBtn.classList.add('pattern-button--active');
    currentBtn.setAttribute('disabled', 'disabled');
    var patternNumber = currentBtn.id.slice(patternButtonPrefix.length);
    window.pattern.currentPattern = patterns[patternNumber];
    console.log('currentPattern', window.pattern.currentPattern);
    renderPattern(patternNumber);
    window.rulers.render(evt);
    window.rulers.setHandlers();
    window.pictures.setSizes();
    // window.pictures.setPictureNumberSize();
    window.script.renderRulers();
  }

  patternButtons.forEach(function (patternButton) {
    patternButton.addEventListener('click', onPatternButtonClick, { passive: true });
  })


  window.pattern = {
    patterns: patterns,
    currentPattern: currentPattern,
  }
})();
