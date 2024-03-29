/*==========================CART=============================*/
//https://incode.pro/javascript/sozdaem-korzinu-pokupatelja-na-chistom-javascript-i-localstorage.html
let modal = document.getElementById("modal");
let btnOpen = document.getElementById("checkout");
let btnClose = document.querySelector(".close");
let count = document.querySelector("b");

btnOpen.addEventListener("click", function () {
    if (modal.style.display === "block") {
        modal.classList.remove("swing-in-top-fwd");
        modal.classList.add("swing-out-top-bck");
        setTimeout(function () {
            modal.style.display = "none";
        }, 250);
    } else {
        modal.classList.remove("swing-out-top-bck");
        modal.classList.add("swing-in-top-fwd");
        setTimeout(function () {
            modal.style.display = "block";
        }, 250);
    }
});

btnClose.addEventListener("click", function () {
    modal.classList.remove("swing-in-top-fwd");
    modal.classList.add("swing-out-top-bck");
    setTimeout(function () {
        modal.style.display = "none";
    }, 1000);
});

let itemBox = document.querySelectorAll('.item_box'), // блок каждого товара
    cartContent = document.getElementById('cart_content'), // блок вывода данных корзины
    message = document.querySelector('.message'); // Элемент вывода сообщения в корзине.

// Функция кроссбраузерной установка обработчика событий
function addEvent(elem, type, handler) {
    elem.attachEvent = function () {
        handler.call(elem);
    };

    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on' + type);
    }
    return false;
}

// Получаем данные из LocalStorage
function getCartData() {
    return JSON.parse(localStorage.getItem('cart'));
}

// Записываем данные в LocalStorage
function setCartData(o) {
    localStorage.setItem('cart', JSON.stringify(o));
    return false;
}

// Добавляем товар в корзину
function addToCart() {
    /*
    this.disabled = true; // блокируем кнопку на время операции с корзиной
    // Я не понял зачем это нужно и на что оно влияет, по этому закомментил!!!
    */

    let cartData = getCartData() || {}, // получаем данные корзины или создаём новый объект, если данных еще нет
        parentBox = this.parentNode.parentNode, // родительский элемент кнопки "Добавить в корзину"
        itemId = this.getAttribute('data-id'), // ID товара
        itemTitle = parentBox.querySelector('.item_title').innerHTML, // название товара
        itemPrice = parentBox.querySelector('.item_price').innerHTML; // стоимость товара

    if (cartData.hasOwnProperty(itemId)) { // если такой товар уже в корзине, то добавляем +1 к его количеству
        cartData[itemId][2] += 1;
    } else { // если товара в корзине еще нет, то добавляем в объект
        cartData[itemId] = [itemTitle, itemPrice, 1];
    }

    // Обновляем данные в LocalStorage
    if (!setCartData(cartData)) {
        /*
        this.disabled = false; // разблокируем кнопку после обновления LS
        // Я не понял зачем это нужно и на что оно влияет, по этому закомментил!!!
        */
        message.innerHTML = 'Product added to cart.';
        setTimeout(function () {
            message.innerHTML = 'Continue shopping...';
        }, 1000);
    }
    return false;
}

// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for (let i = 0; i < itemBox.length; i++) {
    addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
    addEvent(itemBox[i].querySelector('.add_item'), 'click', refreshCart);
}

// Открываем корзину со списком добавленных товаров
function refreshCart() { // функция называлась openCart

    let cartData = getCartData(), // вытаскиваем все данные корзины
        totalItems = '',
        totalCount = 0,
        totalSum = 0;

    // если что-то в корзине уже есть, начинаем формировать данные для вывода
    if (cartData !== null) {
        totalItems = '<table class="shopping_list"><tr><th>Product</th><th>Price ($)</th><th>Amount</th><th>Sum</th><th>Remove</th></tr>';
        for (let items in cartData) {
            if (cartData.hasOwnProperty(items)) {
                totalItems += '<tr>';
                for (let i = 0; i < cartData[items].length; i++) {
                    totalItems += '<td>' + cartData[items][i] + '</td>';
                }
                let sum = cartData[items][1] * cartData[items][2];
                totalItems += '<td>' + sum + '</td>';
                totalItems += '<td><button class="remove" data-id="' + items + '">&#128465;</button></td>';
                totalSum += cartData[items][1] * cartData[items][2];
                totalCount += cartData[items][2];
                totalItems += '</tr>';
            }
        }
        totalItems += '<tr><td><strong>Total</strong></td><td></td><td><btnClose id="total_count">' + totalCount + '</btnClose> pcs.</td><td><btnClose id="total_sum">' + totalSum + '</btnClose></td></tr>';
        totalItems += '</table>';
        cartContent.innerHTML = totalItems;
    } else {
        // если в корзине пусто, то сигнализируем об этом
        cartContent.innerHTML = 'The cart is empty!';
    }

    count.innerHTML = totalCount.toString();
    return false;
}

// функция для нахождения необходимого ближайшего родительского элемента
function closest(el, sel) {
    if (el !== null)
        return el.matches(sel) ? el : (el.querySelector(sel) || closest(el.parentNode, sel));
}

/* Открыть корзину */
addEvent(document.getElementById('checkout'), 'click', refreshCart);

/* Очистить корзину */
addEvent(document.getElementById('clear_cart'), 'click', clearCart);
function clearCart() {
    localStorage.removeItem('cart');
    cartContent.innerHTML = 'All removed';
    refreshCart();
}

/* Удаление товара из корзины */
addEvent(document.body, 'click', function (element) {
    if (element.target.className === 'remove') {
        let itemId = element.target.getAttribute('data-id'),
            cartData = getCartData();
        if (cartData.hasOwnProperty(itemId)) {
            let tr = closest(element.target, 'tr');
            tr.parentNode.removeChild(tr); /* Удаляем строку товара из таблицы */
            delete cartData[itemId]; // удаляем товар из объекта
            setCartData(cartData); // перезаписываем измененные данные в localStorage
        }
        isEmpty(cartData); //Проверяем пустой ли объект.
    }
    refreshCart();
}, false);

/*Функция проверяет объект cartData на наличие свойств,
если объект пустой вызывает функцию полной очистки корзины.*/
function isEmpty(obj) {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    clearCart();
    return true;
}


refreshCart();


/*==========================BUTTON MORE/LESS==============================*/


document.querySelectorAll(".btn-more").forEach(function (element) {
    element.addEventListener("click", function () {

            let display = this.parentNode.parentNode.querySelector("p").style.display;

            if (display === "block") {
                this.parentNode.parentNode.querySelector("p").style.display = "none";
            } else {
                this.parentNode.parentNode.querySelector("p").style.display = "block";
            }
        },
        false)
});


document.querySelectorAll(".btn").forEach(function (element) {
    element.addEventListener("click", function () {
            if (!this.name) {
                return;
            }
            let tmp = this.innerHTML;
            this.innerHTML = this.name;
            this.name = tmp;
        },
        false)
});


/*==========================SLIDER==============================*/


let multiItemSlider = (function () {
    return function (selector) {
        let
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
            _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = []; // массив элементов

        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
            _items.push({item: item, position: index, transform: 0});
        });

        let position = {
            getItemMin: function () {
                let indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position < _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getItemMax: function () {
                let indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position > _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getMin: function () {
                return _items[position.getItemMin()].position;
            },
            getMax: function () {
                return _items[position.getItemMax()].position;
            }
        };

        let _transformItem = function (direction) {
            let nextItem;
            if (direction === 'right') {
                _positionLeftItem++;
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    _items[nextItem].position = position.getMax() + 1;
                    _items[nextItem].transform += _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform -= _step;
            }
            if (direction === 'left') {
                _positionLeftItem--;
                if (_positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    _items[nextItem].position = position.getMin() - 1;
                    _items[nextItem].transform -= _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        };

        // обработчик события click для кнопок "назад" и "вперед"
        let _controlClick = function (e) {
            let direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
            e.preventDefault();
            _transformItem(direction);
        };

        let _setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
            _sliderControls.forEach(function (item) {
                item.addEventListener('click', _controlClick);
            });
        };

        // инициализация
        _setUpListeners();

        return {
            right: function () { // метод right
                _transformItem('right');
            },
            left: function () { // метод left
                _transformItem('left');
            }
        }

    }
}());

multiItemSlider('.slider');