/**
 * Add `http://` to URL input fields on blur or when Enter is pressed
 */
let addDefaultScheme = (target) => {
	if (target.value.match(/^(?!https?:).+\..+/)) {
		target.value = `https://${target.value}`
	}
}

let urlInputs = document.querySelectorAll('input[type="url"]')

for (let element of urlInputs) {
	element.addEventListener("blur", (event) => {
		addDefaultScheme(event.target)
	})
	element.addEventListener("keydown", (event) => {
		if (event.keyCode == 13) {
			addDefaultScheme(event.target)
		}
	})
}
