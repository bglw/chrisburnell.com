const CacheAsset = require("@11ty/eleventy-cache-assets")

// Load .env variables with dotenv
require("dotenv").config()

const API_ORIGIN = process.env.PERSONAL_API_URL
const TOKEN = process.env.WEBMENTION_IO_TOKEN
const TYPES = ["breweries", "gamePublishers", "humans", "meetups", "musicArtists", "publications"]

async function getPeopleByType(type) {
    return await CacheAsset(`${API_ORIGIN}/${type}.json?token=${TOKEN}`, {
        duration: "4w",
        type: "json",
        fetchOptions: {
            method: "GET"
        }
    })
}

module.exports = async function() {
    let people = []

    for (let type of TYPES) {
        let lookup = await getPeopleByType(type)
        people = [...people, ...lookup]
    }

    console.log(`Wrote ${people.length} people to cache.`)

    return people
}
