(() => {
	"use strict";

	const inputValues = document.querySelector("#input-values");
	const inputCurve = document.querySelector("#input-curve");
	const inputEndpoint = document.querySelector("#input-endpoint");
	const inputLineWidth = document.querySelector("#input-line-width");
	const inputColor = document.querySelector("#input-color");
	const inputEndpointColor = document.querySelector("#input-endpoint-color");
	const customSparkline = document.querySelector("#sparkline");

	// strip non-numbers from the input
	inputValues.value = inputValues.value.replace(/(?![0-9])./gim, "");

	// set attributes of the custom sparkline
	customSparkline.setAttribute("curve", inputCurve.checked);
	customSparkline.setAttribute("endpoint", inputEndpoint.checked);
	customSparkline.setAttribute("line-width", inputLineWidth.value);
	customSparkline.setAttribute("color", inputColor.value);
	customSparkline.setAttribute("endpoint-color", inputEndpointColor.value);
	customSparkline.setAttribute("values", inputValues.value.split(""));
})();
