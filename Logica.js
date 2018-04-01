window.onload = function(){
	//JUEGO
	//------------Movimiento del monigote
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	//------------Contenedores: pelotas, bloques verdes y diamantes
	array_blq = [];
	array_pel = [];
	array_diam = [];
	numero_diam = 0;
	//------------Funcion muerte
	vidas = 2; 
	muerto = false;
	no_choca = true; 
	//------------Multimedia
	video_run = true;
	cancion_run = true;
	game_over= document.getElementById('muerte').classList;
	cont_anuncio = document.getElementById('anuncio');
	vid_anuncio = document.getElementById('video_anuncio');
	sale_anuncio = false;
	acaba_anuncio = false;

	//------------Cronometro
	to_compare = 0;
	si_empezado = false;
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	//cronometro_run = false;

	//DIBUJAR
	color = document.getElementById('colores').value;//si no eligen nada lo ponemos negro por defecto
	tamaño = 10;//tamaño del pincel (cuadrado de 10x10 px)
	pintura = false; //será 'true' en todo momento que pinchemos en el canvas para pintar (activado con la funcion 'activar')
	cogergoma = false;//para cuando cojamos el lapiz actualizar el color
	guardar_imagen = false;
	borrar = false;
	canvas2 = document.getElementById('micanvas2');
	canvas2.onmousedown = activar;
	canvas2.onmousemove = dibujar;
	canvas2.onmouseup = desactivar;
	goma = document.getElementById('goma');
	goma.onclick = borrador;
	lapiz = document.getElementById('lapiz');
	lapiz.onclick = pintar;
	g = document.getElementById('guardar');
	g.onclick = guardar;
	b = document.getElementById('borrar_todo');
	b.onclick = borrar_canvas;
	init();
}
var init = function(){
	console.log(window.innerWidth);
	console.log(window.innerHeight);
	//CAMBIO DE PESTAÑAS
	select = [];//contiene todas las secciones del menu 
	elem = [];//contiene los enlaces a cada seccion
	for(var i=0;i<4;i++){
		select.push(document.getElementsByTagName('section')[i]);
	}
	for(var j=0; j<4; j++){
		elem.push(document.getElementsByTagName('a')[j]);
		elem[j].onclick = function(evt){
			cambiarPag(evt.target);
		}
	}
	//JUEGO
	canvas = document.getElementById("micanvas");
	contenedor_canvas = document.getElementById("vd_container");
	video = document.getElementById("mivideo");
	contenedor_boton_pause = document.getElementById("div_pause");
	cancion = document.getElementById("micancion");
	contenedor_boton_pause = document.getElementById("div_pause");

	if(canvas && canvas.getContext){
		//Tamaño y contexto del canvas
		canvas.setAttribute("width", "940");
		canvas.setAttribute("height", "528");	
		ctx = canvas.getContext("2d");

		//elementos fijos (no se crean todo el rato)	
		monigote1 = new monigote();
		corazon = document.getElementsByClassName("fa fa-heart");
		//detector de teclas para el movimiento
		document.onkeydown = movimiento_key_down;
		document.onkeyup = movimiento_key_up;
		//Intervalos de tiempo almacenados para que al parar el juego pare todo 
		interval_1 = setInterval(repintar,10);
		tiempo_random_2 = Math.random()*1000 + 1000;//entre 1 y 2 segundos para pelota
		interval_2=setInterval(crear_pelota,tiempo_random_2);
		tiempo_random_3 = Math.random()*1000 + 7000; //entre 7 y 8 segundos para bloques
		interval_3 = setInterval(crear_bloque, tiempo_random_3);
		tiempo_random_4 = Math.random()*1000 + 10000; //entre 10 y 11 segundos para diamantes
		interval_4 = setInterval(crear_diamante, tiempo_random_4);
		interval_5 = setInterval(cronometro, 10);
	}
}
//------------CAMBIO DE PESTAÑAS 
function cambiarPag(activo){
	//Cuando el anuncio se esta reproduciendo, si se selecciona una opcion del menu el anuncio se hará 'invisible'
	if(cont_anuncio.classList.contains('visible')){
		cont_anuncio.classList.remove('visible');
		cont_anuncio.classList.add('invisible');
	}
	//Cuando aparece la imagen de Game Over y se selecciona una opcion del menu, dicha imagen se hará 'invisible'
	if(game_over.contains('visible')){
		game_over.remove('visible');
		game_over.add('invisible');
	}
	//Con este bucle detectamos los que hemos pulsado y los que no
	for(var i=0;i<elem.length;i++){
        if(activo == elem[i]){
            eleccion = i;//Posición en el array select (contenedor de secciones)
        }else{
            noelec = [];
            noelec.push(i);
            noseleccionado = select[noelec].classList;
            //Los que no hemos pulsado los hacemos invisibles
            if(noseleccionado.contains('visible')){
            	noseleccionado.remove('visible');
            }
            if(!noseleccionado.contains('invisible')){
            	noseleccionado.add('invisible');
            }
        }
    }
    seleccionado = select[eleccion].classList;
    //hacemos visible el que hayamos pulsado
    if(seleccionado.contains('invisible')){
        seleccionado.remove('invisible');
    }
    seleccionado.add('visible');
}
//DIBUJO
//------------Canvas dibujo
function dibujar(event){
	if(canvas2 && canvas2.getContext){
		var ctx2=canvas2.getContext('2d');
		//Cogemos la posición 'x' e 'y' para pintar donde este el ratón 
			//Restamos 300 y 310 para que coja las coordenadas del canvas en toda la pantalla (300 de margen izquierdo, 310px de margen superior)
		var posx = event.clientX -300;
		var posy = event.clientY-310;
		if(pintura == true){
			if(cogergoma == false){
				color = document.getElementById('colores').value;//si no lo ponemos aqui, al elegir el color despues de pulsar el lapiz no se actualiza
				//vamos pintando un rect(linea ancha) donde esta el raton
				ctx2.fillStyle = color;
				ctx2.beginPath();
				ctx2.fillRect(posx,posy,tamaño,tamaño);
				if(pintura == false){
					ctx2.closePath();
					ctx2.stroke();
				}
			}else{
				//si 'cogergoma==true' queremos que nos borre el camino, no que nos lo pinte en blanco
				ctx2.clearRect(posx,posy,tamaño,tamaño);
			}
		}
	}
}
//------------FUNCIONES DEL DIBUJO
function borrar_canvas(){
	//Borramos todo el contenido del canvas del dibujo
	if(canvas2 && canvas2.getContext){
		ctx2=canvas2.getContext('2d');
		borrar==true;
		ctx2.clearRect(0,0,canvas2.getAttribute('width'), canvas2.getAttribute('height'));
	}
}
function activar(){
	//Cuando pulsamos el raton dentro del canvas pintamos por donde pase
	pintura=true;
}
function desactivar(){
	//Cuando no estamos pulsando el raton no pinta
	pintura=false;
}
function borrador(){
	cogergoma=true;
}
function pintar(){
	cogergoma=false;
}
function guardar(){
	if(canvas2 && canvas2.getContext){
		ctx2 = canvas2.getContext('2d');
		image = new Image();
		image.src = canvas2.toDataURL();
		guardar_imagen = true;
	}
	//Para que al pulsar "JUGAR CON MI DIBUJO" vaya directamente al juego
	var sel = select[1].classList;//pestaña correspondiente a "JUEGO"
	var nosel = select[2].classList;//pestaña correspondiente a "DIBUJA TU PERSONAJE"
	//Hacemos visible el juego e invisible la seccion de dibujar
	nosel.remove('visible');
	nosel.add('invisible');
	sel.remove('invisible');
	sel.add('visible');	
}
//JUEGO
//------------Reconocimiento del teclado
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
	//Salto (flecha hacia arriba)
	if(keyCode==38 && baja_salto==false){
		sube_salto = true;
	}
	//Izquierda (flecha hacia la izquierda)
	if(keyCode==37){
		izquierda = true;
		derecha = false;
	}
	//Derecha (flecha hacia la derecha)
	if(keyCode==39){
		derecha = true;
		izquierda = false;
	}
	//Abajo (flecha hacia abajo)
	if(keyCode==40){
		sube_salto = false;
		baja_salto = true;
	}
	//Parar Video (espacio)
	if(keyCode==32 && video_run==true){
		parar_video();
		keyCode = null;
	}
	//Reanudar Video (espacio)
	if(keyCode==32 && video_run==false){
		reanudar_video();
		keyCode = null;
	}
}
var rectangulo_base = function(){
	ctx.fillStyle="DarkSlateBlue"
	ctx.fillRect(0,380,1000,45);
	ctx.fill();
}
//------------Crea pelota y la mete en su contenedor
var crear_pelota=function(){
	pelota1 = new pelota();
	array_pel.push(pelota1);
}
//------------Funcion pelota que crea un objeto con sus funciones: pintar, mover y colision
var pelota = function(){
	this.radio = 14; 
	this.pelotax = Math.random()*926;//saldra aleatoriamente desde cualquier punto de x dentro del video (anchura del video (940px)-radio)
	this.pelotay= this.radio ;//nos lo sacara siempre desde arriba
	this.despel=1;//desplazamiento de la pelota
	this.pintar_pelota=function(){
		ctx.fillStyle='white';
		ctx.beginPath();
		ctx.arc(this.pelotax,this.pelotay,this.radio,0,2*Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
	this.movimiento_pelota=function(){
		//para hacer aleatoria su pendiente establecemos una condicion de resto
		if(this.pelotax%2>=0.5){
			this.pelotax = this.pelotax - this.despel;
			this.pelotay = this.pelotay + this.despel;
		}
		else{
			this.pelotax=this.pelotax+this.despel;
			this.pelotay=this.pelotay+this.despel;
		}
	}
	this.colision_pelota=function(){
		//tenemos que comprobar con el array porque vamos a tener muchos objetos pelota
		if(this.pelotax-this.radio <= monigote1.x+monigote1.lado && 
		this.pelotax+this.radio >=monigote1.x 
		&& this.pelotay-this.radio <= monigote1.y+monigote1.lado && 
		this.pelotay+this.radio >=monigote1.y){
			//cuando se produce una colision aparecera esa pelota en el punto (0, 0) del canvas
			this.pelotax=0;
			this.pelotay=0;
			muerte();
		}
	}
}
//------------Crea bloque y la mete en su contenedor
var crear_bloque = function(){
	bloque1 = new bloque();
	array_blq.push(bloque1);
}
//------------Funcion bloque que crea un objeto con sus funciones: pintar, mover y colision
var bloque = function(){
	this.blqlado = 55;
	this.blqx = 940; 
	this.blqy = Math.random()*(180) + 100; //para que quede por encima del rectangulo base y no en él
	this.blqdx = 0.68;//esta establecido asi para que vaya a la velocidad del vídeo 
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
				no_choca = false;
				//Cuando se produce una colisión aparecerá ese bloque otra vez por la derecha
				this.blqx = 940; 
				this.blqy = Math.random()*(180) + 100;
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
	this.rnd = 100+Math.random()*200; //numero random para la coordenada 'y'
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
				//al coger un diamante suena un sonido
				var audio_diamante = new Audio('diamante.mp3');
				audio_diamante.play();
				//cuando cogemos un diamante aparecerá de nuevo por la parte derecha
				this.diamx = 940; 
				this.rnd = 100+Math.random()*200;
				//contador de diamantes, cada uno vale 1000 puntos
				numero_diam = numero_diam+1000; 
				diams = document.getElementById("diamondsb");
				diams.innerHTML = numero_diam;
			}
		}
	}
}
//------------Funcion muerte (2 vidas)
audio_muerte = new Audio('Mario_Game_Over.mp3');

var muerte = function(){
	vidas--;
	//cuando colisiona el monigote esta quieto, no guarda el movimiento anterior al choque
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	if(vidas==1){
		alert("¡Te queda una vida!")
		monigote1.lado = 70;
		monigote1.y = 310;
		//borra un corazon en la primera colisión
		corazon[vidas].classList.remove("visible");
		corazon[vidas].classList.add("invisible");

	}else if(vidas==0){
		audio_muerte.play();
		muerto == true;
		//hacemos invisible el juego y mostramos la pantalla de Game Over
	    select[1].classList.remove('visible');
	    select[1].classList.add('invisible');
	    game_over.remove('invisible');
	    game_over.add('visible');
	    //limpiamos todos los intervalos para que se pongan en 0
	    clearInterval(interval_1);//repintar
		clearInterval(interval_2);//pelota
		clearInterval(interval_3);//bloque
		clearInterval(interval_4);//diamante
		clearInterval(interval_5);//cronometro
		//El corazón que queda se borra tambien
		corazon[vidas].classList.remove("visible");
		corazon[vidas].classList.add("invisible");
		//paramos el video y mostramos la pantalla de Game Over, acompañada del sonido de fin de partida
		parar_video();
		var puntuacion = document.getElementById("marcador");
		PT=to_compare+numero_diam;
		puntuacion.innerHTML = "PUNTOS: " + PT;
		var volver_inicio=document.getElementById('volverinicio');
		volver_inicio.onclick=function(){
			game_over.remove('visible');
	    	game_over.add('invisible');
	    	console.log(select[0]);
			select[0].classList.remove('invisible');
			select[0].classList.add('visible');
			refresh();
			audio_muerte.load();
			audio_muerte.pause();
		}  
		window.onload();
	}
}
//------------Dibuja monigote
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
		//saltar hasta un limite de y>50
		if(this.y>50 && sube_salto==true){
			this.y = this.y - this.dy;
			sube_salto = true;
			baja_salto = false;
		}			
		else{
			//baja si ha llegado al limite de altura del salto o si se pulsa la flecha de bajar
			if(this.y<=(380-this.lado)||baja_salto==true){
				if(this.y<(380-this.lado)){
					this.y = this.y + this.dy;
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
		//mover izquierda
		if(izquierda==true && (monigote1.x)>0){
			this.x = this.x - this.dx/2;
		}
		//mover derecha
		if(derecha==true && (this.x+this.lado)<940){
			this.x = this.x + this.dx/2;
		}
	}
}
//------------Anuncio en medio del video 
var anuncio=function(event){
	//la variable 'tiempo' mide el tiempo actual del anuncio
	var tiempo=event.currentTime;
	//en el segundo 40 el video se empieza a reproducir
	if (tiempo>=40 && tiempo<41 && sale_anuncio==false){
		parar_video();//paramos el juego y lo ocultamos para ver el anuncio 
		select[1].classList.remove('visible');
		select[1].classList.add('invisible');
		cont_anuncio.classList.remove('invisible');
		cont_anuncio.classList.add('visible');
		vid_anuncio.play();
		sale_anuncio=true;
	}
}
var terminar_anuncio=function(event){
	//cuando el video acaba lo ocultamos y volvemos a mostrar el juego donde se habia quedado congelado	
	if(event.currentTime>30 && event.currentTime<31 && acaba_anuncio==false){
		video_anuncio.pause();
		cont_anuncio.classList.remove('visible');
		cont_anuncio.classList.add('invisible');
		select[1].classList.remove('invisible');
		select[1].classList.add('visible');
		reanudar_video();
		acaba_anuncio=true;
	}
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
}
//------------Función repintar
var repintar = function(){
	//se limpia el canvas que contiene el juego y se llama a cada objeto y sus funciones
	ctx.clearRect(0,0,8000, 8000);
	rectangulo_base();
	monigote1.movimiento_lateral();
	monigote1.saltar_monigote();
	monigote1.pintar_monigote();
	//para los contenedores creamos un for para que lo haga con cada uno de los objetos contenidos en el array
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
//------------Funciones de video
var reanudar_video = function(){
	//empiezan el video y la cancion de fondo 
	video.play();
	cancion.play();
	video_run=true;
	cancion_run=true;
	//cronometro_run=true;
	//se llama a las funciones que pintan cada objeto
	interval_1 = setInterval(repintar,10);
	interval_2 = setInterval(crear_pelota,tiempo_random_2);
	interval_3 = setInterval(crear_bloque, tiempo_random_3);
	interval_4 = setInterval(crear_diamante, tiempo_random_4);
	interval_5 = setInterval(cronometro,10);
	boton_pause();
}
var parar_video = function(){
	//Se para el video y la cancion de fondo 
	video.pause();
	cancion.pause();
	video_run=false;
	cancion_run=false;
	//Se limpian los intervalos de tiempo 
	clearInterval(interval_1);//repintar
	clearInterval(interval_2);//pelota
	clearInterval(interval_3);//bloque
	clearInterval(interval_4);//diamante
	clearInterval(interval_5);//cronometro
	boton_pause();	
}
var boton_pause = function(){
	//llamamos a los botones que salen en pantalla cuando el video esta en reproduccion y cuando esta en pause
	var boton_play = document.getElementById("button_play");//aparece en pause
	var boton_pause = document.getElementById("button_pause");//aparece en reproduccion
	var boton_refresh_1 = document.getElementById("button_refresh_1");//aparece en pause
	var boton_refresh_2 = document.getElementById("button_refresh_2");//aparece en reproduccion
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
function empezarPause(){
	//para que empiece estando en pause hasta que nos metamos en el juego
	if(select[1].classList.contains('invisible')){
		parar_video();
	}
}
var refresh = function(){
	//limpiamos los intervalos
	clearInterval(interval_1);//repintar
	clearInterval(interval_2);//pelota
	clearInterval(interval_3);//bloque
	clearInterval(interval_4);//diamante
	clearInterval(interval_5);//cronometro
	//inicializamos el cronometro
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
	Horas.innerHTML = "00";
	video.currentTime=0;
	//cronometro_run=false;
	//para que al refrescar salgan de nuevo los dos corazones (vidas)
	vidas = 2; 
	for(var i=0; i<vidas; i++){
		corazon[i].classList.remove("invisible");
		corazon[i].classList.add("visible");
	}
	//ajuste de eventos multimedia(audio y video)
	audio_muerte.pause();
	cancion.load();
	cancion.play();
	video.play();
	window.onload();
}
var refresh_muerte = function(){
	//muestra la seccion del juego 
	cambiarPag(1);
	//refresca y para la musica de fin del juego 
	refresh();
	audio_muerte.load();
	audio_muerte.pause();
	cancion.load();
	cancion.pause();
	//se ponen a 0 los intervalos
	clearInterval(interval_1);//repintar
	clearInterval(interval_2);//pelota
	clearInterval(interval_3);//bloque
	clearInterval(interval_4);//diamante
	clearInterval(interval_5);//cronometro
	//reaundamos el video 
	reanudar_video();
	
}
