const promise = TrelloPowerUp.Promise;

const cur = {
    AFN: '؋', USD: '$', THB: '฿', KRW: '₩',
    UAH: '₴', PYG: '₲', ANG: 'ƒ', VND: '₫',
    EUR: '€', JPY: '¥', LAK: '₭', CRC: '₡',
    TRY: '₺', AZN: '₼', NGN: '₦', PHP: '₱',
    RUB: '₽', INR: '₹', IDR: '₨', BDT: '৳',
    KZT: '₸', FKP: '£', ILS: '₪', CNY: '¥'
}

function getBadge(t) {
    return promise.all([
        t.get('card', 'shared', 'price'),
        t.get('card', 'shared', 'paid', false),
        t.get('card', 'shared', 'currency')
    ]).spread(function(price, paid, currency) {
        if (price === null || price == 0)
            return null;
        return {
            title: t.localizeKey('price'),
            text: paid ? t.localizeKey('paid') : price + ' ' + cur[currency],
            color: paid ? 'green' : 'red',
            callback: function(t) {
                return t.set('card', 'shared', 'paid', !paid);
            }
        }
    })
}

function sortCards(t, options, reverse) {
    return new Promise(function(resolve) {
        let values = {};

        options.cards.forEach(function(card) {
            t.get(card.id, 'shared', 'price').then(function(price) {
                values[card.id] = price;
                resolve(values);
            });
        });
    }).then(function(values) {
        const sortedCards = options.cards.sort(function(a, b) {
            const mA = parseInt(values[a.id]);
            const mB = parseInt(values[b.id]);

            if (mA > mB)
                return 1;
            else if (mB > mA)
                return -1;
            return 0;
        });

        let sortedId = sortedCards.map(function(c) { return c.id; });

        if (reverse)
            sortedId = sortedId.reverse();
        return {
            sortedIds: sortedId
        };
    });
}

/**
 *   Initialization of capabilities
 */
TrelloPowerUp.initialize({
        'card-buttons': function(t) {
            const priceName = t.localizeKey('set_price');
            return {
                icon: 'https://image.flaticon.com/icons/svg/287/287616.svg',
                text: priceName,
                callback: function(t) {
                    return t.popup({
                        title: priceName,
                        url: 'settings.html',
                        height: 192
                    });
                }
            }
        },
        'card-badges': function(t) {
            return getBadge(t);
        },
        'card-detail-badges': function(t) {
            return getBadge(t);
        },
        'list-sorters': function(t) {
            return [{
                text: t.localizeKey('sortIncrease'),
                callback: function(t, options) {
                    return sortCards(t, options, false);
                }
            }, {
                text: t.localizeKey('sortDecrease'),
                callback: function(t, options) {
                    return sortCards(t, options, true);
                }
            }];
        }
    }, {
        localization: {
            defaultLocale: 'en',
            supportedLocales: ['en', 'fr', 'ru'],
            resourceUrl: 'lang/{locale}.json'
        }
    }
);