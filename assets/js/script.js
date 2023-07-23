const querySelector = selectors => document.querySelector(selectors);
const querySelectorAll = selectors => document.querySelectorAll(selectors);
let modalAmount;
let modalKey = 0;
const cart = [];

pizzaJson.map((item, index) => {
  const pizzaItem = querySelector('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    const key = event.target.closest('.pizza-item').getAttribute('data-key');
    modalKey = key;

    querySelector('.pizzaBig img').src = pizzaJson[key].img;
    querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;


    querySelector('.pizzaInfo--size.selected').classList.remove('selected');

    querySelectorAll('.pizzaInfo--size').forEach((size, index) => {
      if (index == 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
    });

    modalAmount = 1;
    querySelector('.pizzaInfo--qt').innerHTML = modalAmount;

    querySelector('.pizzaWindowArea').style.opacity = 0;
    querySelector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      querySelector('.pizzaWindowArea').style.opacity = 1;
    }, 200);

  });

  querySelector('.pizza-area').append(pizzaItem);
});

function closeModal() {
  querySelector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    querySelector('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton')
  .forEach((item) => {
    item.addEventListener('click', closeModal);
  });

querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalAmount > 1) {
    modalAmount--;
    querySelector('.pizzaInfo--qt').innerHTML = modalAmount;
    querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[modalKey].price * modalAmount).toFixed(2)}`;
  }
});

querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalAmount++;
  querySelector('.pizzaInfo--qt').innerHTML = modalAmount;
  querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[modalKey].price * modalAmount).toFixed(2)}`;
});

querySelectorAll('.pizzaInfo--size').forEach((size) => {
  size.addEventListener('click', (event) => {
    querySelector('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

querySelector('.pizzaInfo--addButton').addEventListener('click', () => {

  let size = parseInt(querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
  let identifier = pizzaJson[modalKey].id + '@' + size;
  let key = cart.findIndex(item => item.identifier === identifier);

  if (key > -1) {
    cart[key].amount += modalAmount;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      amount: modalAmount
    });
  }

  updateCart();
  closeModal();

});

querySelector('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    querySelector('aside').style.left = 0;
  }
});

querySelector('.menu-closer').addEventListener('click', () => {
  querySelector('aside').style.left = '100vw';
});


function updateCart() {

  querySelector('.menu-openner span').innerHTML = cart.length;

  if (cart.length > 0) {
    querySelector('aside').classList.add('show');
    querySelector('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      const pizzaItem = pizzaJson.find(item => item.id === cart[i].id);
      subtotal += pizzaItem.price * cart[i].amount;

      const cartItem = querySelector('.models .cart--item').cloneNode(true);

      let pizzaSizeName;

      if (cart[i].size === 0) {
        pizzaSizeName = 'P';
      } else if (cart[i].size === 1) {
        pizzaSizeName = 'M';
      } else if (cart[i].size === 2) {
        pizzaSizeName = 'G';
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-name').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].amount;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[i].amount > 1) {
          cart[i].amount--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].amount++;
        updateCart();
      });

      querySelector('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    querySelector('aside').classList.remove('show');
    querySelector('aside').style.left = '100vw';
  }
}