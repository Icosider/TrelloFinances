const promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe({
    localization: {
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr', 'ru'],
        resourceUrl: 'lang/{locale}.json'
    }
});

t.lists('all').then((lists) => {
    var listTotalPrice = new Map();

    lists.map((list) => {
        let ias = new Map();
        var i = 0;
        list.cards.map((card) => {
            if (ias.has(list.id))
                i = ias.get(list.id);

            t.get(card.id, 'shared', 'price').then((price) => {
                ias.set(list.id, i + price);
            });
        });
        console.log(ias);
    });
});