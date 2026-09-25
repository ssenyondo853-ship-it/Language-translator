const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    // Allow your website to communicate with the server
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Test the server
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            message: "LocalTranslate server is working!"
        }));
        return;
    }

    // Translation
    if (req.method === "POST" && req.url === "/api/translate") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {
                const { text, language } = JSON.parse(body);

                if (!text || !language) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        error: "Text and language are required"
                    }));

                    return;
                }

                // MyMemory language codes
                const languageCodes = {
                    Luganda: "lg",
                    Swahili: "sw"
                };

                const targetLanguage = languageCodes[language];

                if (!targetLanguage) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        error: "This language is not supported yet"
                    }));

                    return;
                }

                const url =
                    "https://api.mymemory.translated.net/get?q=" +
                    encodeURIComponent(text) +
                    "&langpair=en|" +
                    targetLanguage;

                const response = await fetch(url);
                const data = await response.json();

                const translation =
                    data.responseData?.translatedText;

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    translation: translation || "Translation unavailable"
                }));

            } catch (error) {

                console.error(error);

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Translation failed"
                }));
            }
        });

        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Not found"
    }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`LocalTranslate server running on port ${PORT}`);
});
