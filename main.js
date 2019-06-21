/*==========================CART=============================*/
//https://incode.pro/javascript/sozdaem-korzinu-pokupatelja-na-chistom-javascript-i-localstorage.html
let modal = document.getElementById("modal");
let btn = document.getElementById("checkout");
let span = document.querySelector(".close");
let animation = document.getElementById("modal");

btn.onclick = function () {
    if (modal.style.display === "block") {
        animation.classList.remove("swing-in-top-fwd");
        animation.classList.add("swing-out-top-bck");
        setTimeout(function () {
            modal.style.display = "none";
        }, 500);
    } else {
        //modal.style.display = "block";
        animation.classList.remove("swing-out-top-bck");
        animation.classList.add("swing-in-top-fwd");
        setTimeout(function () {
            modal.style.display = "block";
        }, 500);
    }
};

span.onclick = function () {
    animation.classList.remove("swing-in-top-fwd");
    animation.classList.add("swing-out-top-bck");
    setTimeout(function () {
        modal.style.display = "none";
    }, 1000);
};


let doc = document,
    itemBox = doc.querySelectorAll('.item_box'), // блок каждого товара
    cartCont = doc.getElementById('cart_content'); // блок вывода данных корзины
// Функция кроссбраузерной установка обработчика событий
function addEvent(elem, type, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on' + type, function () {
            handler.call(elem);
        });
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
    this.disabled = true; // блокируем кнопку на время операции с корзиной
    console.log(this);
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
    if (!setCartData(cartData)) { // Обновляем данные в LocalStorage
        this.disabled = false; // разблокируем кнопку после обновления LS
    }
    return false;
}

// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for (let i = 0; i < itemBox.length; i++) {
    addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
}

// Открываем корзину со списком добавленных товаров
function openCart() {
    let cartData = getCartData(), // вытаскиваем все данные корзины
        totalItems = '',
        totalCount = 0,
        totalSum = 0;
    // если что-то в корзине уже есть, начинаем формировать данные для вывода
    if (cartData !== null) {
        totalItems = '<table class="shopping_list"><tr><th>Product</th><th>Price ($)</th><th>Number</th><th>Sum</th></tr>';
        for(let items in cartData){
            totalItems += '<tr>';
            for(let i = 0; i < cartData[items].length; i++){
                totalItems += '<td>' + cartData[items][i] + '</td>';
            }
            let sum = cartData[items][1] * cartData[items][2];
            totalItems += '<td>' + sum + '</td>';
            totalSum += cartData[items][1] * cartData[items][2];
            totalCount += cartData[items][2];
            totalItems += '</tr>';
        }
        totalItems += '<tr><td><strong>Total</strong></td><td></td><td><span id="total_count">'+ totalCount +'</span> pcs.</td><td><span id="total_sum">'+ totalSum +'</span></td></tr>';
        totalItems += '</table>';
        cartCont.innerHTML = totalItems;

    } else {
        // если в корзине пусто, то сигнализируем об этом
        cartCont.innerHTML = 'The cart is empty!';
    }
    return false;
}

/* Открыть корзину */
addEvent(doc.getElementById('checkout'), 'click', openCart);
/* Очистить корзину */
addEvent(doc.getElementById('clear_cart'), 'click', function () {
    localStorage.removeItem('cart');
    cartCont.innerHTML = 'All removed';
});


/*==========================CART==============================*/


document.querySelectorAll(".btn-more").forEach(function (element) {
    element.addEventListener("click", function () {
            //console.log(this.parentNode);
            let display = this.parentNode.parentNode.querySelector("p").style.display;
            console.log(this.parentNode.parentNode);
            if (display === "block") {
                this.parentNode.parentNode.querySelector("p").style.display = "none";
            } else {
                this.parentNode.parentNode.querySelector("p").style.display = "block";
            }
        },
        false)
});


document.querySelectorAll(".btn-more").forEach(function (element) {
    //console.dir(document.querySelectorAll("button"));
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