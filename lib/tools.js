const https = require('https');

module.exports = {
    printName(person) {
        return `${person.last}, ${person.first}`;
    },

    loadWeb(person, callback) {
        const url = `https://daynhauhoc.com/`;
        https.get(url, res => {
            var body = "";
            res.setEncoding("UTF-8");
            res.on("data", chuck => {
                body += chuck;
            });
            res.on("end", () => {
                callback(body);
            });
        })
    }
}