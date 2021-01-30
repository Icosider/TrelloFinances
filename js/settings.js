const t = TrelloPowerUp.iframe({
    localization: {
        defaultLocale: window.locale,
        supportedLocales: ['en', 'fr', 'ru'],
        resourceUrl: '/lang/{locale}.json'
    }
}),
currency = {
    AFN: '؋', USD: '$', THB: '฿', KRW: '₩',
    UAH: '₴', PYG: '₲', ANG: 'ƒ', VND: '₫',
    EUR: '€', JPY: '¥', LAK: '₭', CRC: '₡',
    TRY: '₺', AZN: '₼', NGN: '₦', PHP: '₱',
    RUB: '₽', INR: '₹', IDR: '₨', BDT: '৳',
    KZT: '₸', FKP: '£', ILS: '₪', CNY: '¥'
};

t.render(() => {
    t.localizeNode(document.body);

    TrelloPowerUp.Promise.all([
        t.get('card', 'shared', 'price'),
        t.get('card', 'shared', 'currency')
    ]).spread(function(price, cardCur) {
        const currencySelector = document.getElementById('currency');
        const iPrice = parseInt(price);

        if (!isNaN(iPrice))
            document.getElementById('price').value = iPrice;

        for (let cur in currency) {
            const currencyElement = document.createElement('option');
            currencyElement.innerHTML = t.localizeKey('currency_' + cur.toString().toLowerCase());
            currencyElement.value = cur.toString();

            if (cardCur === cur || window.locale === 'ru' && cur.toString() === 'RUB')
                currencyElement.selected = true;
            currencySelector.appendChild(currencyElement);
        }
    });
});

document.getElementById('save').addEventListener('click', () => {
    const price = document.getElementById('price').value;
    const cur = document.getElementById('currency').value;

    if (isNaN(parseInt(price))) {
        return t.popup({
            title: 'Warning!',
            url: 'error.html'
        });
    }
    return t.set('card', 'shared', 'price', Math.abs(price)).then(() => 
            t.set('card', 'shared', 'currency', cur.toString()).then(() => 
            t.closePopup()));
});

document.getElementById('remove').addEventListener('click', (e) => t.get('card', 'shared', 'price').then((price) => {
    if (!isNaN(parseInt(price)))
        return t.remove('card', 'shared', 'price').then(() => t.closePopup());
    return null;
}));