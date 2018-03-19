window.onload = function(){
	sube_salto = false;
	baja_salto = false;
	izquierda = false;
	derecha = false;
	color=document.getElementById('colores').value;//si no eligen nada lo ponemos negro por defecto
	tamaño=10;
	pintura=false;
	cogergoma=false;//para cuando cojamos el lapiz actualizar el color
	guardar_imagen=false;
	canvas2=document.getElementById('micanvas2');
	canvas2.onmousemove=dibujar;
	canvas2.onmousedown=activar;
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
	//estos dos arrays nos sirven para poder cambiar de pestañas cuando pulsemos los diferentes elementos del menu
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
	
	canvas = document.getElementById("micanvas");
	vid = document.getElementById("mivideo");
	if(canvas && canvas.getContext){
		monigote1 = new monigote();
		ctx = canvas.getContext("2d");
		document.onkeydown = movimiento_key_down;
		document.onkeyup = movimiento_key_up;
		var video = document.getElementById("mivideo");
		interval = setInterval(monigote1.repintar_monigote,10);	
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
		var x=event.clientX;//sirve para coger la coordenada x del raton
		var y=event.clientY;
		if(pintura==true){
			if(cogergoma==false){
				color=document.getElementById('colores').value;
				//si no lo ponemos aqui, si elegimos color despues de pulsar el lapiz no se actualiza
				console.log('vamos a pintar')
				ctx2.fillStyle=color;
				ctx2.beginPath();
				ctx2.fillRect(x,y,tamaño,tamaño);//vamos pintando un rect(linea ancha) donde esta el raton
				if(pintura==false){
					ctx2.closePath();
					ctx2.stroke();
				}

			}else{//if cogergoma==true queremos que nos borre el camino, no que nos lo pinte en blanco
				console.log('cogemos la goma');
				ctx2.clearRect(x,y,tamaño,tamaño);
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
}

var monigote = function(){
	this.x = 100;
	this.y = 380;
	this.dx = 5;
	this.dy = 5;
	

	this.rectangulo_base = function(){
		ctx.fillStyle="DarkSlateBlue"
		ctx.fillRect(0,420,1000,35);
		ctx.fill();
	}
	this.saltar_monigote = function(){
		if(this.y>200 && sube_salto==true){
			this.y = this.y - this.dy;
			sube_salto = true;
			baja_salto = false;
		}			
		else{
			if(this.y<=250||baja_salto==true){
				if(this.y<380){
					this.y = this.y + this.dy;
						baja_salto = true;
						sube_salto = false;
				}else{
					this.y = 380;
					baja_salto = false;
				}				
			}	  	
		}
	}
	this.movimiento_lateral = function(){
		if(izquierda==true && (monigote1.x)>0){
			this.x = this.x - this.dx/2;
		}
		if(derecha==true && (this.x+40)<canvas.getAttribute("width")){
			this.x = this.x + this.dx/2;
		}
	}
	this.pintar_monigote = function(){
		if(guardar_imagen==false){
			ctx.fillStyle = "orange"
			ctx.fillRect(this.x,this.y,40,40);
			ctx.fill();
		}else{
			ctx.drawImage(image,0,0,canvas2.getAttribute('width'),canvas2.getAttribute('height'), this.x,this.y,40, 40);
		}
	}
	this.repintar_monigote = function(){
		ctx.clearRect(0,0,canvas.getAttribute("width"), canvas.getAttribute("height"));
		monigote1.rectangulo_base();
		monigote1.movimiento_lateral();
		monigote1.saltar_monigote();
		monigote1.pintar_monigote();
	}
}
