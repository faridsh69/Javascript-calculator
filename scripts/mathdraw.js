var iFrame = null;

var iniX = 450;
var iniY = 180;

var gWidth = 400;
var gHeight = 400;

var rangoX = {min: -5, max: 5};
var rangoY = {min: -5, max: 5};

var escalaX = gWidth / (rangoX.max - rangoX.min);

var escalaY = gHeight / (rangoY.max - rangoY.min);

var xAxis = rangoX.min * (-1) * escalaX;
var yAxis = rangoY.max * escalaY;

var parser = new SintacticParser();

var ancho = 4;

var lastPoint = null;

var arrayDivs = new Array();

var arrayFunctions = new Array();

var rgbColor = {red: 255, green: 0, blue: 0, getColor: function() {
																	var strRed = this.red.toString(16);

																	if (strRed.length == 1) {
																		strRed = '0' + strRed;
																	}

																	var strGreen = this.green.toString(16);

																	if (strGreen.length == 1) {
																		strGreen = '0' + strGreen;
																	}

																	var strBlue = this.blue.toString(16);

																	if (strBlue.length == 1) {
																		strBlue = '0' + strBlue;
																	}

																	return '#' + strRed + strGreen + strBlue}};

var defFunction = null;

function drawGraphicTable() {

	iFrame = document.createElement("iframe");

	iFrame.frameBorder = 0;
	iFrame.style.position="absolute";
	iFrame.style.display="block";
	iFrame.style.border = '1px double black';

	document.body.appendChild(iFrame);

	iFrame.style.posTop = iniY;
	iFrame.style.posLeft = iniX;
	iFrame.style.posWidth = gWidth;
	iFrame.style.posHeight = gHeight;

	document.getElementById('anchoLinea').innerHTML = ancho;

	document.getElementById('rangoXMin').innerHTML = rangoX.min;
	document.getElementById('rangoXMax').innerHTML = rangoX.max;
	document.getElementById('rangoYMin').innerHTML = rangoY.min;
	document.getElementById('rangoYMax').innerHTML = rangoY.max;

	var colorTD = document.getElementById('colorTD');
	
	colorTD.style.background = rgbColor.getColor();
	colorTD.style.borderStyle = 'double';
	colorTD.style.borderColor = 'black';
	colorTD.style.borderWidth = '5px';

	document.getElementById('redInput').value = rgbColor.red;
	document.getElementById('greenInput').value = rgbColor.green;
	document.getElementById('blueInput').value = rgbColor.blue;

	drawAxis();
	
	document.getElementById('sizeX').value = gWidth;
	document.getElementById('sizeY').value = gHeight;
}

function clearTable() {

	for (var i = 0; i < arrayDivs.length; i++) {
		document.body.removeChild(arrayDivs[i]);
	}
	
	arrayDivs.length = 0;

	escalaX = gWidth / (rangoX.max - rangoX.min);

	escalaY = gHeight / (rangoY.max - rangoY.min);

	xAxis = rangoX.min * (-1) * escalaX;
	yAxis = rangoY.max * escalaY;

	drawAxis();

	document.getElementById('defFunction').value = '';

	document.getElementById('clearButton').disabled = true;

	disableFunctionButtons();

	arrayFunctions.length = 0;

}


function drawPoint(x, y) {
	if (lastPoint == null) {
		drawPixel(iniX + x, iniY + y, rgbColor.getColor(), ancho);
	} else {
		drawLine(iniX + lastPoint.x, iniY + lastPoint.y, iniX + x, iniY + y, rgbColor.getColor(), ancho);
	}

	lastPoint = {x: x, y: y};
}

function drawAxis() {
	drawLine(iniX + 1, yAxis + iniY, gWidth + iniX + 1, yAxis + iniY, 'black', 3);
	drawLine(xAxis + iniX, iniY + 1, xAxis + iniX, gHeight + iniY, 'black', 3);
	
	var pointX = 0;

	for (var i = 0; i < (rangoX.min * (-1)) - 1; i++) {
		pointX += escalaX;

		drawLine(pointX + iniX, yAxis + iniY - 5, pointX + iniX, yAxis + iniY + 6, 'black', 3);
		drawLine(pointX + iniX, iniY, pointX + iniX, gHeight + iniY, 'black', 1);
	}

	pointX = xAxis;

	for (var i = 0; i < rangoX.max - 1; i++) {
		pointX += escalaX;

		drawLine(pointX + iniX, yAxis + iniY - 5, pointX + iniX, yAxis + iniY + 6, 'black', 3);
		drawLine(pointX + iniX, iniY, pointX + iniX, gHeight + iniY, 'black', 1);
	}

	var pointY = 0;

	for (var i = 0; i < rangoY.max - 1; i++) {
		pointY += escalaY;

		drawLine(xAxis + iniX - 5, pointY + iniY, xAxis + iniX + 6, pointY + iniY, 'black', 3);
		drawLine(iniX, pointY + iniY, gWidth + iniX, pointY + iniY, 'black', 1);
	}

	pointY = yAxis;

	for (var i = 0; i < (rangoY.min * (-1)) - 1; i++) {
		pointY += escalaY;

		drawLine(xAxis + iniX - 5, pointY + iniY, xAxis + iniX + 6, pointY + iniY, 'black', 3);
		drawLine(iniX, pointY + iniY, gWidth + iniX, pointY + iniY, 'black', 1);
	}
}

function getXPixel(xValue) {

	return (xValue - rangoX.min) * escalaX;
}

function getYPixel(yValue) {

	return Math.round((rangoY.max - yValue) * escalaY);
}

function getXValue(xPixel) {
	return (xPixel / escalaX) + rangoX.min;
}

function getYValue(yPixel) {

	return rangoY.max - (yPixel / escalaY);
}

function createFunction() {

	var elemFunction = document.getElementById('defFunction');

	var textFunction = elemFunction.value;

	if (textFunction.length == 0) {
		document.getElementById('errorMessage').innerHTML = 'Ingrese una expresión matemática para que sea evaluada.';
		disableFunctionButtons();
		elemFunction.focus();
	} else {

		defFunction = parser.parseExpresion(textFunction);

		if (defFunction == null) {
			document.getElementById('errorMessage').innerHTML = parser.errorMessage;
			disableFunctionButtons();
			elemFunction.select();
			elemFunction.focus();
		} else {
			enableFunctionButtons();
		}
	}
}

function drawFunction() {

	lastPoint = null;

	var error = false;

	var parameters = new ArrayParameters();

	var variables = defFunction.getVariables();

	var param = new Parameter('x', 0);

	if (variables.length > 1) {

		document.getElementById('errorMessage').innerHTML = 'No es posible graficar expresiones con más de una variable.';

	} else {

		if (variables.length == 1) {
			param.setName(variables[0]);
			parameters.addParameter(param);
		}

		var parcialErrorMessage = '';

		var drawing = false;

		for (var i = parseInt(ancho/2) + 1; i < gWidth - parseInt(ancho/2) + 1 && !error; i++) {

			var xVal = getXValue(i);

			param.setValue(xVal);

			var yVal = defFunction.eval(parameters);

			if (isNaN(yVal)) {
				if (yVal != 'DOMINIO_INVALIDO' && yVal != 'DIVISION_X_ZERO') {
					document.getElementById('errorMessage').innerHTML = yVal;
					error = true;
				} else {
					parcialErrorMessage = yVal;
				}
				lastPoint = null;
			} else {

				var pixelY = getYPixel(yVal);

				if (pixelY > parseInt(ancho/2) + 1 && pixelY < gHeight - parseInt(ancho/2)) {

					drawing = true;

					drawPoint(i, pixelY);

				} else {
					lastPoint = null;
				}
			}
		}

		if (parcialErrorMessage.length > 0 && !drawing) {

			document.getElementById('errorMessage').innerHTML = parcialErrorMessage;

		} else {

			if (!error) {
				document.getElementById('clearButton').disabled = false;

				arrayFunctions.push({func: defFunction, color: {red: rgbColor.red, green: rgbColor.green, blue: rgbColor.blue}, ancho: ancho});

			}
		}

	}
}

function derive() {

	var elemFunction = document.getElementById('defFunction');

	var variables = defFunction.getVariables();

	var variable = 'X';

	if (variables.length > 0) {
		variable = variables[0];
	}

	defFunction = defFunction.derive(variable);

	elemFunction.value = defFunction.toString();
}

function enableFunctionButtons() {
	document.getElementById('drawButton').disabled = false;
	document.getElementById('deriveButton').disabled = false;
	document.getElementById('saveButton').disabled = false;
	document.getElementById('simplifyButton').disabled = false;
}

function disableFunctionButtons() {
	document.getElementById('drawButton').disabled = true;
	document.getElementById('deriveButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	document.getElementById('simplifyButton').disabled = true;
}

function disableButtons() {
	document.getElementById('defFunction').disabled = true;
	disableFunctionButtons();
	document.getElementById('clearButton').disabled = true;
	document.getElementById('reSizeButton').disabled = false;
}

function reSize() {

	gWidth = parseInt(document.getElementById('sizeX').value);
	gHeight = parseInt(document.getElementById('sizeY').value);

	for (var i = 0; i < arrayDivs.length; i++) {
		document.body.removeChild(arrayDivs[i]);
	}

	arrayDivs.length = 0;

	escalaX = gWidth / (rangoX.max - rangoX.min);

	escalaY = gHeight / (rangoY.max - rangoY.min);

	xAxis = rangoX.min * (-1) * escalaX;
	yAxis = rangoY.max * escalaY;

	iFrame.style.posWidth = gWidth;
	iFrame.style.posHeight = gHeight;

	drawAxis();

	var funcs = new Array();

	for (var i = 0; i < arrayFunctions.length; i++) {
		funcs.push(arrayFunctions[i]);
	}
	
	arrayFunctions.length = 0;
	
	var anchoActual = ancho;
	
	var rgbActual = {red: rgbColor.red, green: rgbColor.green, blue: rgbColor.blue};
	
	for (var i = 0; i < funcs.length; i++) {
		defFunction = funcs[i].func;
		rgbColor.red = funcs[i].color.red;
		rgbColor.green = funcs[i].color.green;
		rgbColor.blue = funcs[i].color.blue;
		ancho = funcs[i].ancho;
		drawFunction();
	}

	document.getElementById('defFunction').disabled = false;

	document.getElementById('reSizeButton').disabled = true;

	createFunction();
	
	rgbColor.red = rgbActual.red;
	rgbColor.green = rgbActual.green;
	rgbColor.blue = rgbActual.blue;
	
	ancho = anchoActual;
}

function filterNumber(e) {
	var key = (document.all) ? e.keyCode : e.which;
	
	return ((key == 8) || (key == 0) || (key >= 48 && key <= 57));
}

function changeColor(e) {
	var elemento = (document.all) ? e.srcElement : e.target;

	if (elemento.value == '') {
		elemento.value = 0;
	} else if (elemento.value > 255) {
		elemento.value = 255;
	} else {
		elemento.value = parseInt(elemento.value, 10);
	}

	rgbColor.red = parseInt(document.getElementById('redInput').value, 10);
	rgbColor.green = parseInt(document.getElementById('greenInput').value, 10);
	rgbColor.blue = parseInt(document.getElementById('blueInput').value, 10);

	document.getElementById('colorTD').style.background = rgbColor.getColor();
}

function save() {

	var repoTable = document.getElementById('repositoryTable');

	var nrow = repoTable.insertRow(repoTable.rows.length);

	var ncol = nrow.insertCell(nrow.cells.length);

	ncol.style.color = 'blue';

	ncol.style.fontWeight = 'bold';

	if (window.addEventListener) {
		ncol.addEventListener('mouseover', changeBackgroundOver, false);
		ncol.addEventListener('mouseout', changeBackgroundOut, false);
		ncol.addEventListener('click', reviewFunction, false);
	} else {
		ncol.attachEvent('onmouseover', changeBackgroundOver);
		ncol.attachEvent('onmouseout', changeBackgroundOut);
		ncol.attachEvent('onclick', reviewFunction);
	}

	ncol.innerHTML = defFunction.toString();

}


function changeBackgroundOver(e) {
	var elemento = (document.all) ? e.srcElement : e.target;

	elemento.style.color = 'red';
	elemento.style.cursor = 'pointer';
}

function changeBackgroundOut(e) {
	var elemento = (document.all) ? e.srcElement : e.target;

	elemento.style.color = 'blue';
}

function reviewFunction(e) {
	if (document.getElementById('reSizeButton').disabled) {
		var elemFunction = document.getElementById('defFunction');

		var elemento = (document.all) ? e.srcElement : e.target;

		elemFunction.value = elemento.innerHTML;

		createFunction();
	}
}

function simplify() {
	var elemFunction = document.getElementById('defFunction');

	defFunction = defFunction.simplify();

	elemFunction.value = defFunction.toString();
}

