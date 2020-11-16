(function () {
  const api = new EventEmitter();

  const database = {
    _flights: [],

    _days: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],

    _months: [
      'январь',
      'февраль',
      'март',
      'апрель',
      'май',
      'июнь',
      'июль',
      'август',
      'сентябрь',
      'октябрь',
      'ноябрь',
      'декабрь',
    ],

    get flights() {
      return this._flights;
    },
    set flights(db) {
      db.map((el) => this._flights.push(el.flight));
    },

    get days() {
      return this._days;
    },

    get months() {
      return this._months;
    },
  };

  // Метод перезаписи данных из базы данных для предотвращения мутации
  api.seed = function seed(db) {
    database.flights = getCopy(db);
  };

  // Получаем точную копию объекта
  function getCopy(x) {
    return JSON.parse(JSON.stringify(x));
  }

  // Получаем массив перевозчиков
  api.getAirLines = function getAirLines() {
    return database.flights.map((el) => el.carrier);
  };

  api.initGetDb = function () {
    return getCopy(database.flights);
  };

  // Получаем и обрабатываем массив всех рейсов
  api.getFlights = function (state) {
    // фильтр по пересадкам
    if (
      (state.onesegment && state.twosegment) ||
      (!state.onesegment && !state.twosegment)
    ) {
      state.flights = database.flights;
    } else if (state.twosegment) {
      state.flights = state.flights.filter(
        (el) => el.legs[0].segments.length > 1
      );
    } else if (state.onesegment) {
      state.flights = state.flights.filter(
        (el) => el.legs[0].segments.length < 2 && el.legs[1].segments.length < 2
      );
    }

    // фильтр макс стоимости
    if (state.maxcost) {
      console.log('maxcost');
      state.flights = state.flights.filter(
        (e) => parseInt(e.price.total.amount) < state.maxcost
      );
    }

    // сортировка по возрастанию
    if (state.minprice) {
      state.flights.sort(
        (a, b) =>
          parseInt(a['price'].total.amount) - parseInt(b['price'].total.amount)
      );
    }

    // сортировка по убыванию
    if (state.maxprice) {
      state.flights.sort(
        (a, b) =>
          parseInt(b['price'].total.amount) - parseInt(a['price'].total.amount)
      );
    }

    // сортировка по времени
    if (state.duration) {
      state.flights.sort(
        (a, b) =>
          parseInt(a['legs'][0].duration) - parseInt(b['legs'][0].duration)
      );
    }

    // фильтр мин стоимости
    state.flights = state.flights.filter(
      (e) => parseInt(e.price.total.amount) > state.mincost
    );

    //фильтр по перевозчикам
    if (state.carrier.length > 0) {
      let keysSelectedFilter = state.carrier.map((i) => i);
      console.log(keysSelectedFilter);

      state.flights = state.flights.filter((i) => {
        return (
          keysSelectedFilter.includes(i.carrier.caption) && i.carrier.caption
        );
      });
    }

    return state.flights;
  };

  // Получаем массив дней
  api.getDays = function () {
    return database.days;
  };

  // Получаем массив месяцев
  api.getMonths = function () {
    return database.months;
  };

  window.Database = api;
})();
