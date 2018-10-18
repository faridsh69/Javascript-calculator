/**
 * Objeto que representa un parametro para evaluar una expresión matemática.
 **/
//------------------------------------------------------------------------------------------------------
function Parameter(name, value) {
	this.name = name.toUpperCase();
	this.value = value;
}

Parameter.prototype.setName = function(name) {
	this.name = name;
}

Parameter.prototype.getName = function() {
	return this.name;
}

Parameter.prototype.setValue = function(value) {
	this.value = value;
}

Parameter.prototype.getValue = function() {
	return this.value;
}

Parameter.prototype.toString = function() {
	return '{ name: ' + this.getName() + ', value: ' + this.getValue() + '}';
}

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una array de parametros para evaluar una expresión matemática
 **/
//------------------------------------------------------------------------------------------------------
function ArrayParameters(params) {
	this.params = new Array();


	this.init(params);

}

ArrayParameters.prototype.clear = function() {
	this.params.length = 0;
}

ArrayParameters.prototype.init = function(params) {
	if (params != null) {
		for (var i = 0; i < params.length; i++) {
			this.addParameter(params[i]);
		}
	}
}

ArrayParameters.prototype.addParameter = function(parameter) {
		var p = null;
		
		if (parameter instanceof Parameter) {
			p = parameter;
		} else {
			if (parameter.name != null && parameter.value != null) {
				p = new Parameter(parameter.name, parameter.value);
			}
		}
		
		if (p != null) {
			if (!this.foundParameter(p.getName())) {
				this.params.push(p);
			}
		}
}

ArrayParameters.prototype.getParameter = function(name) {
		var found = false;
		
		var parameter = null;
		
		for (var i = 0; i < this.params.length && !found; i++) {
			parameter = this.params[i];
			
			if (parameter.name == name.toUpperCase()) {
				found = true;
			}
		}
		
		if (!found) {
			parameter = null;
		}
		
		return parameter;
}

ArrayParameters.prototype.foundParameter = function(name) {
		var found = false;
		
		for (var i = 0; i < this.params.length && !found; i++) {
			var parameter = this.params[i];
			
			if (parameter.getName() == name.toUpperCase()) {
				found = true;
			}
		}
		
		return found;
}

ArrayParameters.prototype.toString = function() {
		var str = '(';
		
		for (var i = 0; i < this.params.length; i++) {
			var parameter = this.params[i];
			
			str += parameter.toString();
			
			if (i < this.params.length - 1) {
				str += ', ';
			}
		}
		
		str += ')';
		
		return str;
}


function MatExpresion() {
}

MatExpresion.prototype.equals = function(exp) {
	if (this.constructor == exp.constructor) {
		return this.equalsContained(exp);
	}
	
	return false;
}

MatExpresion.prototype.equalsContained = function(exp) {
	return true;	
}


/**
 * Objeto que representa un NUMBER dentro de una expresión matemática.
 **/

MatNumber.prototype = new MatExpresion();
MatNumber.prototype.constructor = MatNumber;

//------------------------------------------------------------------------------------------------------
function MatNumber(value) {
	this.value = parseFloat(value);

	this.equalsContained = function(exp) {
		return this.value == exp.getValue();
	}

}

MatNumber.prototype.getValue = function() {
	return this.value;
}

MatNumber.prototype.eval = function(parameters) {
	return this.value;
}

MatNumber.prototype.toString = function() {
	return this.value.toString();
}

MatNumber.prototype.derive = function(diferencial) {
	return new MatNumber(0);
}

MatNumber.prototype.getVariables = function() {
	return [];
}

MatNumber.prototype.isNumber = function() {
	return true;
}

MatNumber.prototype.simplify = function() {
	return this;
}

//------------------------------------------------------------------------------------------------------


/**
 * Objeto que representa una VARIABLE dentro de una expresión matemática.
 **/

MatVariable.prototype = new MatExpresion();
MatVariable.prototype.constructor = MatVariable;

//------------------------------------------------------------------------------------------------------
function MatVariable(name) {
	this.name = name.toUpperCase();

	this.equalsContained = function(exp) {
		return this.name == exp.getName();
	}

}

MatVariable.prototype.getName = function() {
	return this.name;
}

MatVariable.prototype.eval = function(parameters) {
	if (parameters != null && parameters.foundParameter(this.name)) {

		var param = parameters.getParameter(this.name);
		
		return param.getValue();
	} else {
		return 'MatVariable: Error de evaluación (El parámetro no existe)';
	}
}

MatVariable.prototype.toString = function() {
	return this.name;
}

MatVariable.prototype.derive = function(diferencial) {
	if (diferencial != null && this.name == diferencial.toUpperCase()) {
		return new MatNumber(1);
	} else {
		return new MatNumber(0);
	}
}

MatVariable.prototype.getVariables = function() {
	return [this.name];
}

MatVariable.prototype.isNumber = function() {
	return false;
}

MatVariable.prototype.simplify = function() {
	return this;
}

//------------------------------------------------------------------------------------------------------

function MatOperator() {}

MatOperator.SUMA = '+';
MatOperator.RESTA = '-';
MatOperator.PRODUCTO = '*';
MatOperator.DIVISION = '/';
MatOperator.POTENCIA = '^';

/**
 * Objeto que representa una expresion compuesta
 **/

MatComposedExpresion.prototype = new MatExpresion();
MatComposedExpresion.prototype.constructor = MatComposedExpresion;

//------------------------------------------------------------------------------------------------------
function MatComposedExpresion() {

	this.equalsContained = function(exp) {
		return this.firstExpresion.equals(exp.getFirstExpresion()) &&
		       this.lastExpresion.equals(exp.getLastExpresion()) &&
		       this.operator == exp.getOperator();
	}
}

MatComposedExpresion.prototype.init = function(exp1, exp2, operator) {
	this.firstExpresion = exp1; 
	this.lastExpresion = exp2;
	this.operator = operator;
}

MatComposedExpresion.prototype.getFirstExpresion = function() {
	return this.firstExpresion;
}

MatComposedExpresion.prototype.getLastExpresion = function() {
	return this.lastExpresion;
}

MatComposedExpresion.prototype.getOperator = function() {
	return this.operator;
}

MatComposedExpresion.prototype.eval = function(parameters) {
	var firstValue = this.getFirstExpresion().eval(parameters);

	
	if (isNaN(parseFloat(firstValue))) {
		if (firstValue != 'DOMINIO_INVALIDO' && firstValue != 'DIVISION_X_ZERO') {
			return 'MatComposedExpresion: Error de Evaluación.[' + firstValue + ']';
		}
		return firstValue;
	}
	
	var lastValue = this.getLastExpresion().eval(parameters);

	if (isNaN(parseFloat(lastValue))) {
		if (lastValue != 'DOMINIO_INVALIDO' && lastValue != 'DIVISION_X_ZERO') {
			return 'MatComposedExpresion: Error de Evaluación.[' + lastValue + ']';
		} 
		return lastValue;
	}
	
	if (this.getOperator() == MatOperator.POTENCIA) {
		var aux = Math.pow(firstValue, lastValue);
		
		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		}

		return aux;
		
	} else if (this.getOperator() == MatOperator.DIVISION) {
		if (lastValue == 0.0) {
			return "DIVISION_X_ZERO";
		}
	} 
	
	return eval(firstValue + this.getOperator() + '(' + lastValue + ')');
}

MatComposedExpresion.prototype.toString = function() {
	return '(' + this.getFirstExpresion().toString() + ' ' + this.getOperator() + ' ' +  this.getLastExpresion().toString() + ')';
}

MatComposedExpresion.prototype.getVariables = function() {
	
	var firstVars = this.getFirstExpresion().getVariables();

	var lastVars = this.getLastExpresion().getVariables();

	var addVars = [];
	
	for (var i = 0; i < lastVars.length; i++) {
		var vAdd = lastVars[i];
		
		var found = false;
		
		for (var j = 0; j < firstVars.length && !found; j++) {
			if (firstVars[j] == vAdd) {
				found = true;
			}
		}
		
		if (!found) {
			addVars.push(vAdd);
		}
	}
	
	return firstVars.concat(addVars);
}

MatComposedExpresion.prototype.isNumber = function() {
	return this.getFirstExpresion().isNumber() && this.getLastExpresion().isNumber();
}

//------------------------------------------------------------------------------------------------------

/**
 * MatSuma hereda de MatComposedExpresion
 **/
//------------------------------------------------------------------------------------------------------

MatSuma.prototype = new MatComposedExpresion();
MatSuma.prototype.constructor = MatSuma;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una SUMA de expresiones matemáticas
 **/
//------------------------------------------------------------------------------------------------------
function MatSuma(exp1, exp2) {
	this.init(exp1, exp2, MatOperator.SUMA);

	this.equalsContained = function(exp) {
		return (this.getFirstExpresion().equals(exp.getFirstExpresion()) && this.getLastExpresion().equals(exp.getLastExpresion())) || (this.getFirstExpresion().equals(exp.getLastExpresion()) && this.getLastExpresion().equals(exp.getFirstExpresion()));
	}

	this.derive = function(diferencial) {
		return new MatSuma(this.getFirstExpresion().derive(diferencial), this.getLastExpresion().derive(diferencial));

	}

	this.simplify = function() {
		var simFirst = this.getFirstExpresion().simplify();
		var simLast = this.getLastExpresion().simplify();

		if (simFirst.isNumber() && simLast.isNumber()) {
			var num = simFirst.eval() + simLast.eval();
			
			if (num >= 0) {
				return new MatNumber(num);
			} else {
				return new MatNegativo(new MatNumber(Math.abs(num)));
			}
		} else if (simFirst.isNumber()) {
			var num = simFirst.eval();
			
			if (num == 0.0) {
				return simLast;
			} else {
				return new MatSuma(simFirst, simLast);
			}
		} else if (simLast.isNumber()) {
			var num = simLast.eval();
			
			if (num == 0.0) {
				return simFirst;
			} else {
				return new MatSuma(simFirst, simLast);
			}
		} else {
			
			if (simFirst.equals(simLast)) {
				return new MatProducto(new MatNumber(2), simFirst);
			} else if (new MatNegativo(simFirst).simplify().equals(simLast)) {
				return new MatNumber(0.0);
			} else {
				return new MatSuma(simFirst, simLast);
			}
		}
	
	}
}

//------------------------------------------------------------------------------------------------------


/**
 * MatResta hereda de MatComposedExpresion
 **/
//------------------------------------------------------------------------------------------------------

MatResta.prototype = new MatComposedExpresion();
MatResta.prototype.constructor = MatResta;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una RESTA de expresiones matemáticas
 **/
//------------------------------------------------------------------------------------------------------
function MatResta(exp1, exp2) {
	this.init(exp1, exp2, MatOperator.RESTA);

	this.derive = function(diferencial) {
		return new MatResta(this.getFirstExpresion().derive(diferencial), this.getLastExpresion().derive(diferencial));

	}

	this.simplify = function() {
		var simFirst = this.getFirstExpresion().simplify();
		var simLast = this.getLastExpresion().simplify();

		if (simFirst.isNumber() && simLast.isNumber()) {
			var num = simFirst.eval() - simLast.eval();
			
			if (num >= 0) {
				return new MatNumber(num);
			} else {
				return new MatNegativo(new MatNumber(Math.abs(num)));
			}
			
		} else if (simFirst.isNumber()) {
			var num = simFirst.eval();
			
			if (num == 0.0) {
				return new MatNegativo(simLast).simplify();
			} else {
				return new MatResta(simFirst, simLast);
			}
		} else if (simLast.isNumber()) {
			var num = simLast.eval();
			
			if (num == 0.0) {
				return simFirst;
			} else {
				return new MatResta(simFirst, simLast);
			}
		} else {
			if (simFirst.equals(simLast)) {
				return new MatNumber(0.0);
			} else if (new MatNegativo(simFirst).simplify().equals(simLast)) {
				return new MatProducto(new MatNumber(2), new MatNegativo(simFirst).simplify());
			} else {
				return new MatResta(simFirst, simLast);
			}
		}
	
	}

}

//------------------------------------------------------------------------------------------------------


/**
 * MatProducto hereda de MatComposedExpresion
 **/
//------------------------------------------------------------------------------------------------------

MatProducto.prototype = new MatComposedExpresion();
MatProducto.prototype.constructor = MatProducto;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa un PRODUCTO de expresiones matemáticas
 **/
//------------------------------------------------------------------------------------------------------
function MatProducto(exp1, exp2) {
	this.init(exp1, exp2, MatOperator.PRODUCTO);

	this.equalsContained = function(exp) {
		return (this.getFirstExpresion().equals(exp.getFirstExpresion()) && this.getLastExpresion().equals(exp.getLastExpresion())) || (this.getFirstExpresion().equals(exp.getLastExpresion()) && this.getLastExpresion().equals(exp.getFirstExpresion()));
	}

	this.derive = function(diferencial) {
		return new MatSuma(new MatProducto(this.getFirstExpresion().derive(diferencial), this.getLastExpresion()), new MatProducto(this.getFirstExpresion(), this.getLastExpresion().derive(diferencial)));
	}

	this.simplify = function() {
		var simFirst = this.getFirstExpresion().simplify();
		var simLast = this.getLastExpresion().simplify();
	
		if (simFirst.isNumber() && simLast.isNumber()) {
			var num = simFirst.eval() * simLast.eval();
			
			if (num >= 0) {
				return new MatNumber(num);
			} else {
				return new MatNegativo(new MatNumber(Math.abs(num)));
			}
		} else if (simFirst.isNumber()) {
			var num = simFirst.eval();
			
			if (num == 0.0) {
				return new MatNumber(0);
			} else if (num == 1.0) {
				return simLast;
			} else if (num == -1.0) {
				return new MatNegativo(simLast).simplify();
			} else {
				return new MatProducto(simFirst, simLast);
			}
		} else if (simLast.isNumber()) {
			var num = simLast.eval();
			
			if (num == 0.0) {
				return new MatNumber(0);
			} else if (num == 1.0) {
				return simFirst;
			} else if (num == -1.0) {
				return new MatNegativo(simFirst).simplify();
			} else {
				return new MatProducto(simFirst, simLast);
			}
		} else {
			if (simFirst.equals(simLast)) {
				return new MatPotencia(simFirst, new MatNumber(2));
			} else if (new MatNegativo(simFirst).simplify().equals(simLast)) { 
				return new MatNegativo(new MatPotencia(simFirst, new MatNumber(2)).simplify());
			} else {
				return new MatProducto(simFirst, simLast);
			}
		}
	}

}

//------------------------------------------------------------------------------------------------------

/**
 * MatDivision hereda de MatComposedExpresion
 **/
//------------------------------------------------------------------------------------------------------

MatDivision.prototype = new MatComposedExpresion();
MatDivision.prototype.constructor = MatDivision;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una DIVISION de expresiones matemáticas
 **/
//------------------------------------------------------------------------------------------------------
function MatDivision(exp1, exp2) {
	this.init(exp1, exp2, MatOperator.DIVISION);

	this.derive = function(diferencial) {
		return new MatDivision(new MatResta(new MatProducto(this.getFirstExpresion().derive(diferencial), this.getLastExpresion()), new MatProducto(this.getFirstExpresion(), this.getLastExpresion().derive(diferencial))), new MatPotencia(this.getLastExpresion(), new MatNumber(2)));
	}	

	this.simplify = function() {
		var simFirst = this.getFirstExpresion().simplify();
		var simLast = this.getLastExpresion().simplify();

		if (simFirst.isNumber()) {
			var num = simFirst.eval();
			
			if (num == 0.0) {
				return simFirst;
			}
		}
		
		if (simLast.isNumber()) {
			var last = simLast.eval();
			
			if (last == 0.0) {
				return new MatDivision(simFirst, simLast);
			} else if (last == 1.0) {
				return simFirst;
			} else if (last == -1.0) {
				return new MatNegativo(simFirst).simplify();
			} else {
				if (simFirst.isNumber()) {
					var first = simFirst.eval();
					
					try {
						first = first / last;
					} catch (e) {
						return new MatDivision(simFirst, simLast);
					}
					
					if (first >= 0) {
						return new MatNumber(first);
					} else {
						return new MatNegativo(new MatNumber(Math.abs(first)));
					}
					
				} else {
					return new MatDivision(simFirst, simLast);
				}
			}
		}
		
		if (simFirst.equals(simLast)) {
			return new MatNumber(1);
		} else if (new MatNegativo(simFirst).equals(simLast)) {
			return new MatNegativo(new MatNumber(1));
		} else {
			return new MatDivision(simFirst, simLast);
		}
	}
}


//------------------------------------------------------------------------------------------------------

/**
 * MatPotencia hereda de MatComposedExpresion
 **/
//------------------------------------------------------------------------------------------------------

MatPotencia.prototype = new MatComposedExpresion();
MatPotencia.prototype.constructor = MatPotencia;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una potencia de expresiones matemáticas (X^Y)
 **/
//------------------------------------------------------------------------------------------------------
function MatPotencia(exp1, exp2) {
	this.init(exp1, exp2, MatOperator.POTENCIA);

	this.derive = function(diferencial) {
		if (this.getLastExpresion().isNumber()) {
			return new MatProducto(new MatProducto(this.getLastExpresion(), new MatPotencia(this.getFirstExpresion(), new MatResta(this.getLastExpresion(), new MatNumber(1)))), this.getFirstExpresion().derive(diferencial));
		} else {
			var log = new MatLogNatural(this.getFirstExpresion());

			return new MatProducto(this, new MatSuma(new MatProducto(this.getLastExpresion().derive(diferencial), log), new MatProducto(this.getLastExpresion(), log.derive(diferencial))));		
		}
	}

	this.simplify = function() {
		var simFirst = this.getFirstExpresion().simplify();
		var simLast = this.getLastExpresion().simplify();

		if (simFirst.isNumber()) {
			var num = simFirst.eval();
			
			if (num == 0.0) {
				if (simLast.isNumber()) {
					var last = simLast.eval();
					
					if (last == 0.0) {
						return new MatNumber(1);
					} else if (last > 0) {
						return new MatNumber(0);
					} else {
						return new MatPotencia(simFirst, simLast);
					}
				} else {
					return new MatPotencia(simFirst, simLast);
				}
			} else {
				if (simLast.isNumber()) {
					var last = simLast.eval();
					
					try {
						num = Math.pow(num, last);
						
						if (num >= 0) {
							return new MatNumber(num);
						} else {
							return new MatNegativo(new MatNumber(Math.abs(num)));
						}
						
					} catch (e) {
						return new MatPotencia(simFirst, simLast);
					}
				} else {
					return new MatPotencia(simFirst, simLast);
				}
			}
		} else {
			if (simLast.isNumber()) {
				var num = simLast.eval();
				
				if (num == 0.0) {
					return new MatNumber(1);
				} else if (num == 1.0) {
					return simFirst;
				} else if (num == -1.0) {
					return new MatDivision(new MatNumber(1.0), simFirst);
				} else {
				
					if (simFirst.constructor == MatNegativo && num%2 == 0) {
						return new MatPotencia(simFirst.getExpresion(),simLast);
					} else {
					
						return new MatPotencia(simFirst, simLast);
					}
				}
			} else {
				return new MatPotencia(simFirst, simLast);
			}
		}
	}

}

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una funcion definidad por el usuario.
 **/
MatFunction.prototype = new MatExpresion();
MatFunction.prototype.constructor = MatFunction;

//------------------------------------------------------------------------------------------------------
function MatFunction(name, exp) {

	this.equalsContained = function(exp) {
		return this.name == exp.getName() && this.getExpresion().equals(exp.getExpresion());
	}
}

MatFunction.prototype.init = function(name, exp) {
	this.name = name.toUpperCase();
	this.expresion = exp;
}


MatFunction.prototype.getName = function() {
	return this.name;
}

MatFunction.prototype.getExpresion = function() {
	return this.expresion;
}

MatFunction.prototype.eval = function(parameters) {
	var value = this.getExpresion().eval(parameters);

	if (isNaN(parseFloat(value))) {
		return 'MatFunction[\'' + this.getName() + '\']: Error de Evaluación.[' + value + ']';
	}

	return value;
}

MatFunction.prototype.toString = function() {
	return this.getName() + '(' + this.getExpresion().toString() + ')';
}

MatFunction.prototype.getDescription = function() {
	return this.getName() + '[' + this.getVariables() + '] = ' + this.getExpresion().toString();
}

MatFunction.prototype.derive = function(diferencial) {
	return this.getExpresion().derive(diferencial);
}

MatFunction.prototype.getVariables = function() {
	return this.getExpresion().getVariables();
}

MatFunction.prototype.isNumber = function() {
	return this.getExpresion().isNumber();
}

//------------------------------------------------------------------------------------------------------

/**
 * MatLogNatural hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatLogNatural.prototype = new MatFunction();
MatLogNatural.prototype.constructor = MatLogNatural;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion logaritmo neperiano.
 **/
//------------------------------------------------------------------------------------------------------
function MatLogNatural(exp) {
	this.init('LN', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatLogNatural: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		if (value > 0) {
			return Math.log(value);
		} else {
			return "DOMINIO_INVALIDO";
		}
	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), this.getExpresion());
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.log(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatLogNatural(simExp);
			}
		} else if (simExp.constructor == MatExponencial) {
			return simExp.getExpresion();
		} else {
			return new MatLogNatural(simExp);
		}
	
	}

}


//------------------------------------------------------------------------------------------------------


/**
 * MatNegativo hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatNegativo.prototype = new MatFunction();
MatNegativo.prototype.constructor = MatNegativo;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa una expresion multiplicada por -1
 **/
//------------------------------------------------------------------------------------------------------
function MatNegativo(exp) {
	this.init('NEG', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatNegativo: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		return value * (-1);
	}

	this.derive = function(diferencial) {
		return new MatNegativo(this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				if (num <= 0) {
					return new MatNumber(Math.abs(num));
				} else {
					return new MatNegativo(simExp);
				}
								
			} catch (e) {
				return new MatNegativo(simExp);
			}
		} else {
			if (simExp.constructor == MatNegativo) {
				return simExp.getExpresion();
			} else {
				return new MatNegativo(simExp);
			}
		}
	
	}

}

//------------------------------------------------------------------------------------------------------


/**
 * MatCoseno hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatCoseno.prototype = new MatFunction();
MatCoseno.prototype.constructor = MatCoseno;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonométrica coseno.
 **/
//------------------------------------------------------------------------------------------------------
function MatCoseno(exp) {
	this.init('COS', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatCoseno: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		return Math.cos(value);
	}

	this.derive = function(diferencial) {
		return new MatProducto(new MatNegativo(new MatSeno(this.getExpresion())), this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.cos(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));					
				}
				
				
			} catch (e) {
				return new MatCoseno(simExp);
			}
		} else if (simExp.constructor == MatArcoCoseno) {
			return simExp.getExpresion();
		} else {
			return new MatCoseno(simExp);
		}
	
	}

}

//------------------------------------------------------------------------------------------------------


/**
 * MatSeno hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatSeno.prototype = new MatFunction();
MatSeno.prototype.constructor = MatSeno;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonométrica Seno.
 **/
//------------------------------------------------------------------------------------------------------
function MatSeno(exp) {
	this.init('SIN', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatSeno: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		return Math.sin(value);
	}

	this.derive = function(diferencial) {
		return new MatProducto(new MatCoseno(this.getExpresion()), this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.sin(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));					
				}
				
			} catch (e) {
				return new MatSeno(simExp);
			}
		} else if (simExp.constructor == MatArcoSeno) {
			return simExp.getExpresion();
		} else {
			return new MatSeno(simExp);
		}
	
	}

}

//------------------------------------------------------------------------------------------------------


/**
 * MatTangente hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatTangente.prototype = new MatFunction();
MatTangente.prototype.constructor = MatTangente;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonométrica Tangente.
 **/
//------------------------------------------------------------------------------------------------------
function MatTangente(exp) {
	this.init('TAN', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatTangente: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.tan(value);
		
		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		}
		
		return aux;
	}

	this.derive = function(diferencial) {
		return new MatProducto(new MatSuma(new MatNumber(1), new MatPotencia(new MatTangente(exp), new MatNumber(2))), this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.tan(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));					
				}
				
			} catch (e) {
				return new MatTangente(simExp);
			}
		} else if (simExp.constructor == MatArcoTangente) {
			return simExp.getExpresion();
		} else {
			return new MatTangente(simExp);
		}
	}
}

//------------------------------------------------------------------------------------------------------

/**
 * MatCotangente hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatCotangente.prototype = new MatFunction();
MatCotangente.prototype.constructor = MatCotangente;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonométrica Cotangente.
 **/

//------------------------------------------------------------------------------------------------------
function MatCotangente(exp) {
	this.init('COT', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatCotangente: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.pow(Math.tan(value), -1);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		}
		
		return aux;
	}

	this.derive = function(diferencial) {
		return new MatProducto(new MatResta(new MatNegativo(new MatNumber(1)), new MatPotencia(new MatCotangente(exp), new MatNumber(2))), this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.pow(Math.tan(num), -1);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));					
				}
				
			} catch (e) {
				return new MatCotangente(simExp);
			}
		} else if (simExp.constructor == MatArcoCotangente) {
			return simExp.getExpresion();
		} else {
			return new MatCotangente(simExp);
		}
	}
}

//------------------------------------------------------------------------------------------------------
/**
 * MatExponencial hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatExponencial.prototype = new MatFunction();
MatExponencial.prototype.constructor = MatExponencial;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion E^x.
 **/

//------------------------------------------------------------------------------------------------------
function MatExponencial(exp) {
	this.init('EXP', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatExponencial: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		return Math.exp(value);
	}

	this.derive = function(diferencial) {
		return new MatProducto(this, this.getExpresion().derive(diferencial));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.exp(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatExponencial(simExp);
			}
		} else if (simExp.constructor == MatLogNatural) {
			return simExp.getExpresion();
		} else {
			return new MatExponencial(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoSeno hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoSeno.prototype = new MatFunction();
MatArcoSeno.prototype.constructor = MatArcoSeno;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Seno
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoSeno(exp) {
	this.init('ASIN', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoSeno: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.asin(value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), new MatPotencia(new MatResta(new MatNumber(1), new MatPotencia(this.getExpresion(), new MatNumber(2))), new MatNumber(0.5)));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.asin(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoSeno(simExp);
			}
		} else if (simExp.constructor == MatSeno) {
			return simExp.getExpresion();
		} else {
			return new MatArcoSeno(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoCoseno hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoCoseno.prototype = new MatFunction();
MatArcoCoseno.prototype.constructor = MatArcoCoseno;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Coseno
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoCoseno(exp) {
	this.init('ACOS', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoCoseno: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.acos(value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), new MatNegativo(new MatPotencia(new MatResta(new MatNumber(1), new MatPotencia(this.getExpresion(), new MatNumber(2))), new MatNumber(0.5))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.acos(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoCoseno(simExp);
			}
		} else if (simExp.constructor == MatCoseno) {
			return simExp.getExpresion();
		} else {
			return new MatArcoCoseno(simExp);
		}
	}
}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoTangente hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoTangente.prototype = new MatFunction();
MatArcoTangente.prototype.constructor = MatArcoTangente;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Tangente
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoTangente(exp) {
	this.init('ATAN', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoTangente: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.atan(value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), new MatSuma(new MatNumber(1), new MatPotencia(this.getExpresion(), new MatNumber(2))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.atan(num);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoTangente(simExp);
			}
		} else if (simExp.constructor == MatTangente) {
			return simExp.getExpresion();
		} else {
			return new MatArcoTangente(simExp);
		}
	}
}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoCotangente hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoCotangente.prototype = new MatFunction();
MatArcoCotangente.prototype.constructor = MatArcoCotangente;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Cotangente
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoCotangente(exp) {
	this.init('ACOT', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoCotangente: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.atan(value + Math.PI / 2);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), new MatResta(new MatNegativo(new MatNumber(1)), new MatPotencia(this.getExpresion(), new MatNumber(2))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.atan(num + Math.PI / 2);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoCotangente(simExp);
			}
		} else if (simExp.constructor == MatCotangente) {
			return simExp.getExpresion();
		} else {
			return new MatArcoCotangente(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatSecante hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatSecante.prototype = new MatFunction();
MatSecante.prototype.constructor = MatSecante;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Secante (1 / coseno)
 **/

//------------------------------------------------------------------------------------------------------
function MatSecante(exp) {

	this.init('SEC', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatSecante: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = 1 / Math.cos(value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatProducto(new MatTangente(this.getExpresion()), new MatProducto(this, this.getExpresion().derive(diferencial)));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.cos(value);
				
				if (num != 0) {
				
					num = 1 / num;
				
					if (num >= 0) {
						return new MatNumber(num);
					} else {
						return new MatNegativo(new MatNumber(Math.abs(num)));
					}
				} else {
					return new MatSecante(simExp);
				}
				
			} catch (e) {
				return new MatSecante(simExp);
			}
		} else if (simExp.constructor == MatArcoSecante) {
			return simExp.getExpresion();
		} else {
			return new MatSecante(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatCosecante hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatCosecante.prototype = new MatFunction();
MatCosecante.prototype.constructor = MatCosecante;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Cosecante (1 / eno)
 **/

//------------------------------------------------------------------------------------------------------
function MatCosecante(exp) {

	this.init('COSEC', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatCosecante: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = 1 / Math.sin(value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatNegativo(new MatProducto(new MatCotangente(this.getExpresion()), new MatProducto(this, this.getExpresion().derive(diferencial))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.sin(value);
				
				if (num != 0) {
				
					num = 1 / num;
				
					if (num >= 0) {
						return new MatNumber(num);
					} else {
						return new MatNegativo(new MatNumber(Math.abs(num)));
					}
				} else {
					return new MatCosecante(simExp);
				}
				
			} catch (e) {
				return new MatCosecante(simExp);
			}
		} else if (simExp.constructor == MatArcoCosecante) {
			return simExp.getExpresion();
		} else {
			return new MatCosecante(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoSecante hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoSecante.prototype = new MatFunction();
MatArcoSecante.prototype.constructor = MatArcoSecante;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Secante
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoSecante(exp) {

	this.init('ASEC', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoSecante: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.acos(1 / value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatDivision(this.getExpresion().derive(diferencial), new MatProducto(this.getExpresion(), new MatPotencia(new MatResta(new MatPotencia(this.getExpresion(), new MatNumber(2)), new MatNumber(1)), new MatNumber(0.5))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.acos(1 / value);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoSecante(simExp);
			}
		} else if (simExp.constructor == MatSecante) {
			return simExp.getExpresion();
		} else {
			return new MatArcoSecante(simExp);
		}
	}

}

//------------------------------------------------------------------------------------------------------
/**
 * MatArcoCosecante hereda de MatFunction
 **/
//------------------------------------------------------------------------------------------------------

MatArcoCosecante.prototype = new MatFunction();
MatArcoCosecante.prototype.constructor = MatArcoCosecante;

//------------------------------------------------------------------------------------------------------

/**
 * Objeto que representa la funcion trigonometrica Arco Cosecante
 **/

//------------------------------------------------------------------------------------------------------
function MatArcoCosecante(exp) {

	this.init('ACOSEC', exp);

	this.eval = function(parameters) {
		var value = this.getExpresion().eval(parameters);

		if (isNaN(parseFloat(value))) {
			if (value != 'DOMINIO_INVALIDO' && value != 'DIVISION_X_ZERO') {
				return 'MatArcoCosecante: Error de Evaluación.[' + value + ']';
			}
			return value;
		}

		var aux = Math.asin(1 / value);

		if (isNaN(aux)) {
			return 'DOMINIO_INVALIDO';
		} else {
			return aux;
		}

	}

	this.derive = function(diferencial) {
		return new MatNegativo(new MatDivision(this.getExpresion().derive(diferencial), new MatProducto(this.getExpresion(), new MatPotencia(new MatResta(new MatPotencia(this.getExpresion(), new MatNumber(2)), new MatNumber(1)), new MatNumber(0.5)))));
	}

	this.simplify = function() {
		var simExp = this.getExpresion().simplify();
		
		if (simExp.isNumber()) {
			try {
				var num = this.getExpresion().eval();
				
				num = Math.asin(1 / value);
				
				if (num >= 0) {
					return new MatNumber(num);
				} else {
					return new MatNegativo(new MatNumber(Math.abs(num)));
				}
				
			} catch (e) {
				return new MatArcoCosecante(simExp);
			}
		} else if (simExp.constructor == MatCosecante) {
			return simExp.getExpresion();
		} else {
			return new MatArcoCosecante(simExp);
		}
	}

}
