const fs = require('fs');

const fetchIMDB = async () => {
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

    const html = await res.text(); // <- aquí extraes el contenido como texto
    return html;
}

// Ejecutar y mostrar resultado
fetchIMDB().then(html => {
    console.log(html); // Aquí ves el contenido HTML de la página
}).catch(err => {
    console.error("Error al hacer la petición:", err);
});


fs.readFile('./Untitled-1.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
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
                duration: info.runtime.seconds
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
});
