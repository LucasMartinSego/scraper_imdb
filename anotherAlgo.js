const fs = require('fs');
const cheerio = require('cheerio');

(async () => {
    const res = await fetch("https://www.imdb.com/es-es/chart/top/", {
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "es-ES,es;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "session-id=147-3462859-0130357; session-id-time=2082787201l; ubid-main=130-7598149-6476908; international-seo=es-ES; ad-oo=0; ci=eyJpc0dkcHIiOmZhbHNlfQ; csm-hit=tb:N79BGBBT1BC90FXXMEBZ+s-N79BGBBT1BC90FXXMEBZ|1753456441353&t:1753456441355&adb:adblk_yes"
        },
        method: "GET"
    });
    const html = await res.text();

    const $ = cheerio.load(html);

    const res2 = await fetch("https://caching.graphql.imdb.com/?operationName=Top250MoviesPagination&variables=%7B%22first%22%3A250%2C%22isInPace%22%3Afalse%2C%22locale%22%3A%22es-ES%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22sha256Hash%22%3A%222db1d515844c69836ea8dc532d5bff27684fdce990c465ebf52d36d185a187b3%22%2C%22version%22%3A1%7D%7D", {
        "headers": {
            "accept": "application/graphql+json, application/json",
            "content-type": "application/json",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-amzn-sessionid": "147-3462859-0130357",
            "x-imdb-client-name": "imdb-web-next-localized",
            "x-imdb-client-rid": "EHYV87XVQF5SGR8H9B3D",
            "x-imdb-user-country": "ES",
            "x-imdb-user-language": "es-ES",
            "x-imdb-weblab-treatment-overrides": "{}",
            "Referer": "https://www.imdb.com/"
        },
        "body": null,
        "method": "GET"
    });
    const api = await res2.json();
    console.log(api);
    try {
        const jsonData = JSON.parse($('#__NEXT_DATA__').html());
        const nodes = jsonData.props.pageProps.pageData.chartTitles.edges;
        const datos = [];

        nodes.map(el => {
            const info = el.node;
            datos.push({
                id: info.id,
                title: info.titleText.text,
                releaseTear: info.releaseYear.year,
                img: info.primaryImage.url,
                genres: info.titleGenres.genres.map(g => g.genre.text).join(', '),
                rating: {
                    rat: info.ratingsSummary.aggregateRating,
                    count: info.ratingsSummary.voteCount
                },
                clasification: info.certificate?.rating ?? '',
                duration: info.runtime.seconds,
                members: api.data.chartTitles.edges
                    .find(e => e.node.id === info.id)
                    ?.node.principalCredits.map(apiInfo => ({
                        category: apiInfo.category.text,
                        credits: apiInfo.credits.map(c => c.name.nameText)
                    })) ?? []

            });
        });

        // Guardar en nuevo archivo JSON
        fs.writeFile('./resultado.json', JSON.stringify(datos, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
                return;
            }
            console.log('Datos guardados en resultado.json');
        });

    } catch (parseErr) {
        console.error('Error al parsear JSON:', parseErr);
    }


    console.log('fin');
})();
