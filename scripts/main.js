const state = {
  minprice: true,
  maxprice: null,
  duration: null,
  onesegment: null,
  twosegment: null,
  mincost: null,
  maxcost: null,
  carrier: [],
  flights: [],
  count: 2,
};
state.flights = Database.initGetDb();

const airLineCheckBoxParent = document.querySelector('.menu-page__airlines');
const flightList = document.querySelector('.page__content');
const btn = document.querySelector('.count-flight');

function init() {
  // Сортировка
  document.querySelectorAll('.menu-page__sort').forEach((e) => {
    e.addEventListener('change', (e) => {
      switch (e.target.dataset.sort) {
        case 'minprice':
          setState({
            [e.target.dataset.sort]: true,
            maxprice: null,
            duration: null,
          });
          break;

        case 'maxprice':
          setState({
            minprice: null,
            [e.target.dataset.sort]: true,
            duration: null,
          });
          break;

        case 'duration':
          setState({
            minprice: null,
            maxprice: null,
            [e.target.dataset.sort]: true,
          });
          break;
      }
    });
  });

  btn.addEventListener('click', clickHandler);

  // Фильтр пересадок
  document.querySelectorAll('[name="transferFilter"]').forEach((e, i) => {
    e.addEventListener('change', (input) => {
      input.target.checked
        ? setState({ [input.target.dataset.sort]: true })
        : setState({ [input.target.dataset.sort]: null });
    });
  });

  // Фильтр минимальной стоимости
  document
    .querySelector('[data-sort="mincost"]')
    .addEventListener('input', (e) => {
      parseInt(e.target.value) > 0
        ? setState({ [e.target.dataset.sort]: parseInt(e.target.value) })
        : setState({ [e.target.dataset.sort]: null && (e.target.value = 0) });
    });

  // Фильтр максимальной стоимости
  document
    .querySelector('[data-sort="maxcost"]')
    .addEventListener('input', (e) => {
      parseInt(e.target.value) > 0
        ? setState({ [e.target.dataset.sort]: parseInt(e.target.value) })
        : setState({ [e.target.dataset.sort]: null });
    });

  // Фильтр по перевозчику
  document
    .querySelector('.menu-page__airlines')
    .addEventListener('change', (e) => {
      if (e.target.dataset.sort) {
        if (!state[e.target.dataset.sort].includes(e.target.name)) {
          state[e.target.dataset.sort].push(e.target.name);
          setState({
            [e.target.dataset.sort]: state[e.target.dataset.sort],
          });
        } else if (state[e.target.dataset.sort].includes(e.target.name)) {
          state[e.target.dataset.sort].splice(
            state[e.target.dataset.sort].indexOf(e.target.name),
            1
          );
          e.target.checked = false;
          setState({
            [e.target.dataset.sort]: state[e.target.dataset.sort],
          });
        }
      }
    });

  // Сброс кнопок
  document
    .querySelectorAll('input')
    .forEach((e, i) => (i != 0 ? (e.checked = false) : (e.checked = true)));
}

function update() {
  Database.getFlights(state);
  getFlightsListRange(flightList, state.flights, state.count);
}

function setState(obj) {
  Object.assign(state, obj);
  update();
}

(function () {
  const airlines = {};
  Database.getAirLines().map((el) => {
    airlines[el.uid] = el.caption;
  });
  for (let i in airlines) {
    airLineCheckBoxParent.innerHTML += `
    <input type="checkbox" name="${
      airlines[i]
    }" value="${i}" id="${i}" data-sort="carrier">
                                                  <label for="${i}">${
      airlines[i].length > 20 ? airlines[i].slice(0, 17) + '...' : airlines[i]
    }</label><br>
    `;
  }

  init();
  update();
})();

function counter(count) {
  return count + 2;
}

function clickHandler() {
  setState({ count: counter(state.count) });
}

function getFlightsListRange(parent, dataBase, count = 2) {
  parent.innerHTML = '';

  for (let i = 0; i < count; i++) {
    if (!dataBase[i]) return;
    const firstSegmentThere = dataBase[i].legs[0].segments[0];

    const lastSegmentThere =
      dataBase[i].legs[0].segments[dataBase[i].legs[0].segments.length - 1];

    const firstSegmentBack = dataBase[i].legs[1].segments[0];

    const lastSegmentBack =
      dataBase[i].legs[1].segments[dataBase[i].legs[1].segments.length - 1];

    const carrierUid = dataBase[i].carrier.uid;
    const totalPrice = dataBase[i].price.total.amount;
    const departureCity = firstSegmentThere.departureCity.caption;
    const departureAirport = firstSegmentThere.departureAirport.caption;
    const departureAirportUid = firstSegmentThere.departureAirport.uid;
    const arrivalCity = lastSegmentThere.arrivalCity.caption;
    const arrivalAirport = lastSegmentThere.arrivalAirport.caption;
    const arrivalAirportUid = lastSegmentThere.arrivalAirport.uid;

    const departureDateTime = new Date(firstSegmentThere.departureDate)
      .toTimeString()
      .slice(0, 5);

    const departureDateNum =
      new Date(firstSegmentThere.departureDate).getDate().length < 2
        ? `0${new Date(firstSegmentThere.departureDate).getDate()}`
        : new Date(firstSegmentThere.departureDate).getDate();

    const departureDateMonth = Database.getMonths()[
      new Date(firstSegmentThere.departureDate).getMonth()
    ].slice(0, 3);

    const departureDateDay = Database.getDays()[
      new Date(firstSegmentThere.departureDate).getDay()
    ];

    const departureDurationHour = Math.floor(dataBase[i].legs[0].duration / 60);
    const departureDurationMinutes = dataBase[i].legs[0].duration % 60;

    const arrivalDateTime = new Date(lastSegmentThere.arrivalDate)
      .toTimeString()
      .slice(0, 5);

    const arrivalDateNum =
      new Date(lastSegmentThere.arrivalDate).getDate().length < 2
        ? `0${new Date(lastSegmentThere.arrivalDate).getDate()}`
        : new Date(lastSegmentThere.arrivalDate).getDate();

    const arrivalDateMonth = Database.getMonths()[
      new Date(lastSegmentThere.arrivalDate).getMonth()
    ].slice(0, 3);

    const arrivalDateDay = Database.getDays()[
      new Date(lastSegmentThere.arrivalDate).getDay()
    ];

    const departureCarrierThere = dataBase[i].carrier.caption;

    /*  Обратный маршрут   */
    const departureBackCity = firstSegmentBack.departureCity.caption;
    const departureBackAirport = firstSegmentBack.departureAirport.caption;
    const departureBackAirportUid = firstSegmentBack.departureAirport.uid;
    const arrivalBackCity = lastSegmentBack.arrivalCity.caption;
    const arrivalBackAirport = lastSegmentBack.arrivalAirport.caption;
    const arrivalBackAirportUid = lastSegmentBack.arrivalAirport.uid;

    const departureBackDateTime = new Date(firstSegmentBack.departureDate)
      .toTimeString()
      .slice(0, 5);

    const departureBackDateNum =
      new Date(firstSegmentBack.departureDate).getDate().length < 2
        ? `0${new Date(firstSegmentBack.departureDate).getDate()}`
        : new Date(firstSegmentBack.departureDate).getDate();

    const departureBackDateMonth = Database.getMonths()[
      new Date(firstSegmentBack.departureDate).getMonth()
    ].slice(0, 3);

    const departureBackDateDay = Database.getDays()[
      new Date(firstSegmentBack.departureDate).getDay()
    ];

    const departureBackDurationHour = Math.floor(
      dataBase[i].legs[1].duration / 60
    );

    const departureBackDurationMinutes = dataBase[i].legs[1].duration % 60;

    const arrivalBackDateTime = new Date(lastSegmentBack.arrivalDate)
      .toTimeString()
      .slice(0, 5);

    const arrivalBackDateNum =
      new Date(lastSegmentBack.arrivalDate).getDate().length < 2
        ? `0${new Date(lastSegmentBack.arrivalDate).getDate()}`
        : new Date(lastSegmentBack.arrivalDate).getDate();

    const arrivalBackDateMonth = Database.getMonths()[
      new Date(lastSegmentBack.arrivalDate).getMonth()
    ].slice(0, 3);

    const arrivalBackDateDay = Database.getDays()[
      new Date(lastSegmentBack.arrivalDate).getDay()
    ];

    const departureBackCarrierThere = lastSegmentBack.airline.caption;

    const durationClassList =
      dataBase[i].legs[0].segments.length - 1 < 1 ? 'hide' : 'show';

    const durationClassListBack =
      dataBase[i].legs[1].segments.length - 1 < 1 ? 'hide' : 'show';

    parent.innerHTML += `
      <div class="page-content__title">
                        <div class="title-content">
                            <div class="title-logo" data-carrier="uid">${carrierUid}</div>
                            <div class="title-price__content">
                                <div class="total-price rub title-color" data-price="total">${totalPrice}</div>
                                <div class="description-price title-color">Стоимость для одного взрослого пассажира
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-content__body body-content">
                        <div class="body-content__flight">
                            <div class="flight-date__content">
                                <div class="date-content flight-oneway">
                                    <div class="date-content__flight flight-content">
                                        <div class="flight-content__container">
                                            <span class="city-name airoport-title"
                                                data-departureCity="caption">${departureCity}</span>,
                                            <span class="airport-name airoport-title"
                                                data-departureAirport="caption">${departureAirport}</span>
                                            <span class="airport-uid" data-departureAirport="uid">(${departureAirportUid})</span>
                                            <div class="arrow"></div>
                                            <span class="city-name airoport-title"
                                                data-arrivalCity="caption">${arrivalCity}</span>,
                                            <span class="airport-name airoport-title"
                                                data-arrivalAirport="caption">${arrivalAirport} </span>
                                            <span class="airport-uid" data-arrivalAirport="uid">(${arrivalAirportUid})</span>
                                        </div>
                                    </div>
                                    <div class="flight-content__date date-container">
                                        <div class="date-content__departure-date date-content__date">
                                            <span class="departure-time flight-time airoport-title"
                                                data-departureDate="time">${departureDateTime}</span>
                                            <span class="departure-date flight-date" data-departureDate="day">${departureDateNum} ${departureDateMonth}.
                                                ${departureDateDay}</span>
                                        </div>
                                        <div class="date-content__transfer" data-duration>${departureDurationHour} ч ${departureDurationMinutes} мин</div>
                                        <div class="date-content__arrival-date date-content__date">
                                            <span class="arrival-time flight-time airoport-title"
                                                data-arrivalDate="time">${arrivalDateTime}</span>
                                            <span class="arrival-date flight-date" data-arrivalDate="day">${arrivalDateNum} ${arrivalDateMonth}.
                                                ${arrivalDateDay}</span>
                                        </div>
                                    </div>
                                    <div class="date-content__border"><div class="duration-title ${durationClassList}">1 пересадка</div></div>
                                    <div class="date-content__airlines" data-airlines="caption">Рейс выполняет: ${departureCarrierThere}</div>
                                </div>
                            </div>
                            <div class="flight-content__border">
                            </div>
                            <div class="flight-date__content">
                                <div class="date-content flight-oneway">
                                    <div class="date-content__flight flight-content">
                                        <div class="flight-content__container">
                                            <span class="city-name airoport-title"
                                                data-departureCity="caption">${departureBackCity}</span>,
                                            <span class="airport-name airoport-title"
                                                data-departureAirport="caption">${departureBackAirport} </span>
                                            <span class="airport-uid" data-departureAirport="uid">(${departureBackAirportUid})</span>
                                            <div class="arrow"></div>
                                            <span class="city-name airoport-title"
                                                data-arrivalCity="caption">${arrivalBackCity}</span>,
                                            <span class="airport-name airoport-title"
                                                data-arrivalAirport="caption">${arrivalBackAirport}</span>
                                            <span class="airport-uid" data-arrivalAirport="caption">(${arrivalBackAirportUid})</span>
                                        </div>
                                    </div>
                                    <div class="flight-content__date date-container">
                                        <div class="date-content__departure-date date-content__date">
                                            <span class="departure-time flight-time airoport-title"
                                                data-departureDate="time">${departureBackDateTime}</span>
                                            <span class="departure-date flight-date" data-departureDate="day">${departureBackDateNum} ${departureBackDateMonth}.
                                                ${departureBackDateDay}</span>
                                        </div>
                                        <div class="date-content__transfer" data-duration>${departureBackDurationHour} ч ${departureBackDurationMinutes} мин</div>
                                        <div class="date-content__arrival-date date-content__date">
                                            <span class="arrival-time flight-time airoport-title"
                                                data-arrivalDate="time">${arrivalBackDateTime}</span>
                                            <span class="arrival-date flight-date" data-arrivalDate="day">${arrivalBackDateNum} ${arrivalBackDateMonth}.
                                                ${arrivalBackDateDay}</span>
                                        </div>
                                    </div>
                                    <div class="date-content__border"><div class="duration-title ${durationClassListBack}">1 пересадка</div></div>
                                    <div class="date-content__airlines" data-airlines="caption">Рейс выполняет: ${departureBackCarrierThere}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-content__footer footer-content">
                        <button class="flight-selection button" (click)="counter">Выбрать</button>
                    </div>
      `;
  }
}
