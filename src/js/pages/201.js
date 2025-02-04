;(function () {
	"use strict"

	let getParameterByName = (name) => {
		const regex = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search)
		return regex && decodeURIComponent(regex[1].replace(/\+/g, " "))
	}

	let targetURL = getParameterByName("query") ? getParameterByName("query") : getParameterByName("q") ? getParameterByName("q") : getParameterByName("t") ? getParameterByName("t") : null

	if (targetURL) {
		const targetURLCheck = () => {
			fetch(targetURL + "?q=" + +new Date()).then((response) => {
				let targetURL = response.url.split("?q=")[0]
				document.querySelector("#target-url").innerHTML = '<a href="' + targetURL + '">' + targetURL + "</a>"
				console.log("Checking … " + targetURL)
				if (response.status == 200) {
					window.location.href = targetURL
				} else {
					console.log("Returned failing response … " + response.status)
				}
			})
			setTimeout(targetURLCheck, 10000)
		}
		targetURLCheck()
		setTimeout(targetURLCheck, 10000)
	}

	let title = document.querySelector(".title .p-name")
	let titleText = title.innerHTML
	let dots
	let inputCheck = setInterval(() => {
		dots = (title.innerHTML.match(/\./g) || []).length
		if (dots == 3) {
			title.innerHTML = titleText
		} else {
			dots++
			title.innerHTML = titleText + ".".repeat(dots)
		}
	}, 1000)
})()
