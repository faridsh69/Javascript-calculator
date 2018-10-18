function Stack() {
	this.stack = [];
}


Stack.prototype.push = function(element) {
	this.stack.push(element);
}

Stack.prototype.pop = function() {
	return this.stack.pop();
}


function SintacticParser() {
	this.lexParser = new LexParser();
	
	this.stack = new Stack();
	
	this.token = null;
	
	this.errorMessage = '';
}

SintacticParser.prototype.getActualExpresionParsed = function() {
	return this.lexParser.getActualExpresionParse();
}


SintacticParser.prototype.parseExpresion = function(exp) {
	this.lexParser.setExpresion(exp);
	
	this.token = this.lexParser.nextToken();
	
	if (this.token.getId() != Token.EOF) {
		
		if (this.parseFactor()) {
			if (this.parseRestoPotencia()) {
				if (this.parseRestoTermino()) {
					if (this.parseRestoExpresion()) {

						if (this.token.getId() != Token.EOF) {
							this.errorMessage = 'Se esperaba el final de la expresión.';
							return null;
						}

						return this.stack.pop();
					}
				}
			}
		}
	
	}

	return null;	
}


SintacticParser.prototype.parseRestoExpresion = function() {
	
	if (this.token.getId() == Token.SUMA) {
		this.token = this.lexParser.nextToken();
		
		var valid = this.parseFactor();
		
		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			valid = this.parseRestoTermino();
		}

		if (valid) {
			valid = this.parseRestoExpresion();
		}

		if (valid) {
			var exp2 = this.stack.pop();
			var exp1 = this.stack.pop();
			
			var exp = new MatSuma(exp1, exp2);
			
			this.stack.push(exp);
		} else {
			return false;
		}

	} else if (this.token.getId() == Token.RESTA) {

		this.token = this.lexParser.nextToken();
		
		var valid = this.parseFactor();
		
		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			valid = this.parseRestoTermino();
		}

		if (valid) {
			valid = this.parseRestoExpresion();
		}

		if (valid) {
			var exp2 = this.stack.pop();
			var exp1 = this.stack.pop();
			
			var exp = new MatResta(exp1, exp2);
			
			this.stack.push(exp);
		} else {
			return false;
		}

	}
	
	return true;
}


SintacticParser.prototype.parseRestoTermino = function() {

	if (this.token.getId() == Token.PRODUCTO) {
		this.token = this.lexParser.nextToken();
		
		var valid = this.parseFactor();
		
		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			valid = this.parseRestoTermino();
		}

		if (valid) {
			var exp2 = this.stack.pop();
			var exp1 = this.stack.pop();
			
			var exp = new MatProducto(exp1, exp2);
			
			this.stack.push(exp);
		} else {
			return false;
		}

	} else if (this.token.getId() == Token.DIVISION) {

		this.token = this.lexParser.nextToken();
		
		var valid = this.parseFactor();
		
		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			valid = this.parseRestoTermino();
		}

		if (valid) {
			var exp2 = this.stack.pop();
			var exp1 = this.stack.pop();
			
			var exp = new MatDivision(exp1, exp2);
			
			this.stack.push(exp);
		} else {
			return false;
		}

	}
	
	return true;

}


SintacticParser.prototype.parseRestoPotencia = function() {

	if (this.token.getId() == Token.POTENCIA) {
		this.token = this.lexParser.nextToken();
		
		var valid = this.parseFactor();
		
		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			var exp2 = this.stack.pop();
			var exp1 = this.stack.pop();
			
			var exp = new MatPotencia(exp1, exp2);
			
			this.stack.push(exp);
		} else {
			return false;
		}
	} 
	
	return true;

}


SintacticParser.prototype.parseFactor = function() {

	if (this.token.getId() == Token.NUMERO) {

		var exp = new MatNumber(this.token.getValue());
		
		this.stack.push(exp);
		
		this.token = this.lexParser.nextToken();
		
		return true;

	} else if (this.token.getId() == Token.CONSTANTE) {

		var constName = this.token.getValue();

		var constValue = 0;

		if (constName == 'PI') {
			constValue = Math.PI;
		} else if (constName == 'E') {
			constValue = Math.E;
		}

		var exp = new MatNumber(constValue);
		
		this.stack.push(exp);
		
		this.token = this.lexParser.nextToken();
		
		return true;

	} else if (this.token.getId() == Token.PREDEFINED_FUNCTION) {
	
		var funName = this.token.getValue();
		
		this.token = this.lexParser.nextToken();
		
		if (this.token.getId() != Token.PARENTESIS_ABIERTO) {
			
			this.errorMessage = 'Error de sintaxis - Se esperaba (';
			
			return false;
			
		} else {
		
			this.token = this.lexParser.nextToken();
			
			var valid = this.parseFactor();

			if (valid) {
				valid = this.parseRestoPotencia();
			}

			if (valid) {
				valid = this.parseRestoTermino();
			}

			if (valid) {
				valid = this.parseRestoExpresion();
			}
			
			if (valid) {

				if (this.token.getId() != Token.PARENTESIS_CERRADO) {

					this.errorMessage = 'Error de sintaxis - Se esperaba )';

					return false;

				} else {
				
					this.token = this.lexParser.nextToken();
			
					var expInterna = this.stack.pop();

					var exp = null; 

					if (funName == 'LN') {
						
						exp = new MatLogNatural(expInterna); 

					} else if (funName == 'SIN') {

						exp = new MatSeno(expInterna); 

					} else if (funName == 'COS') {

						exp = new MatCoseno(expInterna); 

					} else if (funName == 'TAN') {

						exp = new MatTangente(expInterna); 

					} else if (funName == 'NEG') {

						exp = new MatNegativo(expInterna); 

					} else if (funName == 'EXP') {

						exp = new MatExponencial(expInterna); 

					} else if (funName == 'COT') {

						exp = new MatCotangente(expInterna); 

					} else if (funName == 'ACOT') {

						exp = new MatArcoCotangente(expInterna); 

					} else if (funName == 'ACOS') {

						exp = new MatArcoCoseno(expInterna); 

					} else if (funName == 'ASIN') {

						exp = new MatArcoSeno(expInterna); 

					} else if (funName == 'ATAN') {

						exp = new MatArcoTangente(expInterna); 

					} else if (funName == 'SEC') {

						exp = new MatSecante(expInterna); 

					} else if (funName == 'COSEC') {

						exp = new MatCosecante(expInterna); 

					} else if (funName == 'ASEC') {

						exp = new MatArcoSecante(expInterna); 

					} else if (funName == 'ACOSEC') {

						exp = new MatArcoCosecante(expInterna); 
					} 
					
					this.stack.push(exp);
					
					return true;
				}
			
			} else {
			
				return false;
			}
		}
		
	} else if (this.token.getId() == Token.PARENTESIS_ABIERTO) {

		this.token = this.lexParser.nextToken();

		var valid = this.parseFactor();

		if (valid) {
			valid = this.parseRestoPotencia();
		}

		if (valid) {
			valid = this.parseRestoTermino();
		}

		if (valid) {
			valid = this.parseRestoExpresion();
		}

		if (valid) {

			if (this.token.getId() != Token.PARENTESIS_CERRADO) {

				this.errorMessage = 'Error de sintaxis - Se esperaba )';

				return false;

			} else {
				
				this.token = this.lexParser.nextToken();
				
				return true;
			}
		}

	} else if (this.token.getId() == Token.VARIABLE) {
	
		var exp = new MatVariable(this.token.getValue());
		
		this.stack.push(exp);
		
		this.token = this.lexParser.nextToken();
		
		return true;
	
	} else if (this.token.getId() == Token.RESTA) {

		this.token = this.lexParser.nextToken();

		var valid = this.parseFactor();

		if (valid) {
		
			var exp = new MatNegativo(this.stack.pop());

			this.stack.push(exp);
		
		}
		
		return valid;
		
	} else if (this.token.getId() == Token.ERROR) {
		
		this.errorMessage = 'Token erróneo, error léxico - ' + this.token.getValue();
		
		return false;
		
	} else {
	
		this.errorMessage = 'Token no esperado: Token Recibido --> ' + this.token.getValue() + ' - Token esperado --> ( VARIABLE, FUNCION_NAME o NUMBER )';
	
		return false;
	}

}


