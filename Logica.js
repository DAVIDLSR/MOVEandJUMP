
window.onload = function(){
	//JUEGO
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	video_run = true;
	array_blq = [];
	array_obs=[];
	//DIBUJAR
	vidas=2;
	muerto=false;
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
	for(var i=0;i<4;i++){
		select.push(document.getElementsByTagName('section')[i]);
	}
	for(var j=0;j<4;j++){
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
		canvas.setAttribute("width", "940");
		canvas.setAttribute("height", "528");		
		monigote1 = new monigote();
		ctx = canvas.getContext("2d");
		document.onkeydown = movimiento_key_down;
		document.onkeyup = movimiento_key_up;
		interval_1 = setInterval(repintar,10);
		tiempo_random = 1000+Math.random()*1000;//para crear pelotas cada tiempo random
		interval_2=setInterval(crear_obstaculos,tiempo_random);
		tiempo_random_2 = Math.random()*1000+7000;
		interval_3 = setInterval(crear_bloque, tiempo_random_2);
	}
	
}

function cambiarPag(activo){
	 for(var i=0;i<elem.length;i++){//con este bucle detectamos los que hemos pulsado y los que no
        if(activo==elem[i]){
            eleccion=i;
            console.log(eleccion);
        }else{
            noelec=[];
            noelec.push(i);
            noseleccionado=select[noelec].classList;
            //los que no hemos pulsado los hacemos invisibles
            if(noseleccionado.contains('visible')){
                noseleccionado.remove('visible');
            }
            if(!noseleccionado.contains('invisible')){
                noseleccionado.add('invisible');
            }
        }
    }
    seleccionado= select[eleccion].classList;
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
		image.src = canvas2.toDataURL();
		guardar_imagen=true;
	}
	//ahora tenemos que hacer que al pulsar jugar con el muñeco salga el juego directamente
	var sel=select[1].classList;
	var nosel=select[2].classList;
	nosel.remove('visible');
	nosel.add('invisible');
	sel.remove('invisible');
	sel.add('visible');	
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
	ctx.fillRect(0,380,1000,45);
	ctx.fill();
}

var crear_obstaculos=function(){
	obstaculo1=new obstaculo();
	array_obs.push(obstaculo1);

}
var obstaculo = function(){
	this.radio = 14; 
	this.pelotax = Math.random()*930;
	this.pelotay= this.radio ;//nos lo sacara siempre desde arriba
	this.despel=0.5+Math.random();//desplazamiento de la pelota
	this.pintar_obstaculo=function(){
		//console.log('pintamos obs');
		ctx.fillStyle='white';
		ctx.beginPath();
		ctx.arc(this.pelotax,this.pelotay,this.radio,0,2*Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
	this.movimiento_obstaculo=function(){
		if(this.pelotax%2>=0.5){
			this.pelotax = this.pelotax - this.despel;
			this.pelotay = this.pelotay + this.despel;
		}
		else{
			this.pelotax=this.pelotax+this.despel;
			this.pelotay=this.pelotay+this.despel;
		}

	}
	this.colision_pelota=function(){//tenemos que comprobar con el array porque vamos a tener muchos objetos pelota
			if(this.pelotax-this.radio <= monigote1.x+monigote1.lado && this.pelotax+this.radio >=monigote1.x 
				&& this.pelotay-this.radio <= monigote1.y+monigote1.lado && this.pelotay+this.radio >=monigote1.y){
				muerte();
				alert('HAS COLISIONADO');
				this.pelotax=0;
				this.pelotay=0;
				
			}
		
	}
}

var bloque = function(){
	this.blqlado = 55;
	this.blqx = 885; 
	this.blqy = Math.random()*(380-2*this.blqlado); //para que quede por encima del cuadrado y no en el rectangulo base
	this.blqdx = 0.68;
	this.pintar_bloque = function(){
		ctx.fillStyle = "darkred";
		ctx.beginPath();
		ctx.fillRect(this.blqx, this.blqy, this.blqlado, this.blqlado);
		ctx.closePath();
		ctx.fill();
	}
	this.movimiento_bloque = function(){
		this.blqx = this.blqx-this.blqdx; 
		//console.log("bloquex: "+this.blqx);
		//console.log("bloquey: "+this.blqy);
	}
	this.colision_bloque = function(){
		//console.log("colision");
		if( ((monigote1.x+monigote1.lado)>=this.blqx) && 
			(monigote1.x<=(this.blqx+this.blqlado)) && 
			(monigote1.y<=(this.blqy+this.blqlado)) && 
			((monigote1.y+monigote1.lado)>=this.blqy)){
			alert("COLISIOOOOOOOOOOON");
			muerte();
		}
	}
}
var crear_bloque = function(){
	bloque1 = new bloque();
	array_blq.push(bloque1);
	//bloque1.pintar_bloque();
}

var muerte=function(){
	vidas--;
	if(vidas==1){
		console.log('te queda una vida');
	}else if(vidas==0){
		console.log('has muerto');
		muerto==true;

	   
	}

}

var monigote = function(){
	
	this.lado = 45;
	this.x = 20;
	this.y = 380-this.lado;
	this.dx = 8;
	this.dy = 8;
	this.pintar_monigote = function(){
		if(guardar_imagen==false){
			ctx.fillStyle = "orange"
			ctx.fillRect(this.x,this.y,this.lado,this.lado);
			ctx.fill();
		}else{
			ctx.drawImage(image,0,0,canvas2.getAttribute('width'),canvas2.getAttribute('height'), this.x,this.y,this.lado,this.lado);
		}
		
	}
	this.saltar_monigote = function(){
		if(this.y>167 && sube_salto==true){
			console.log("subir");
			//console.log("1: "+this.y);
			this.y = this.y - this.dy/2;
			//console.log("2: "+this.y);

			sube_salto = true;
			baja_salto = false;
		}			
		else{
			if(this.y<=(335-this.lado)||baja_salto==true){
				console.log("bajar");		
				if(this.y<(335-this.lado)){
					this.y = this.y + this.dy/2;
						baja_salto = true;
						sube_salto = false;
				}else{
					this.y = 380-this.lado;
					baja_salto = false;
				}				
			}	  	
		}
	}
	this.movimiento_lateral = function(){
		if(izquierda==true && (monigote1.x)>0){
			this.x = this.x - this.dx/2;
		}
		if(derecha==true && (this.x+this.lado)<940){
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
	for(i=0; i<array_blq.length; i++){
		array_blq[i].movimiento_bloque();
		array_blq[i].pintar_bloque();
		array_blq[i].colision_bloque();
	}
	for(var i=0;i<array_obs.length;i++){
		array_obs[i].pintar_obstaculo();
		array_obs[i].movimiento_obstaculo();
		array_obs[i].colision_pelota();
	}
	boton_pause();
	empezarPause();
}

var renaudar_video = function(){
	console.log("play_video");
	video.play();
	video_run=true;
	interval_1 = setInterval(repintar,10);
	interval_2 =setInterval(crear_obstaculos,tiempo_random);
	interval_3 = setInterval(crear_bloque, tiempo_random_2);
	boton_pause();
}

var parar_video = function(){
	console.log("onkeydown");
	console.log(contenedor_boton_pause);
	video.pause();
	video_run=false;
	clearInterval(interval_1);
	clearInterval(interval_2);
	clearInterval(interval_3);
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

function empezarPause(){//para que empiece estando en pause hasta que nos metamos en el juego
	if(select[1].classList.contains('invisible')){
		parar_video();
	}
}

var refresh = function(){
	clearInterval(interval_1);
	clearInterval(interval_2);
	clearInterval(interval_3);
	window.onload();
}
