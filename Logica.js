window.onload = function(){
	//JUEGO
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	video_run = true;
	//DIBUJAR
	color=document.getElementById('colores').value;//si no eligen nada lo ponemos negro por defecto
	tamaño=10;
	pintura=false;
	cogergoma=false;//para cuando cojamos el lapiz actualizar el color
	guardar_imagen=false;
	canvas2=document.getElementById('micanvas2');
	canvas2.onmousedown=activar;
	canvas2.onmousemove=dibujar;
	canvas2.onmouseup=desactivar;
	goma=document.getElementById('goma');
	goma.onclick=borrador;
	lapiz=document.getElementById('lapiz');
	lapiz.onclick=pintar;
	g=document.getElementById('guardar');
	g.onclick=guardar;
	init();
}
var init = function(){
	console.log(window.window.innerWidth);
	//CAMBIO DE PESTAÑAS
	select = [];
	elem=[];
	for(var i=0;i<3;i++){
		select.push(document.getElementsByTagName('section')[i]);
	}
	for(var j=0;j<3;j++){
		elem.push(document.getElementsByTagName('a')[j]);
		elem[j].onclick=function(evt){
			cambiarPag(evt.target);
		}
	}
	//JUEGO
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

function cambiarPag(activo){
	 for(var i=0;i<elem.length;i++){//con este bucle detectamos los que hemos pulsado y los que no
        if(activo==elem[i]){
            var eleccion=i;
            console.log(eleccion);
        }else{
            var noelec=[];
            noelec.push(i);
            var noseleccionado=select[noelec].classList;
            //los que no hemos pulsado los hacemos invisibles
            if(noseleccionado.contains('visible')){
                noseleccionado.remove('visible');
            }
            if(!noseleccionado.contains('invisible')){
                noseleccionado.add('invisible');
            }
        }
    }
     var seleccionado= select[eleccion].classList;
    //hacemos visible el que hayamos pulsado
    if(seleccionado.contains('invisible')){
        seleccionado.remove('invisible');
    }
    seleccionado.add('visible');
}

	
//DIBUJO

function dibujar(event){
	if(canvas2 && canvas2.getContext){
		var ctx2=canvas2.getContext('2d');
		var posx=event.clientX -300;//sirve para coger la coordenada x del raton
		var posy=event.clientY-310;
		console.log(canvas2.getAttribute("width"));
		console.log(canvas2.getAttribute("height"));
		if(pintura==true){
			if(cogergoma==false){
				color=document.getElementById('colores').value;
				//si no lo ponemos aqui, si elegimos color despues de pulsar el lapiz no se actualiza
				console.log('vamos a pintar')
				ctx2.fillStyle=color;
				ctx2.beginPath();
				ctx2.fillRect(posx,posy,tamaño,tamaño);//vamos pintando un rect(linea ancha) donde esta el raton
				if(pintura==false){
					ctx2.closePath();
					ctx2.stroke();
				}

			}else{//if cogergoma==true queremos que nos borre el camino, no que nos lo pinte en blanco
				console.log('cogemos la goma');
				ctx2.clearRect(posx,posy,tamaño,tamaño);
			}
		}
	}
}

function activar(){
	pintura=true;
}
function desactivar(){
	pintura=false;
}
function borrador(){
	cogergoma=true;//para que luego no nos actualice el color y podamos pintar en blanco
	//de aqui cuando entremos en dibujar pintaremos en blanco
}
function pintar(){
	cogergoma=false;
	console.log(color);
}
function guardar(){
	if(canvas2 && canvas2.getContext){
		ctx2=canvas2.getContext('2d');
		image = new Image();
		//image.id = "pic"
		image.src = canvas2.toDataURL();
		/*imagen=ctx2.getImageData(20,20,canvas2.getAttribute('width'),canvas2.getAttribute('height'));
		console.log(imagen);*/
		guardar_imagen=true;
	}
	
}

//JUEGO
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
	console.log(contenedor_boton_pause);
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
