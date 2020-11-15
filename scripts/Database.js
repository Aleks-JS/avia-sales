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

  // Получаем массив всех рейсов
  api.getFlights = function (state) {
    const db = getCopy(database.flights);
    return db;
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
