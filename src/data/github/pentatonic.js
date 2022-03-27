const EleventyFetch = require("@11ty/eleventy-fetch")

module.exports = async () => {
	let url = "https://api.github.com/repos/chrisburnell/pentatonic"
	let json = await EleventyFetch(url, {
		duration: "1w",
		type: "json",
	})

	return json
}
