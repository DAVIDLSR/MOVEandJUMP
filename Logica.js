window.onload = function(){
	//JUEGO
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	video_run = true;
	array_blq = [];
	array_pel=[];
	array_diam=[];
	no_choca = true;
	vidas = 2; 
	muerto = false;  
	numero_diam = 0;
	//CRONOMETRO
	record1 =new Record();
	to_compare=0;
	si_empezado=false;
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
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
		tiempo_random_2 = 1000+Math.random()*1000;//1 segundo para pelota//para crear pelotas cada tiempo random
		interval_2=setInterval(crear_pelota,tiempo_random_2);
		tiempo_random_3 = Math.random()*1000+7000; //7 segundos para bloques
		interval_3 = setInterval(crear_bloque, tiempo_random_3);
		tiempo_random_4 = Math.random()*1000+10000; //10 segundos para diamantes
		interval_4 = setInterval(crear_diamante, tiempo_random_4);
		//interval_5 = setInterval(coger_diamante, 10);
		interval_6 = setInterval(cronometro, 10);
	}
}
//PAGINA PRINCIPAL
//----------CAMBIO DE PESTAÑAS 
function cambiarPag(activo){
	 for(var i=0;i<elem.length;i++){//con este bucle detectamos los que hemos pulsado y los que no
        if(activo==elem[i]){
            eleccion=i;
            //console.log(eleccion);
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
//----------CANVAS DIBUJO 
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
//----------FUNCIONES DEL DIBUJO
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
//----------RECONOCIMIENTO TECLADO 
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
	//Reanudar Video
	if(keyCode==32 && video_run==false){
		reanudar_video();
		keyCode=null;
	}
}
var rectangulo_base = function(){
	ctx.fillStyle="DarkSlateBlue"
	ctx.fillRect(0,380,1000,45);
	ctx.fill();
}
//----------CREA PELOTA
var crear_pelota=function(){
	pelota1 =new pelota();
	array_pel.push(pelota1);
}
var pelota = function(){
	this.radio = 14; 
	this.pelotax = Math.random()*930;
	this.pelotay= this.radio ;//nos lo sacara siempre desde arriba
	this.despel=1;//desplazamiento de la pelota
	this.pintar_pelota=function(){
		//console.log('pintamos pelota');
		ctx.fillStyle='white';
		ctx.beginPath();
		ctx.arc(this.pelotax,this.pelotay,this.radio,0,2*Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
	this.movimiento_pelota=function(){
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
				alert('HAS COLISIONADO');
				this.pelotax=0;
				this.pelotay=0;
				muerte();
			}
	}
}
//----------CREA BLOQUE
var crear_bloque = function(){
	bloque1 = new bloque();
	array_blq.push(bloque1);
}
var bloque = function(){
	this.blqlado = 55;
	this.blqx = 885; 
	this.blqy = Math.random()*(180) + 100; //para que quede por encima del cuadrado y no en el rectangulo base
	this.blqdx = 0.68;
	this.pintar_bloque = function(){
		ctx.fillStyle = "Chartreuse";
		ctx.beginPath();
		ctx.fillRect(this.blqx, this.blqy, this.blqlado, this.blqlado);
		ctx.closePath();
		ctx.fill();
	}
	this.movimiento_bloque = function(){
		this.blqx = this.blqx-this.blqdx; 
	}
	this.colision_bloque = function(){
		if(no_choca == true){
			if( ((monigote1.x+monigote1.lado)>=this.blqx) && 
			(monigote1.x<=(this.blqx+this.blqlado)) && 
			(monigote1.y<=(this.blqy+this.blqlado)) && 
			((monigote1.y+monigote1.lado)>=this.blqy)){
				alert("COLISIOOOOOOOOOOON");
				no_choca = false;
				this.blqx= 940; 
				this.blqy=Math.random()*(180) + 100;
				muerte();
			}
		}
		else{
			no_choca = true; 
		}
	}
}
//----------CREA DIAMANTE
var crear_diamante = function(){
	diamante1 = new diamante();
	array_diam.push(diamante1);
}
var diamante = function(){
	this.rnd = 100+Math.random()*200;
	this.diamx = 940; 
	this.diamdx =0.5; 
	this.pintar_diamante=function(){
		ctx.fillStyle = "cyan";
		ctx.beginPath();
		ctx.moveTo(this.diamx-12, this.rnd);
		ctx.lineTo(this.diamx, this.rnd+20);
		ctx.lineTo(this.diamx-12, this.rnd+40);
		ctx.lineTo(this.diamx-24, this.rnd+20);
		ctx.fill();
	}
	this.movimiento_diamante = function(){
		this.diamx = this.diamx-this.diamdx; 
	}
	this.coger_diamante = function(){
		centro_x = this.diamx-12; 
		centro_y = this.rnd+20;
		if(centro_x>monigote1.x && centro_x<(monigote1.x+monigote1.lado)){
			if(centro_y>monigote1.y && centro_y<(monigote1.y+monigote1.lado)){
				console.log("cojo diamante");
				this.diamx = 940; 
				this.rnd = 100+Math.random()*200;
				numero_diam = numero_diam+1000; 
				console.log(numero_diam);
				diams = document.getElementById("diamondsb");
				diams.innerHTML = numero_diam;
			}
		}
	}
}
//----------FUNCION MUERTE (2 VIDAS)
var muerte=function(){
	vidas--;
	if(vidas==1){
		console.log('te queda una vida');
		monigote1.lado=70;
		monigote1.y = 310; 
	}else if(vidas==0){
		console.log('has muerto');
		muerto==true;
	    var im= document.getElementById('muerte').classList;
	    select[1].classList.remove('visible');
	    select[1].classList.add('invisible');
	    im.remove('invisible');
	    im.add('visible');
	    clearInterval(interval_1);
		clearInterval(interval_2);
		clearInterval(interval_3);
		//clearInterval(interval_4);
		//clearInterval(interval_5);
		clearInterval(interval_6);
		sube_salto = false;
		baja_salto = false;
		izquierda = false;
		derecha = false;
		parar_video();
		var puntuacion = document.getElementById("marcador");
		if (comparar()){
			puntuacion.innerHTML = "PUNTOS: " + PT;
			document.getElementById("winner").style.display=block;
		}else{
			puntuacion.innerHTML = "PUNTOS: " + PT;
		}
		var volver_inicio=document.getElementById('volverinicio');
		console.log(volver_inicio);
		volver_inicio.onclick=function(){
		im.remove('visible');
    	im.add('invisible');
		select[0].classList.remove('invisible');
		select[0].classList.add('visible');
		window.onload();
		}  
	}
}
//----------DIBUJA MONIGOTE
var monigote = function(){
	this.lado = 45;
	this.x = 20;
	this.y = 380-this.lado;
	this.dx = 4;
	this.dy = 4;
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
		if(this.y>50 && sube_salto==true){
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
//----------RECORD	
var Record = function(){
	this.name="x";
	this.total=0;
}
//----------FUNCIÓN CRONOMETRO
function cronometro () {
	if (centesimas < 99) {
		centesimas++;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
		if (segundos < 10) { segundos = "0"+segundos }
		Segundos.innerHTML = ":"+segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
		if (minutos < 10) { minutos = "0"+minutos }
		Minutos.innerHTML = ":"+minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
		horas ++;
		if (horas < 10) { horas = "0"+horas }
		Horas.innerHTML = horas;
	}
	to_compare++;
	console.log("to compare="+to_compare);
}
//PUNTUACIÓN
var comparar = function(){
	PT=to_compare+numero_diam;
	if (PT>record1.total){
		record1.total=PT;
		return true;
	}else{
		PT=0;
		return false;
	}
}
//----------FUNCIÓN REPINTAR
var repintar = function(){
	ctx.clearRect(0,0,8000, 8000);
	rectangulo_base();
	monigote1.movimiento_lateral();
	monigote1.saltar_monigote();
	monigote1.pintar_monigote();
	for(var i=0;i<array_pel.length;i++){
		array_pel[i].pintar_pelota();
		array_pel[i].movimiento_pelota();
		array_pel[i].colision_pelota();
	}
	for(var i=0; i<array_blq.length; i++){
		array_blq[i].movimiento_bloque();
		array_blq[i].pintar_bloque();
		array_blq[i].colision_bloque();
	}
	for(var i=0; i<array_diam.length; i++){
		array_diam[i].movimiento_diamante();
		array_diam[i].pintar_diamante();
		array_diam[i].coger_diamante();
	}
	boton_pause();
	empezarPause();
}
//----------FUNCIONES DE VÍDEO 
var reanudar_video = function(){
	console.log("play_video");
	video.play();
	video_run=true;
	interval_1 = setInterval(repintar,10);
	interval_2 =setInterval(crear_pelota,tiempo_random_2);
	interval_3 = setInterval(crear_bloque, tiempo_random_3);
	interval_4 = setInterval(crear_diamante, tiempo_random_4);
	//interval_5 = setInterval(diamante1.coger_diamante, 10);
	interval_6 = setInterval(cronometro,10);
	boton_pause();
}
var parar_video = function(){
	console.log("onkeydown");
	console.log(contenedor_boton_pause);
	video.pause();
	video_run=false;
	clearInterval(interval_1);//repintar
	clearInterval(interval_2);//pelota
	clearInterval(interval_3);//bloque
	clearInterval(interval_4);//diamante
	//clearInterval(interval_5);//puntos diamante
	clearInterval(interval_6);//cronometro
	boton_pause();	
	console.log("puntos = "+numero_diam);
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
	clearInterval(interval_4);
	//clearInterval(interval_5);
	clearInterval(interval_6);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Centesimas.innerHTML = ":00";
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
	Horas.innerHTML = "00";
	si_empezado=false;
	window.onload();
}
