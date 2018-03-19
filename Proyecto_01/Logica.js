

window.onload = function(){
	init();
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	video_run = true;
}
//Nota para Maria Ortega: El canvas tiene una anchura de 300px
var init = function(){
	canvas = document.getElementById("micanvas");
	contenedor_canvas = document.getElementById("vd_container");
	video = document.getElementById("mivideo");
	contenedor_boton_pause = document.getElementById("div_pause");
	if(canvas && canvas.getContext){
		monigote1 = new monigote();
		ctx = canvas.getContext("2d");
		document.onkeydown = movimiento_key_down;
		document.onkeyup = movimiento_key_up;
		interval_1 = setInterval(repintar,10);
	}
}

var movimiento_key_up = function(event){
	var keyCode = ('which' in event) ? event.which : event.keyCode;
	//Dejo de avanzar Izquiera
	if(keyCode==37){
		izquierda = false;
	}
	//Dejo de avanzar Derecha
	if(keyCode==39){
		derecha = false;
	}
}

var movimiento_key_down = function(event){
	var keyCode = ('which' in event) ? event.which : event.keyCode;
	//Salto
	if(keyCode==38 && baja_salto==false){
		sube_salto = true;
	}
	//Izquierda
	if(keyCode==37){
		izquierda = true;
		derecha = false;
	}
	//Derecha
	if(keyCode==39){
		derecha = true;
		izquierda = false;
	}
	//Parar Video
	if(keyCode==32 && video_run==true){
		parar_video();
		keyCode=null;
	}
	//Renaudar Video
	if(keyCode==32 && video_run==false){
		renaudar_video();
		keyCode=null;
	}
}
var rectangulo_base = function(){
	ctx.fillStyle="DarkSlateBlue"
	ctx.fillRect(0,110,1000,10);
	ctx.fill();
}

var monigote = function(){
	
	this.altura = 12;
	this.anchura = 12;
	this.x = 20;
	this.y = 110-this.altura;
	this.dx = 3;
	this.dy = 3;
	
	this.pintar_monigote = function(){
		ctx.fillStyle = "orange"
		ctx.fillRect(this.x,this.y,this.anchura,this.altura);
		ctx.fill();
	}
	this.saltar_monigote = function(){
		if(this.y>50 && sube_salto==true){
			console.log("subir");
			this.y = this.y - this.dy/2;
			sube_salto = true;
			baja_salto = false;
		}			
		else{
			if(this.y<=(100-this.altura)||baja_salto==true){
				console.log("bajar");		
				if(this.y<(100-this.altura)){
					this.y = this.y + this.dy/2;
						baja_salto = true;
						sube_salto = false;
				}else{
					this.y = 110-this.altura;
					baja_salto = false;
				}				
			}	  	
		}
	}
	this.movimiento_lateral = function(){
		if(izquierda==true && (monigote1.x)>0){
			this.x = this.x - this.dx/2;
		}
		if(derecha==true && (this.x+this.anchura)<300){
			this.x = this.x + this.dx/2;
		}
	}
}
var repintar = function(){
	ctx.clearRect(0,0,8000, 8000);
	rectangulo_base();
	monigote1.movimiento_lateral();
	monigote1.saltar_monigote();
	monigote1.pintar_monigote();
	boton_pause();
}
var renaudar_video = function(){
	console.log("play_video");
	video.play();
	video_run=true;
	interval_1 = setInterval(repintar,10);	
	boton_pause();
}
var parar_video = function(){
	console.log("onkeydown");
	cargarDiv(contenedor_boton_pause,"Nuevo_Usuario.html");
	video.pause();
	video_run=false;
	clearInterval(interval_1);
	boton_pause();		
}
var boton_pause = function(){
	var boton_play = document.getElementById("button_play");
	var boton_pause = document.getElementById("button_pause");
	var boton_refresh_1 = document.getElementById("button_refresh_1");
	var boton_refresh_2 = document.getElementById("button_refresh_2");
	if(video_run==true){
		boton_play.style.display = "none";
		boton_refresh_1.style.display = "none";
		boton_refresh_2.style.display = "initial";
		boton_pause.style.display = "initial";
	}
	if(video_run==false){
		boton_play.style.display = "initial";
		boton_refresh_1.style.display = "initial";
		boton_refresh_2.style.display = "none";
		boton_pause.style.display = "none";
	}	
}



function cargarDiv(div,url)
{
      $(div).load(url);
}
//Llamamos al Ajax para distintos navegadores
/*function ajaxFunction() {
	var xmlHttp;
	try {
	// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
		return xmlHttp;
	} catch (e) {
	// Internet Explorer
		try {
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		return xmlHttp;
		} catch (e) {
			try {
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				return xmlHttp;
			} catch (e) {
				alert("Tu navegador no soporta AJAX!");
				return false;
			}
		}
	}
}*/

//función para mandar llamar nuestra página de manera asíncrona

/*function Enviar(_pagina,capa) {
var
ajax;
ajax = ajaxFunction();

ajax.open("POST", _pagina, true);

ajax.setRequestHeader("Content-Type",
"application/x-www-form-urlencoded");
ajax.onreadystatechange = function()
{

if (ajax.readyState == 4)
{
document.getElementById(capa).innerHTML =
ajax.responseText;

}}
ajax.send(null);
}*/
