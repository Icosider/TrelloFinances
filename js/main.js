const PROMISE = TrelloPowerUp.Promise;
const ICON_PRICE = 'https://image.flaticon.com/icons/svg/287/287616.svg';

function cardButtons(t) {
    const priceName = t.localizeKey('set_price');
    return {
        icon: ICON_PRICE,
        text: priceName,
        callback: (t) => t.popup({
            title: priceName,
            url: './settings.html',
            height: 192
        })
    };
}

function cardBadge(t) {
    return PROMISE.all([
        t.get('card', 'shared', 'price'),
        t.get('card', 'shared', 'paid', false),
        t.get('card', 'shared', 'currency')
    ]).spread((price, paid, currency) => {
        if (isNaN(price) || price === 0)
            return null;
        return {
            title: t.localizeKey('price'),
            text: paid ? t.localizeKey('paid') : price.toLocaleString(window.locale, {
                style: 'currency',
                currency: currency
            }),
            color: paid ? 'green' : 'red',
            callback: (t) => t.set('card', 'shared', 'paid', !paid)
        };
    })
}

function sorters(t) {
    return [{
        text: t.localizeKey('sortIncrease'),
        callback: (t, options) => sortCards(t, options, false)
    }, {
        text: t.localizeKey('sortDecrease'),
        callback: (t, options) => sortCards(t, options, true)
    }];
}

function sortCards(t, options, reverse) {
    return new Promise((resolve) => {
        let values = {};

        options.cards.forEach((card) => t.get(card.id, 'shared', 'price').then((price) => {
            values[card.id] = price;
            resolve(values);
        }));
    }).then((values) => {
        const sortedCards = options.cards.sort((a, b) => {
            const priceA = parseInt(values[a.id]);
            const priceB = parseInt(values[b.id]);

            if (priceA > priceB)
                return 1;
            else if (priceB > priceA)
                return -1;
            return 0;
        });

        let sortedCardsId = sortedCards.map((c) => c.id);

        if (reverse)
            sortedCardsId = sortedCardsId.reverse();
        return { sortedIds: sortedCardsId };
    });
}

/**
 *   Initialization of capabilities
 */
TrelloPowerUp.initialize({
        'card-buttons':         (t) => cardButtons(t),
        'card-badges':          (t) => cardBadge(t),
        'card-detail-badges':   (t) => cardBadge(t),
        'list-sorters':         (t) => sorters(t)
    }, {
        localization: {
            defaultLocale: 'en',
            supportedLocales: ['en', 'fr', 'ru'],
            resourceUrl: '/lang/{locale}.json'
        }
    }
);
