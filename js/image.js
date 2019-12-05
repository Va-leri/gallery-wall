'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg'];
  window.images = {
    onInputChange: function (evt) {
      var file = evt.target.files[0];
      if (file) {
        var inputField = evt.target;
        var inputFieldID = inputField.getAttribute('id');
        var outputBlock = window.script.gallery.querySelector('[for="' + inputFieldID + '"]');

        var fileName = file.name.toLowerCase();
        var isImage = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });
        if (isImage) {
          var reader = new FileReader();
          reader.readAsDataURL(file);

          reader.addEventListener('load', function (loadEvt) {
            outputBlock.style['background-image'] = 'url(' + loadEvt.target.result + ')';
          });

        }
      }
    },

    loadImg: function (inputField) {
      inputField.addEventListener('change', window.images.onInputChange);
    },
  };
})();
