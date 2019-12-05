'use strict';

(function () {
  var wall = document.querySelector('.wall');
  var gallerySizeBlock = wall.querySelector('.gallery-size');
  var galleryBlock = wall.querySelector('.gallery-area');
  var pictures;
  var inputBlocks;
  var columns;
  var picturesToColumns = {};
  var picturesInColumns = {};
  var maxChildsWidth;
  var MARGIN = 8;


  window.script = {
    wall: wall,
    // gallerySizeBlock: gallerySizeBlock,
    pictures: pictures,
    inputBlocks: inputBlocks,
    columns: columns,
    picturesToColumns: picturesToColumns,

    setColumnWidth: function (column) {
      maxChildsWidth = 0;
      var picturesWidth = 0;
      var picturesQuantity = picturesInColumns[column.id].length;
      picturesInColumns[column.id].forEach(function (el) {
        picturesWidth += el.offsetWidth;
        if (el.offsetWidth > maxChildsWidth) {
          maxChildsWidth = el.offsetWidth;
        }
      });
      var residualWidth = picturesWidth - maxChildsWidth;
      if (maxChildsWidth > residualWidth) {
        column.style['width'] = (maxChildsWidth + 2 * MARGIN) + 'px';
      } else {
        column.style['width'] = (residualWidth + (picturesQuantity - 1) * 2 * MARGIN) + 'px';
      }
    },

    setGallerySize: function () {
      var galleryWidth = galleryBlock.offsetWidth;
      var galleryHeight = galleryBlock.offsetHeight;
      var galleryWidthSm = Math.round(window.util.getSizeInSm(galleryWidth) / 10) * 10;
      var galleryHeightSm = Math.round(window.util.getSizeInSm(galleryHeight) / 10) * 10;
      gallerySizeBlock.textContent = galleryWidthSm + ' x ' + galleryHeightSm + ' см';
    },


    renderRulers: function () {
      window.script.gallery = document.querySelector('.gallery-area');
      window.script.inputBlocks = window.script.gallery.querySelectorAll('input');
      window.script.pictures = window.script.gallery.querySelectorAll('.picture');
      window.script.columns = window.script.gallery.querySelectorAll('.column');
      console.log(columns);
      var wallpaperRuler = window.rulers.block.querySelector('#wallpaper-ruler');
      console.log(wallpaperRuler);



      var columnIDToNode = {};

      window.script.columns.forEach(function (element) {
        var column = element;
        picturesInColumns[column.id] = column.querySelectorAll('.picture');
        var pictures = picturesInColumns[column.id];
        pictures.forEach(function (picture) {
          window.script.picturesToColumns[picture.id] = element;
        })
        columnIDToNode[element.id] = element;

      });

      window.script.columns.forEach(function (element) {
        window.script.setColumnWidth(element);
      });

      window.script.setGallerySize();

      window.script.inputBlocks.forEach(function (element) {
        window.images.loadImg(element);
      })

      var wallStyles = window.getComputedStyle(wall);
      // console.log(wallStyles);
      // wallpaperRuler.setAttribute('value', wallStyles['background-color']);
      console.log(wallpaperRuler.value);
      wallpaperRuler.addEventListener('change', function () {
        wall.style['background-color'] = wallpaperRuler.value;
      });

      window.script.pictures.forEach(function (picture) {
        picture.addEventListener('mousedown', function (evt) {
          window.dragAndDrop(evt);
        })
      });
    },
  }
})();
