function Token(id, value) {
	this.id = id;
	this.value = value;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getValue = function() {
		return value;
	}
	
	this.toString = function() {
		if (this.id == Token.EOF) {
			return "EOF";
		} else if (this.id == Token.ERROR) {
			return 'ERROR{' + this.value + '}';
		} else {
			return this.value + '(' + this.id + ')';
		}
	}
}

Token.SUMA = 1;
Token.RESTA = 2;
Token.PRODUCTO = 3;
Token.DIVISION = 4;
Token.POTENCIA = 5;
Token.PREDEFINED_FUNCTION = 6;
Token.CONSTANTE = 7;
Token.NUMERO = 8;
Token.VARIABLE = 9;
Token.PARENTESIS_ABIERTO = 10;
Token.PARENTESIS_CERRADO = 11;
Token.SEPARADOR_PARAMETROS = 12;
Token.EOF = 13;
Token.ERROR = 14;

function LexParser() {
	this.exp = '';
	this.index = 0;
	
	this.predefinedFunctions = ['LN', 'COS', 'SIN', 'TAN', 'COT', 'NEG', 'ACOS', 'ASIN', 'ATAN', 'ACOT', 'EXP', 'SEC', 'COSEC', 'ASEC', 'ACOSEC'];
	
	this.constants = ['PI', 'E'];
}

LexParser.prototype.getActualExpresionParsed = function() {
	return this.exp.substring(0, this.index);
}

LexParser.prototype.setExpresion = function(exp) {
	this.exp = exp;
	this.index = 0;
}

LexParser.prototype.hasMoreTokens = function() {
	return (this.index < this.exp.length);
}

LexParser.prototype.isPredefinedFunction = function(fun) {
	var found = false;
	for (var i = 0; i < this.predefinedFunctions.length && !found; i++) {
		if (fun.toUpperCase() == this.predefinedFunctions[i]) {
			found = true;
		}
	}
	
	return found;
}

LexParser.prototype.isConstant = function(c) {
	var found = false;
	for (var i = 0; i < this.constants.length && !found; i++) {
		if (c.toUpperCase() == this.constants[i]) {
			found = true;
		}
	}
	
	return found;
}

LexParser.prototype.isDigit = function(car) {
	var charCode = car.charCodeAt(0);
	return (charCode >= 48 && charCode <= 57);
}

LexParser.prototype.isLetter = function(car) {
	var charCode = car.toUpperCase().charCodeAt(0);
	return (charCode >= 65 && charCode <= 90);
}


LexParser.prototype.nextToken = function() {
	var numeric = false;
	
	var strValue = '';

	var token = 0;
	
	while (true) {
	
		if (this.hasMoreTokens()) {
		
			var car = this.exp.charAt(this.index);
			
			if (car == ' ') {
				this.index++;
				if (strValue.length > 0) {
					break;
				}
			} else if (this.isDigit(car) || car == '.') {
				if (strValue.length > 0) {
					if (numeric) {
						strValue = new String(strValue) + new String(car);
						this.index++;
					} else {
						break;
					}
				} else {
					strValue = car;
					numeric = true;
					token = Token.NUMERO;
					this.index++;
				}
			} else if (this.isLetter(car)) {
				if (strValue.length > 0) {
					if (numeric) {
						break;
					} else {
						strValue += car.toUpperCase();
						if (this.isPredefinedFunction(strValue)) {
							token = Token.PREDEFINED_FUNCTION;
						} else if (this.isConstant(strValue)) {
							token = Token.CONSTANTE;
						} else {
							token = Token.VARIABLE;
						}
						this.index++;
					}
				} else {
					strValue = car.toUpperCase();
					numeric = false;
					if (this.isPredefinedFunction(strValue)) {
						token = Token.PREDEFINED_FUNCTION;
					} else if (this.isConstant(strValue)) {
						token = Token.CONSTANTE;
					} else {
						token = Token.VARIABLE;
					}
					this.index++;
				}
			} else if (car == '+' || car == '-' || car == ',' || car == '*' || car == '/' || car == '^' || car == '(' || car == ')') {
				if (strValue.length > 0) {
					break;
				} else {
					strValue = car;
					
					if (car == '+') {
						token = Token.SUMA;
					} else if (car == '-') {
						token = Token.RESTA;
					} else if (car == '*') {
						token = Token.PRODUCTO;
					} else if (car == '/') {
						token = Token.DIVISION;
					} else if (car == '^') {
						token = Token.POTENCIA;
					} else if (car == ',') {
						token = Token.SEPARADOR_PARAMETROS;
					} else if (car == '(') {
						token = Token.PARENTESIS_ABIERTO;
					} else if (car == ')') {
						token = Token.PARENTESIS_CERRADO;
					}
					
					this.index++;
					break;
				}
			} else {

				strValue = car;
				token = Token.ERROR;
			}
		
		} else {
			if (strValue.length == 0) {
				token = Token.EOF;
			}
			break;
		}
	}
	
	return new Token(token, strValue);
}
