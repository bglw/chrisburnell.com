const EleventyFetch = require("@11ty/eleventy-fetch")

module.exports = async () => {
	let url = "https://api.npmjs.org/downloads/point/last-month/@chrisburnell/eleventy-cache-webmentions"
	let json = await EleventyFetch(url, {
		duration: "1w",
		type: "json",
	})

	return json
}
