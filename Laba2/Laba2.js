if (confirm("Launch the calculator?"))
	alert("Laboratory work №2 was done by Shut' Maxym");
else alert("GoodBye!");

function Click_Cout_Num(number){
	document.Display.display.value += number;
}

function Click_Cout_T(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var t = document.Display.display.value;
		document.Display.display.value = t.substring(0,t.length - len); }
}

function Click_Cout_Plus(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var plus = document.Display.display.value;
		document.Display.display.value = plus.substring(0,plus.length - len); }
}

function Click_Cout_Minus(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var minus = document.Display.display.value;
		document.Display.display.value = minus.substring(0,minus.length - len); }
}

function Click_Cout_Mult(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var mult = document.Display.display.value;
		document.Display.display.value = mult.substring(0,mult.length - len); }
}

function Click_Cout_Div(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var div = document.Display.display.value;
		document.Display.display.value = div.substring(0,div.length - len); }
}

function Click_Cout_Pow(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var pow = document.Display.display.value;
		document.Display.display.value = pow.substring(0,pow.length - len); }
}

function Click_Cout_Sqrt(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var sqrt = document.Display.display.value;
		document.Display.display.value = sqrt.substring(0,sqrt.length - len); }
}
		

function Click_Cout_Per(action) {
	document.Display.display.value += action;
	var len = action.length;
	var tmp = document.Display.display.value;
	if (tmp == action) {
		var per = document.Display.display.value;
		document.Display.display.value = per.substring(0,per.length - len); }
}

function Click_Cout_Result(action) {
	var result = document.Display.display.value;
	if(result) {
		document.Display.display.value = eval(result); }
}

function Click_Cout_C(action) {
	document.Display.display.value = '';
}

function Click_Cout_CE(action) {
	var ce = document.Display.display.value;
	document.Display.display.value = ce.substring(0, ce.length - 2 );
}

function Click_Cout_Del(action) {
	var del = document.Display.display.value;
	document.Display.display.value = del.substring(0, del.length - 1);
}