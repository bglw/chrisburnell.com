const author = require("#data/author")
const colors = require("#data/designTokens/colors")
const site = require("#data/site")
const dateFilters = require("#filters/dates")
const utilityFilters = require("#filters/utils")

module.exports = {
	sparkline: (collection, start, end) => {
		let values = []
		let count = 0
		// Loop through years
		for (let i = parseFloat(start); i <= parseFloat(end); i++) {
			// Loop through collection comparing Year
			for (let item of collection) {
				if (i === parseFloat(dateFilters.friendlyDate(item.date, "yyyy"))) {
					count++
				}
			}
			values.push(count)
			count = 0
		}
		// Calculate simple moving average of each value, preserve head and tail
		let normalized = utilityFilters.simpleMovingAverage(values, 3, true)
		// Sparklines in A minor
		return `<spark-line values="${normalized.join(",")}"
							original="${values.join(",")}"
							endpoint-color="${colors.maple}"
							${start ? 'start-label="' + start + '"' : ""}
							${end ? 'end-label="' + end + '"' : ""}
							key-start="25"
							key-intervals="2,1,2,2,1,2,2"
							key-limit="${site.limits.sparkline}"
							line-width="1.5"
							class=" [ pentatonic ] "
							title="Click to hear me!"></spark-line>`
	},
}
