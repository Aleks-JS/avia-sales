const array = [
  {
    logo: 'img/retail/logo__papa_johns_pizza.png',
    title: 'Papa Johns',
    category: ['Пицерия'],
    productCategory: ['Пица', 'Кофе', 'Слабоалкогольные напитки'],
  },
  {
    logo: 'img/retail/logo__starbucks.png',
    title: 'Starbucks',
    category: ['Кофейня'],
    productCategory: ['Кофе', 'Десерты'],
  },
  {
    logo: 'img/retail/logo__sushiwok.png',
    title: 'SushiWok',
    category: ['Суши'],
    productCategory: ['Суши'],
  },
  {
    logo: 'img/retail/logo__sushiwok.png',
    title: 'SushiWok',
    category: ['Суши'],
    productCategory: ['Суши'],
  },
  {
    logo: 'img/retail/logo__sushiwok.png',
    title: 'SushiWok',
    category: ['Суши'],
    productCategory: ['Суши'],
  },
  {
    logo: 'img/retail/logo__sushiwok.png',
    title: 'SushiWok',
    category: ['Суши'],
    productCategory: ['Суши'],
  },
];

// фильтр
let keys = [
  { title: 'Пица', selected: true },
  { title: 'Кофе', selected: false },
  { title: 'Суши', selected: true },
  { title: 'Десерты', selected: false },
  { title: 'Слабоалкогольные напитки', selected: false },
  { title: 'Алкогольные напитки', selected: false },
];

// выбранные значения фильтра
let keysSelectedFilter = keys.filter((i) => i.selected).map((i) => i.title);
let result = array.filter((i) =>
  i.productCategory.some((k) => keysSelectedFilter.includes(k))
);

console.log(result);

document.querySelectorAll('.menu-page__price input').forEach((e) => {
  e.addEventListener('focus', (e) => {
    parseInt(e.target.value) === 0 && (e.target.value = '');
  });

  e.addEventListener('blur', (e) => {
    !e.target.value && (e.target.value = 0);
  });
});
