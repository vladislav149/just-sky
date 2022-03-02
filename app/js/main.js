$(function () {

  //яндекс карта

  ymaps.ready(init);

  function init() {
    let zoomMap;
    if (window.matchMedia("(max-width: 576px)").matches) {
      zoomMap = 16;
    } else
      zoomMap = 17;

    let myMap = new ymaps.Map("map", {
      center: [43.03896870885594, 44.6334173711635],
      zoom: zoomMap
    });

    let placemark = new ymaps.Placemark([43.0386539149548, 44.63097656095994], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../images/icon/map-location.svg',
      iconImageSize: [60, 60],
      iconImageOffset: [-33, -60]
    })

    myMap.controls.remove('searchControl'); // удаляем поиск
    myMap.controls.remove('trafficControl'); // удаляем контроль трафика
    //myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
    myMap.controls.remove('rulerControl'); // удаляем контрол правил
    //myMap.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
    myMap.geoObjects.add(placemark)
  }

  //мобильное меню

  $('.burger').on('click', function () {
    $('.mobile-menu').addClass('mobile-menu--active');
    $('body').addClass('overlay');
  });

  $(document).mouseup(function (e) { // событие клика по веб-документу
    let div = $('.mobile-menu'); // тут указываем класс элемента
    if (!div.is(e.target) // если клик был не по этому блоку
      &&
      div.has(e.target).length === 0 // и не по его дочерним элементам
      &&
      !$('.close--menu').is(e.target)) { // и если не по кнопке//
      div.removeClass('mobile-menu--active'); //удаляю класс
      $('body').removeClass('overlay');
    }
  });

  $('.close--menu').on('click', function () {
    $('.mobile-menu').removeClass('mobile-menu--active');
    $('body').removeClass('overlay');
  });
});