require("dotenv").config()

const site = require("#data/site")
const queryFilters = require("#filters/queries")
const Image = require("@11ty/eleventy-img")

const SPOTIFY_CLIENT_TOKEN = require("#data/spotify_token")

// Avatar Dimensions
const size = 400

const getImageOptions = (lookup) => {
	return {
		widths: [size],
		formats: process.env.ELEVENTY_PRODUCTION ? ["avif", "webp", "jpg"] : ["webp", "jpg"],
		urlPath: "/images/built/",
		outputDir: "./_site/images/built/",
		cacheDuration: "1y",
		sharpOptions: {
			quality: 100,
		},
		filenameFormat: (id, src, width, format, options) => {
			return `${String(lookup).toLowerCase()}.${format}`
		},
	}
}

const fetchImageData = (id, url) => {
	if (!url) {
		throw new Error("src property required in `img` shortcode.")
	}

	Image(url, getImageOptions(id)).then(() => {
		// return nothing, even though this returns a promise
	})
}

const storeAlbumCover = async (id, classes = "") => {
	// We know where the images will be
	let fakeUrl = `/images/built/${id}.jpg`
	let metadata = Image.statsByDimensionsSync(fakeUrl, size, size, getImageOptions(id))
	let markup = Image.generateHTML(
		metadata,
		{
			alt: `Album cover for ${id}`,
			class: " [ u-photo ] " + (classes ? `[ ${classes} ] ` : ""),
			loading: "lazy",
			decoding: "async",
		},
		{
			whitespaceMode: "inline",
		}
	)

	return markup
}

const fetchAlbumCoverUrl = async (id) => {
	// TODO
	// const album_request = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
	// 	headers: {
	// 		Authorization: `Bearer ${SPOTIFY_CLIENT_TOKEN()}`,
	// 	},
	// })
	// if (album_request.ok) {
	// 	const album_response = await album_request.json()
	// 	console.log(album_response)
	// 	return album_response.images[0].url
	// }

	return ""
}

module.exports = (eleventyConfig) => {
	let ids

	eleventyConfig.on("beforeBuild", () => {
		ids = new Set()
	})

	eleventyConfig.on("afterBuild", () => {
		let array = Array.from(ids)
		// console.log(`[${queryFilters.getHost(site.url)}] Generating ${array.length} album covers.`)
		for (let id of array) {
			fetchImageData(id, fetchAlbumCoverUrl(id))
		}
	})

	eleventyConfig.addNunjucksAsyncShortcode("album_cover", async (id, classes = "") => {
		ids.add(id)
		return storeAlbumCover(id, classes)
	})
}
