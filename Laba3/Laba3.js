(function scheduler(){
	var _prev = { title: 'First', description: 'No info', time: 'No info', colour: '', colour : '#01ff00'}
	var _curr = {id:'', title: 'Laboratory work number 3', description: 'Was done by Shut* Maxym', time: '23.00', colour : '#ff5500'}
	var _next = { title: 'Last', description: 'No info', time: 'No info', colour : '#ff0000'}
	
	var prev = new Vue({
		el:'#prev',
	  data: _prev,
	  template: '<div id="prev" class="item second" v-bind:style="{ background: colour }"><p>Title: '+
	  	'{{ title }}</p><p>Description: '+'{{ description }}</p><p>Time: {{ time }}</p></div>'
	})
	
	var curr = new Vue({
		el:'#curr',
	  data: _curr,
	  template: '<div id="curr" class="item first bg-right" v-bind:style="{ background: colour }">'+
	  	'<input id="item-id" type="hidden" v-model="id">'+
	  	'Title: <input class="prop" id="item-title" type="text"  v-model="title" placeholder="Enter a title, please :)" maxlength=15 width=80%><br>'+
		'<center>Description: </center><textarea class="prop" id="item-description" rows="4"  v-model="description" placeholder="Add some description, please ;)" maxlength=100></textarea><br>'+
	    'Time: <input class="prop" id="item-time" type="time" v-model="time"><br>'+
	    '<br><center><div class="edd sprite" id="save"></div>'+' <div class="edd sprite" id="del"></div>'+
	    '</center></div>'
	})
	
	var next = new Vue({
		el:'#next',
	  data: _next,
	  template: '<div id="next" class="item second" v-bind:style="{ background: colour }"><p>Title: '+
	  	'{{ title }}</p><p>Description: '+'{{ description }}</p><p>Time: {{ time }}</p></div>'
	})
	
	var list=[];
	var local=[];

	//Робота з XML-файлом.
	function get(url){
		return new Promise(function (succed, fail){
			var reg = new XMLHttpRequest();
			reg.open("GET", url, true);
			reg.overrideMimeType('application/xml');
			reg.addEventListener("load", function(){
				if (reg.status<400){
					succed(reg.responseXML);
				} else {
					fail(new Error(reg.responseText))
				}
			})
			reg.send();
		})
	}

	//Таймер.
	function subTime(timeStr){
		var date = new Date();
		var mlist = timeStr.split(':');
		if (mlist.length == 2){
			var i = date.getHours()*60 + date.getMinutes();
			var j = parseInt(mlist[0])*60 + parseInt(mlist[1]);
			return j - i;
		} else {
			return 1500
		}
	}
  
    //Надання подіям відповідних кольорів.
	function getColour(timeStr){
		var i = subTime(timeStr);
		if (i >= 1440){
			return "#ff5500" // Інформація про лабу.
		}
		if (i > 1){
			return "#0400C5" // Час очікування події більше 1 хвилини.
		}
		if (i >= 0){
			return "#FFFE00" // Час очікування події менше 1 хвилини.
		}
		return "#777777" // Подія вже відбулася.
	}

	function refresh(){
		get("/xml/").then(function (text){
			setBegin();
			local = [];
			list = [];
			console.log(text);
			var bf = text.getElementsByTagName("task");
			for (var i = 0; i<bf.length; i++){
				list.push({
					id: i,
					title: bf[i].getElementsByTagName('title')[0].innerHTML,
					time: bf[i].getElementsByTagName('time')[0].innerHTML,
					description: bf[i].getElementsByTagName('description')[0].innerHTML
				});
			}
			if (bf.length>0){
				pushEl(0,list,_curr);
				_curr.colour = getColour(_curr.time);
			} else {
				local.push({
					id: bf.length+list.length,
					title: "Enter a title, please :)",
					time: "",
					description: "Add some description, please ;)"
				})
				pushEl(0,local,_curr)
				_curr.colour = getColour(_curr.time);
			}
			if (bf.length>1){
				_next.title = list[1].title;
				_next.time = list[1].time;
				_next.colour = getColour(_next.time);
			} else {
				setEnd();
			}
		},
			function (text){
				alert(text)
			}
		)	
	}
	
	//Перша подія(константна).
	function setBegin(){
		_prev.title = "Laboratory work number 3"
		_prev.description = 'Was done by Shut* Maxym';
		_prev.time = "23.00"
		_prev.colour = "#ff5500"
	}
	
	// Наступна подія (константна).
	function setEnd(){
		_next.title = 'Next';
		_next.description = 'No info';
		_next.time = 'No info';
		_next.colour = '#ff0000';
	}
	refresh();

	function pushEl(id,lst,el) {
		el.id = id;
		el.title = lst[id].title
		el.time = lst[id].time
		el.description = lst[id].description
		el.colour = getColour(lst[id].time);
	}

	function popCurr(id,lst,el) {
		lst[id].title = el.title
		lst[id].time = el.time
		lst[id].description = el.description
	}

	function setEl(id,el) {
		if (id < list.length){
			pushEl(id,list,el);
		} else if ((id - list.length)<local.length){
			pushEl(id - list.length,local,el);
			el.id = id;
		}
	}

	function saveLastPos(id,el) {
		if (id < list.length){
			popCurr(id,list,el);
		} else if ((id - list.length)<local.length){
			el.id = id;
			popCurr(id - list.length,local,el);
		}
	}

	//Переключання подій (вліво).
	function goleft(){
		var i = parseInt(_curr.id)
		saveLastPos(i, _curr)
		if (i === 0){
			i = list.length  + local.length - 1;
			setEnd();
		} else{
			setEl(i, _next);
			i = i - 1;
		}
		setEl(i, _curr);
		if (i === 0){
			setBegin();
		} else{
			setEl(i - 1, _prev);
		}
	}

	//Переключання подій (вправо).
	function goright(){
		var i = parseInt(_curr.id)
		saveLastPos(i, _curr)
		if (i === list.length  + local.length - 1){
			i = 0;
			setBegin();
		} else{
			setEl(i, _prev);
			i = i + 1;
		}
		setEl(i, _curr);
		if (i === list.length  + local.length - 1){
			setEnd();
		} else{
			setEl(i + 1, _next);
		}
	}

	//Додавання нової події.
	function add_task(){
		local.push({
			id: local.length+list.length,
			title: "",
			time: "",
			description: ""
		})
		setEl(_curr.id + 1, _next);
	}

	document.getElementById("left").onclick = goleft;
	document.getElementById("right").onclick = goright;
	document.getElementById("refresh").onclick = refresh;
	document.getElementById("add").onclick = add_task;

	document.getElementById("save").onclick = function(){
		var _i = parseInt(_curr.id);
		var http = new XMLHttpRequest();
		var formData = '_id='+_curr.id+'&_title='+_curr.title+'&_time='+_curr.time+'&_description='+_curr.description
		if (parseInt(_curr.id) < list.length){
			var url = "/save/";
			list[_i].title = _curr.title
			list[_i].time = _curr.time
			list[_i].description = _curr.description
		} else {
			var url = "/add/";
			var len = list.length;
			local[_curr.id-list.length].title = _curr.title
			local[_curr.id-list.length].time = _curr.time
			local[_curr.id-list.length].description = _curr.description
			local[_curr.id-list.length].id = len;
			var buff = local[_curr.id-len];
			list.push(buff);
			local.splice(_curr.id-len, 1); // начиная с позиции *, удалить 1 элемент
			for (var i = 0; i < local.length; i++){
				local[i].id = i+list.length;
			}
			_i = parseInt(list[len].id);
		}
		http.open("POST", url, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.send(formData);

		if (_i === 0){
			setBegin();
		} else{
			setEl(_i - 1, _prev);
		}
		setEl(_i, _curr);
		if (_i === list.length  + local.length - 1){
			setEnd();
		} else{
			setEl(_i + 1, _next);
		}
	}
	document.getElementById("del").onclick = function(){
		var list_length = list.length;
		var id = parseInt(_curr.id);
		if (id < list.length){
			var http = new XMLHttpRequest();
			http.open("POST", "/del/", true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.send('_id='+id);

			list.splice(id, 1);
			for (var i = id; i < list.length; i++){
				list[i].id = i;
			}
			for (var i = 0; i < local.length; i++){
				local[i].id = i+list.length;
			}
		} else {
			local.splice(_curr.id-list_length, 1); // начиная с позиции *, удалить 1 элемент
			for (var i = _curr.id-list_length; i < local.length; i++){
				local[i].id = i+list_length;
			}
		}
		id = id - 1;
		if ((list.length+local.length) == 0){
			refresh();
		} else {
			if (id === 0){
				setBegin();
			} else{
				setEl(id - 1, _prev);
			}
			setEl(id, _curr);
			if (id === list.length  + local.length - 1){
				setEnd();
			} else{
				setEl(id + 1, _next);
			}
		}
	}
	var check = setInterval(checker, 20000);
	
	//Слідкування за часом. Видача нагадування!
	function checker(){
		var date = new Date();
		var mins = date.getMinutes();
		var hous = date.getHours();
		var ls;
		for (var i=0; i < list.length;i++){
			ls = list[i].time.split(':'); 
			if (ls.length == 2){
				if ((parseInt(ls[0]) === hous)&&(parseInt(ls[1]) === mins)){
					alert("OOPS, YOU MUST GO TO '"+list[i].title+"'\nAND PROTECT THE "+list[i].description)
				}
			}
		}
		for (var i=0; i < local.length;i++){
			ls = local[i].time.split(':'); 
			if (ls.length == 2){
				if ((parseInt(ls[0]) === hous)&&(parseInt(ls[1]) === mins)){
					alert("OOPS, YOU MUST GO TO '"+list[i].title+"'\nAND PROTECT THE "+list[i].description)
				}
			}
		}
		var _i = parseInt(_curr.id)
		saveLastPos(_i, _curr)
		if (_i === 0){
			setBegin();
		} else{
			setEl(_i - 1, _prev);
		}
		setEl(_i, _curr);
		if (_i === list.length  + local.length - 1){
			setEnd();
		} else{
			setEl(_i + 1, _next);
		}
	}
})();