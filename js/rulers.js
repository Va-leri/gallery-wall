'use strict';

(function () {
  var rulersBlock = document.querySelector('.rulers');
  var rulers = {};
  var commonRulersBlock = rulersBlock.querySelector('.rulers__common');
  var commonFrameRuler = commonRulersBlock.querySelector('#frames');
  var pictureRulersBlock = rulersBlock.querySelector('.rulers__picture');
  var frameColor;
  var allRulers = [];
  var commonRulers = {};

  var PICTURE_PARAMETERS = [
    'frame',
    'frameColor',
    'passePartout',
  ];

  var pictureParametersToLabelsClass = {
    frame: 'frame',
    frameColor: 'frame-color',
    passePartout: 'passe-partout',
  };

  var pictureRulerIDPrefix = 'picture-ruler';
  var frameIDPrefix = 'frame';
  var pictureIDPrefix = 'picture';
  var frameColorIDPrefix = 'frame-color';
  var passepartoutIDPrefix = 'passe-partout';

  var setPassePartoutSize = function (image) {
    var verticalSize = image.offsetHeight * 0.25 + 'px';
    var horizontalSize = image.offsetWidth * 0.25 + 'px';;

    image.style['border-top-width'] = verticalSize;
    image.style['border-bottom-width'] = verticalSize;
    image.style['border-left-width'] = horizontalSize;
    image.style['border-right-width'] = horizontalSize;
  }

  var onPictureParameterChange = {
    frame: function (evt) {
      var frameRuler = evt.target;
      var pictureNumber = frameRuler.id.slice(frameIDPrefix.length);
      // Находим соответствующий рулер цвета рамки
      var frameColorRuler = allRulers[pictureNumber - 1].frameColor;

      // Определяем ID картины, соответствующей чекбоксу:
      var pictureID = pictureIDPrefix + pictureNumber;
      var picture = window.script.gallery.querySelector('#' + pictureID);
      var column = window.script.picturesToColumns[picture.id];
      if (picture.classList.contains('frame')) {
        picture.classList.remove('frame');
        frameColorRuler.classList.add('hidden');
        // FRAME_WIDTH = 0;
      } else {
        picture.classList.add('frame');
        frameColorRuler.classList.remove('hidden');
        // FRAME_WIDTH = 10;
      };
      window.script.setColumnWidth(column);
      window.script.setGallerySize();
    },
    frameColor: function (evt) {
      var frameColorRuler = evt.target;
      // Определяем ID картины, соответствующей чекбоксу:
      var pictureID = pictureIDPrefix + frameColorRuler.id.slice(frameColorIDPrefix.length);
      var picture = window.script.gallery.querySelector('#' + pictureID);
      picture.style['border-color'] = frameColorRuler.value;
    },
    passePartout: function (evt) {
      var passepartoutRuler = evt.target;
      // Определяем ID картины, соответствующей чекбоксу:
      var pictureID = pictureIDPrefix + passepartoutRuler.id.slice(passepartoutIDPrefix.length);
      var picture = window.script.gallery.querySelector('#' + pictureID);
      var image = picture.querySelector('.image');
      image.classList.contains('passe-partout') ? image.classList.remove('passe-partout') : image.classList.add('passe-partout');
      setPassePartoutSize(image);
    },
  };

  var onCommonRulerChange = {
    frame: function (evt) {
      var pictures = window.pictures.blocks;
      var frameRulers = rulers['frame'];
      var framesColorRuler = commonRulers['frameColor'];
      var frameColorRulers = rulers['frameColor'];
      if (evt.target.checked) {
        framesColorRuler.parentNode.classList.remove('hidden');
        pictures.forEach(function (picture) {
          picture.classList.add('frame');
        });
        frameRulers.forEach(function (ruler, index) {
          ruler.checked = true;
          frameColorRulers[index].parentNode.classList.remove('hidden');
        });
      } else {
        framesColorRuler.parentNode.classList.add('hidden');
        pictures.forEach(function (picture) {
          picture.classList.remove('frame');
        });
        frameRulers.forEach(function (ruler, index) {
          ruler.checked = false;
          frameColorRulers[index].parentNode.classList.add('hidden');

        });
      };

      window.script.columns.forEach(function (column) {
        window.script.setColumnWidth(column);
        window.script.setGallerySize();
      });
    },
    frameColor: function (evt) {
      var pictures = window.pictures.blocks;
      pictures.forEach(function (picture) {
        picture.style['border-color'] = evt.target.value;
      });
      var frameColorRulers = rulers['frameColor'];
      frameColorRulers.forEach(function (ruler) {
        ruler.value = evt.target.value;
      })
    },
    passePartout: function (evt) {
      var pictures = window.pictures.blocks;
      var passePartoutRulers = rulers['passePartout'];
      pictures.forEach(function (picture) {
        var image = picture.querySelector('.image');
        if (evt.target.checked) {
          image.classList.add('passe-partout');
          setPassePartoutSize(image);
          // FRAME_WIDTH = 0;
        } else {
          image.classList.remove('passe-partout');
        };
      });
      if (evt.target.checked) {
        passePartoutRulers.forEach(function (ruler) {
          ruler.checked = true;
        })
      } else {
        passePartoutRulers.forEach(function (ruler) {
          ruler.checked = false;
        })
      }
      // onPictureParameterChange.passePartout();
    },
  };

  var onRulerFieldsetOut = function (mouseoutEvt) {
    console.log('mouseout');
    var currentPicture = document.querySelector('.picture--active');
    currentPicture.classList.remove('picture--active');
    mouseoutEvt.currentTarget.addEventListener('mouseover', onRulerFieldsetHover);
    mouseoutEvt.currentTarget.removeEventListener('mouseout', onRulerFieldsetOut);
  }
  // Обработчик ховера на филдсет
  var onRulerFieldsetHover = function (evt) {
    console.log('mouseover');
    if (evt.currentTarget.type === 'fieldset') {
      var ruler = evt.currentTarget;
      var pictureNumber = ruler.id.slice(pictureRulerIDPrefix.length);
      var currentPicture = document.querySelector('#' + pictureIDPrefix + pictureNumber);
      currentPicture.classList.add('picture--active');
    }
    evt.currentTarget.removeEventListener('mouseover', onRulerFieldsetHover);
    evt.currentTarget.addEventListener('mouseout', onRulerFieldsetOut);
  };


  window.rulers = {
    block: rulersBlock,
    // fieldsets: [],
    render: function (evt) {
      evt.preventDefault();
      var pictureRulersTemplate = document.querySelector('#picture-rulers').content;
      var fragment = document.createDocumentFragment();
      var picturesQuantity = window.pattern.currentPattern.picturesQuantity;
      console.log(picturesQuantity);

      for (var i = 1; i <= picturesQuantity; i++) {
        var ruler = pictureRulersTemplate.cloneNode(true);
        var rulerFieldset = ruler.querySelector('.picture-ruler');
        rulerFieldset.classList.add('picture-ruler' + (i));
        rulerFieldset.id = rulerFieldset.id + i;
        var pictureNumber = rulerFieldset.querySelector('.picture-number');
        pictureNumber.insertAdjacentText('afterbegin', i);
        var rulerInputs = ruler.querySelectorAll('input');
        rulerInputs.forEach(function (element) {
          element.setAttribute('id', element.id + (i));
        });
        var rulerLabels = ruler.querySelectorAll('label');
        rulerLabels.forEach(function (element) {
          element.setAttribute('for', element.getAttribute('for') + (i));
        });

        fragment.appendChild(ruler);
      };
      pictureRulersBlock.innerHTML = '';
      pictureRulersBlock.appendChild(fragment);
    },
    // onRulerChange: function (evt) {
    //   onPictureParameterChange.parameter();
    // },
    setHandlers: function () {
      var pictureRulers = pictureRulersBlock.querySelectorAll('.picture-ruler');
      pictureRulers.forEach(function (ruler) {
        ruler.addEventListener('mouseover', onRulerFieldsetHover);
      });

      pictureRulers.forEach(function (rulerFieldset, index) {
        var currentRuler = {};
        // var commonRuler;
        PICTURE_PARAMETERS.forEach(function (parameter) {
          currentRuler[parameter] = rulerFieldset.querySelector('[for=' + pictureParametersToLabelsClass[parameter] + (index + 1) + ']');
          // commonRuler[parameter] = commonRulersBlock.querySelector('[for=' + pictureParametersToLabelsClass[parameter] + 's]');
        })
        allRulers[index] = currentRuler;
      });
      console.log('allRulers=', allRulers);

      PICTURE_PARAMETERS.forEach(function (parameter) {
        rulers[parameter] = pictureRulersBlock.querySelectorAll('.' + pictureParametersToLabelsClass[parameter]);
        rulers[parameter].forEach(function (ruler) {
          ruler.addEventListener('change', onPictureParameterChange[parameter]);
        });
        commonRulers[parameter] = commonRulersBlock.querySelector('.' + pictureParametersToLabelsClass[parameter]);
        commonRulers[parameter].addEventListener('change', onCommonRulerChange[parameter]);

      });
      console.log('rulers=', rulers);
      return rulers;
    },
  };

  window.rulers.block.reset();
})();
