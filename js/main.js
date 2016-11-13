///////////////////////////////////
/////////////// APP ///////////////
///////////////////////////////////

function App ( selector ) {
	this.domElem = selector ? selector : document.getElementById( 'myApp' );
	this.startTemplate = document.getElementById('startTemplate').innerHTML;
	this.diceNavTemplate = document.getElementById('diceNavTemplate').innerHTML;
	this.numbers = [];
}
App.prototype.init = function() {
	this.renderNewApp();
	this.emitEvent();
	this.initEvent();
};
App.prototype.renderNewApp = function() {
	var rendered = Mustache.render(this.startTemplate);
	this.domElem.innerHTML += rendered;
};
App.prototype.renderNavDice = function() {
	var renderedNavDice = Mustache.render(this.diceNavTemplate);
	this.dicePlace.innerHTML += renderedNavDice;
};
App.prototype.createCustomEvent = function( nameVar, nameEvent, dataDetail, elem ) {
	var nameVar = new CustomEvent( nameEvent, {
		detail: dataDetail,
		bubbles: true,
		cancelable: true
	});
	elem.dispatchEvent( nameVar );
};
App.prototype.takeDiceNum = function() {
	return this.domElem.querySelectorAll('.diceNum')[0].value;
};
App.prototype.createDice = function( num ) {
	this.dicePlace = this.domElem.querySelectorAll('.dicePlace')[0];

	if ( num > 0 && num <= 8 ) {
		this.dicePlace.innerHTML = '';

		for ( var i = 0; i < num; i++ ) {
			this[ "dice"+i ] = new Dice( this.dicePlace, this, i );
		}
		this.renderNavDice();
	} else {
		alert("You specified value is not of the specified range !");
	}
};
App.prototype.getSumPoints = function() {
	var sum = 0;
	for ( var i = 0; i < this.numbers.length; i++ ) {
		sum += this.numbers[i];
	}
	return sum;
};
App.prototype.clearNumbersArray = function() {
	this.numbers.splice(0, this.numbers.length);
};
App.prototype.showSumPoints = function() {
	var sum = this.getSumPoints();
	this.domElem.querySelectorAll('#showSum')[0].innerHTML = ' '+sum+' ';
	this.clearNumbersArray();
};
App.prototype.initEvent = function() {
	var self = this;
	this.domElem.addEventListener('startGame', function() {
		self.createDice( self.takeDiceNum() );
		
	});
	this.domElem.addEventListener('getSumPoints', function() {
		self.showSumPoints();
	});
};
App.prototype.emitEvent = function() {
	var self = this;
	this.domElem.addEventListener('mouseup', function() {
		var target = event.target;
		var action = target.getAttribute( 'data-action' );

		if ( action == 'startGame' ) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			self.createCustomEvent( 'startGame', 'startGame', '', self.domElem );
		} else if ( action == 'rollDice' ) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			self.createCustomEvent( 'getSumPoints', 'getSumPoints', '', self.domElem );
		} else {}
	});
};

///////////////////////////////////
/////////////// DICE //////////////
///////////////////////////////////

function Dice ( selector, App, i ) {
	this.dicePlace = selector ? selector : document.querySelectorAll( '.dicePlace' );
	this.app = App;
	this.idDice = i;
	this.diceTemplate = document.getElementById('diceTemplate').innerHTML;
	this.dicePointTemplate = document.getElementById('dicePointTemplate').innerHTML;
	this.diceBox = document.createElement( 'ul' );
	this.diceBox.className = "diceBox";

	this.init();
}
Dice.prototype.init = function() {
	this.renderNewDice();
	this.emitEvent();
	this.initEvent();
};
Dice.prototype.renderNewDice = function() {
	this.dicePlace.appendChild( this.diceBox );
	var renderedDice = Mustache.render(this.diceTemplate);
	this.diceBox.innerHTML += renderedDice;
};
Dice.prototype.randomNum = function() {
	return Math.floor( Math.random() * 6 ) + 1;
};
Dice.prototype.renderDicePoints = function( number ) {
	var num = number;
	var box = this.dicePlace.querySelectorAll('.diceBox')[this.idDice];
	box.innerHTML = '';
	var rendered = Mustache.render(this.dicePointTemplate);
	for ( var i = 0; i < num; i++ ) {
		box.innerHTML += rendered;
	}
};
Dice.prototype.initEvent = function() {
	var self = this;
	this.diceBox.addEventListener('rollDice', function() {
		var num = self.randomNum();
		self.app.numbers.push( num );
		self.renderDicePoints ( num );
	});
};
Dice.prototype.emitEvent = function() {
	var self = this;
	this.app.domElem.addEventListener('mousedown', function() {
		var target = event.target;
		var action = target.getAttribute( 'data-action' );
		
		if ( action == 'rollDice' ) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			self.app.createCustomEvent( 'rollDice', 'rollDice', '', self.diceBox );
		} else {}
	});
};
///////////////////////////////////
//////////// START APP ////////////
///////////////////////////////////

var app = new App();
app.init();