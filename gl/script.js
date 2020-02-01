


var w_w = window.innerWidth;
var w_h = window.innerHeight;
var aspect = window.innerWidth/window.innerHeight;
var d = 5;

var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );


//renderer.gammaInput = true;
//renderer.gammaOutput = true;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
//renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor (0xffffff, 1);
//renderer.setClearColor (0x9c9c9c, 1);
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdefbff );
scene.fog = new THREE.Fog('lightblue', 100, 200);
//----------- cameraTop
var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.zoom = infProject.settings.camera.zoom;
cameraTop.updateMatrixWorld();
cameraTop.updateProjectionMatrix();
//----------- cameraTop


//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.01, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
camera3D.userData.camera.click = { pos : new THREE.Vector3() }; 
//----------- camera3D




//----------- cameraWall
var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2
//----------- cameraWall






var cube = new THREE.Mesh( createGeometryCube(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );
//scene.add( cube ); 




//----------- render
function animate() 
{
	requestAnimationFrame( animate );	

	cameraZoomTopLoop();	
	moveCameraToNewPosition();
	
	updateKeyDown();
}


function renderCamera()
{
	camera.updateMatrixWorld();	
	
	composer.render();
}
//----------- render


//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = window.innerWidth / window.innerHeight;
	var d = 5;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	cameraWall.left = -d * aspect;
	cameraWall.right = d * aspect;
	cameraWall.top = d;
	cameraWall.bottom = -d;
	cameraWall.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderCamera();
}
//----------- onWindowResize





//----------- start


var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;

var kof_rd = 1;

var countId = 2;
var camera = cameraTop;
var obj_point = [];
var room = [];
var ceiling = [];
var arrWallFront = [];
//var lightMap_1 = new THREE.TextureLoader().load(infProject.path+'img/lightMap_1.png');
var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;
infProject.settings.active = { pg: 'pivot' };
infProject.settings.door = { width: 1, height: 2.2 };
infProject.settings.wind = { width: 1, height: 1, h1: 1.0 };
infProject.camera = { d3: { theta: 0, phi: 75, targetPos: new THREE.Vector3() } };
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.grid = { obj: createGrid(infProject.settings.grid), active: false, link: false, show: true };
infProject.scene.block = { key : { scroll : false } };		// блокировка действий/клавишь
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : createCircleSpline() }
infProject.geometry.cone = [createGeometryCone_1({r1: 0.003, r2: 0.03, h: 0.25}), createGeometryCone_1({r1: 0.001, r2: 0.04, h: 0.1})];
infProject.geometry.labelWall = createGeometryPlan(0.25 * 2, 0.125 * 2);
infProject.geometry.labelFloor = createGeometryPlan(1.0 * kof_rd, 0.25 * kof_rd);
infProject.geometry.labelWD = createGeometryPlan2(0.25 * kof_rd, 0.125 * kof_rd);
infProject.scene.substrate = { ruler: [], floor: [], active: null };
infProject.scene.substrate.ruler = createToolRulerSubstrate(); 
infProject.scene.size = { wd_1: {} };	// wd_1 линейки для окон/мебели
infProject.scene.size.wd_1.line = createRulerWin({count : 6, color : 0x616161});	
infProject.scene.size.wd_1.label = createLabelCameraWall({ count: 6, text: 0, size: 50, ratio: {x:256*2, y:256}, border: 'border line', geometry: infProject.geometry.labelWD, opacity : 0.5 });
// controllWD контроллеры для изменения ширины/длины wd
infProject.tools = { pivot: createPivot(), gizmo: createGizmo360(), cutWall: [], point: createToolPoint(), axis: createLineAxis(), controllWD: createControllWD() } 

infProject.catalog = { obj: infoListObj(), texture: infoListTexture() }; 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 

infProject.ui = {}
infProject.ui.list_wf = [];
infProject.ui.right_menu = {active: ''};

console.log(infProject);





var planeMath = createPlaneMath();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  

//----------- Light
{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 )
	scene.add( light );
	
	infProject.scene.light.global = {ambient: light, point: lights};
}



// outline render
{
	var composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, cameraTop );
	var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, cameraTop );	
	
	composer.setSize( window.innerWidth, window.innerHeight );
	composer.addPass( renderPass );
	composer.addPass( outlinePass );


	if(infProject.settings.shader.saoPass)
	{
		var saoPass = new THREE.SAOPass(scene, camera, true, true);	
		//saoPass.resolution.set(8192, 8192);
		saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		saoPass['params']['saoBias'] = 1;
		saoPass['params']['saoIntensity'] = .05;
		saoPass['params']['saoScale'] = 100;
		saoPass['params']['saoKernelRadius'] = 5;
		saoPass['params']['saoMinResolution'] = 0;
		saoPass['params']['saoBlur'] = true;
		saoPass['params']['saoBlurRadius'] = 8;
		saoPass['params']['saoBlurStdDev'] = 4;
		saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		composer.addPass( saoPass );		
	}
	
	if(infProject.settings.shader.fxaaPass !== undefined)
	{
		var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
		fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );	
		fxaaPass.enabled = false;
		
		composer.addPass( fxaaPass ); 	
	}	
	

	outlinePass.visibleEdgeColor.set( '#25db00' );
	outlinePass.hiddenEdgeColor.set( '#25db00' );
	outlinePass.edgeStrength = Number( 5 );		// сила/прочность
	outlinePass.edgeThickness = Number( 0.01 );	// толщина

	outlinePass.selectedObjects = [];


	function outlineAddObj( obj, cdm )
	{	
		if(!cdm) cdm = {};
		
		var arr = [obj];
		if(cdm.arrO) { var arr = cdm.arrO; }	
		
		outlinePass.selectedObjects = arr;  
	}

	function outlineRemoveObj()
	{
		outlinePass.selectedObjects = [];
	}	
}



// cdm
{
	backgroundPlane();
	createSubstrate({ pos: {y: 0.01} }); 	// подложка
	startPosCamera3D({radious: 15, theta: 90, phi: 35});		// стартовое положение 3D камеры
	addObjInCatalogUI_1();			// наполняем каталог объектов UI
	addTextureInCatalogUI_1();		// наполняем каталог текстур UI
	addTextureInCatalogUI_2();
	changeRightMenuUI_1({name: 'button_wrap_object'});	// назначаем первоначальную вкладку , которая будет включена
	//changeRightMenuUI_1({name: 'button_wrap_img'});	
	//changeRightMenuUI_1({name: 'button_wrap_plan'});
	startRightPlaneInput({});

	//getAutoBuildingJson();	
}

//----------- start




  
function sliderSunIntensity(cdm)
{
	if(!cdm) cdm = {};
	
	function Plugin() 
	{ 	
		var block = $('[nameId="panel_catalog_1"]')[0];
		//console.log(99999999, block);
		this.block = block;
		//this.circleMax = block.querySelector('.bl_fd24'); 
		this.circleMin = block.querySelector('.bl_fd31'); 
		this.handle = block.querySelector('[nameId="sun_intensity_handle"]');
		this.text = block.querySelector('[nameId="sun_intensity_div"]');   
		this.value = (cdm.value !== undefined) ? cdm.value : 0.5;
		
		this.init();
	}


	Plugin.prototype.init = function () 
	{	
		var self = this;
		
		$(self.handle).on("mousedown touchstart", function (event) { self.startDrag(event); });
		
		self.update();
	};


	Plugin.prototype.startDrag = function (event) 
	{
		var self = this;
		
		$(self.block).on("mousemove touchmove", function (event) { self.drag(event); });
		$(self.block).on("mouseup touchend", function (event) { self.stopDrag(event); });
		
		$(window).on("mousemove touchmove", function (event) { self.drag(event); });
		$(window).on("mouseup touchend", function (event) { self.stopDrag(event); });	
	};


	Plugin.prototype.stopDrag = function () 
	{
		var self = this;
		
		$(window).off("mousemove mouseup");
		$(self.block).off("mousemove mouseup");	
		
		self.update();
	};


	Plugin.prototype.drag = function (event) 
	{        
		var self = this;  
		var circleMin = $(self.circleMin); 
		
		var pageX = event.pageX;
		var pageY = event.pageY;
		var touches = event.originalEvent.touches;
		
		// Touch device
		if (touches && touches.length === 1) 
		{
			pageX = touches[0].pageX;
			pageY = touches[0].pageY;
		}

		var deltaX = pageX - circleMin.offset().left;

		var width = 200;	//circleMin.width()
		
		if(deltaX < 0) { deltaX = 0; }
		else if(width < deltaX) { deltaX = circleMin.width(); }
		
		  
		self.value = deltaX / width;
		
		this.update();
	};


	Plugin.prototype.update = function () 
	{
		var self = this;
		var circleMin = $(self.circleMin);
		var $handle = $(self.handle);
		var $text = $(self.text);
		
		var width = 200;	//circleMin.width()
		
		var left = (self.value * width) - $handle.width() / 2;
		var top = circleMin.height() / 2 - $handle.height() / 2;
		
		//console.log(777777, self.value, circleMin.width(), left);
			
		$handle.css({ left: left, top: top });					
		
		var val = Math.round(self.value * 100)/100;
		$text.text(val);
		
		var obj = clickO.last_obj;
		
		if(obj)
		{
			if(obj.userData.tag == 'obj')
			{
				if(obj.userData.tag == 'obj')
				{
					if(obj.userData.obj3D.type == 'light point')
					{
						obj.children[1].intensity = val;						
						renderCamera();
					}
				}
			}
		}
		
	};

	new Plugin();
}


function backgroundPlane()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = infProject.path+'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1000;
			texture.repeat.y = 1000;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
}



function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	//var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}



function createGeometryPlan(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,0,-y),
				new THREE.Vector3(-x,0,y),
				new THREE.Vector3(x,0,y),
				new THREE.Vector3(x,0,-y),
			];

	var faces = [
				new THREE.Face3(0,1,2),
				new THREE.Face3(2,3,0),
			];
	var uvs1 = [
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
			];
	var uvs2 = [
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
			];			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryPlan2(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,-y,0),
				new THREE.Vector3(-x,y,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,-y,0),
			];

	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
			];
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryCube(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}




function createGeometryWall(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	if(1==1)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 3;
	geometry.faces[7].materialIndex = 3;
	
	return geometry;
}



function createLineAxis() 
{
	var axis = [];
	
	var geometry = createGeometryCube(0.5, 0.02, 0.02);		
	var v = geometry.vertices;	
	v[3].x = v[2].x = v[5].x = v[4].x = 500;
	v[0].x = v[1].x = v[6].x = v[7].x = -500;	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, depthTest: false, lightMap : lightMap_1 } );
	
	for(var i = 0; i < 2; i++)
	{
		axis[i] = new THREE.Mesh( geometry, material );
		axis[i].renderOrder = 2;
		axis[i].visible = false;
		scene.add( axis[i] );				
	}		
	
	return axis;
}

// vertex для Gizmo
function createGeometryCircle( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}




function createCircleSpline()
{
	var count = 48;
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle);
		circle[i].z = Math.cos(angle);
		//circle[i].y = 0;
	}

	return circle;
}


// создаем Geometry конуса для рулеток
function createGeometryCone_1(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	var r2 = cdm.r2;
	var h = cdm.h;
	var r1 = cdm.r1;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r2 );
		v[n].y = -h;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = -h;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r1 );
		v[n].y = 0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.001;
		n++;		
	}	 
	
	return createGeometryCircle(v);
}


function createToolPoint()
{	
	var n = 0;
	var v = [];
	
	var geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
	
	var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 1.0, depthTest: false, lightMap : lightMap_1 } ) );
	obj.userData.tag = 'tool_point';
	obj.userData.tool_point = {};
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	//default vertices
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.tool_point.v2 = v2;		
	}	
	
	//upUvs_4( obj )
	return obj;
}




function upUvs_4( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}




function createPoint( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( infProject.tools.point.geometry, infProject.tools.point.material.clone() );
	point.position.copy( pos );		

	point.renderOrder = 1;
	
	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	point.visible = (camera == cameraTop) ? true : false;	
	
	scene.add( point );	
	
	return point;
}


  



function crtW( cdm ) 
{
	var point1 = cdm.p[0];
	var point2 = cdm.p[1];
	var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : infProject.settings.height; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	// default material
	{
		var color = [0x7d7d7d, 0x696969]; 	
		
		if(infProject.settings.wall.color) 
		{  
			if(infProject.settings.wall.color.front) color[0] = infProject.settings.wall.color.front; 
			if(infProject.settings.wall.color.top) color[1] = infProject.settings.wall.color.top; 
		}	
		
		var material = new THREE.MeshPhongMaterial({ color : color[0], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		var materialTop = new THREE.MeshPhongMaterial({ color: color[1], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		
		var materials = [ material.clone(), material.clone(), material.clone(), materialTop ];	
	}
	
	
	var geometry = createGeometryWall(d, height, width, offsetZ);	
	var wall = new THREE.Mesh( geometry, materials ); 
 	infProject.scene.array.wall[infProject.scene.array.wall.length] = wall;
	
	wall.label = [];
	wall.label[0] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : infProject.geometry.labelWall, opacity : 0.5 })[0];	
	wall.label[0].visible = false;
	
	wall.label[1] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : infProject.geometry.labelWall, opacity : 0.5 })[0]; 
	wall.label[1].visible = false;
	
	if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside') 
	{
		wall.label[0].visible = true;
	}
	else if(infProject.settings.wall.label == 'double') 
	{
		wall.label[0].visible = true;
		wall.label[1].visible = true;
	}
	
	
	wall.position.copy( p1 );
	
	// --------------
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = 0;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.outline = null;
	wall.userData.wall.zone = null; 
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	wall.userData.wall.area = { top : 0 }; 
	//wall.userData.wall.active = { click: true, hover: true };	
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	// top
	wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	// left
	wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	// right
	wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
	// --------------

	wall.castShadow = true;	
	wall.receiveShadow = true;
	
	upUvs_1( wall );
	
	//cdm.texture = [];
	//cdm.texture[0] = { img: infProject.path+"img/load/beton.jpg", index:1 };
	//cdm.texture[1] = { img: infProject.path+"img/load/beton.jpg", index:2 };
	//console.log('cdm.material', cdm);
	if(cdm.material)
	{  
		for ( var i = 0; i < cdm.material.length; i++ )
		{			
			setTexture({obj: wall, material: cdm.material[i]});
		}	
	}
	
	//console.log(wall);
	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	
	var n = point1.w.length;		
	point1.w[n] = wall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = wall;
	point2.p[n] = point1;
	point2.start[n] = 1;		
	
	scene.add( wall );
		
	return wall;
}


 

function rayIntersect( event, obj, t ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj,true ); }
	
	return intersects;
}




// устанавливаем текстуру
function setTexture(cdm)
{
	//if(!cdm.img) return;
	
	var img = cdm.material.img;
	
	if(!img) return;
	
	var material = (cdm.obj.userData.tag == "wall") ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1;
			texture.repeat.y = 1;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = null;
		material.needsUpdate = true; 


		if(cdm.obj.userData.tag == "wall")
		{
			cdm.obj.userData.material[cdm.material.index].img = img;
			
			if(cdm.ui)
			{
				changeTextureWall_UI_1({obj: cdm.obj});
			}
		}
		
		if(cdm.obj.userData.tag == "room" || cdm.obj.userData.tag == "ceiling")
		{
			cdm.obj.userData.material.img = img;
			
			if(cdm.ui)
			{
				changeTextureRoom_UI_1({obj: cdm.obj});
			}
		}		
		
		renderCamera();
	});			
}





// нажали на кнопку интерфейса, загружаем объект	
function clickButton( event )
{
	if(!clickO.button) return;	
	
	if(camera == cameraTop)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}
	if(camera == cameraWall)
	{
		var dir = camera.getWorldDirection();
		dir.addScalar(-10);
		planeMath.position.copy(camera.position);
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 				
	}
	
	planeMath.updateMatrixWorld();

	var intersects = rayIntersect( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(camera == cameraTop)
	{ 
		if(clickO.button == 'create_wall')
		{
			clickO.obj = null; 
			clickO.last_obj = null;
			
			var point = createPoint( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			clickO.move = point;				
		}
		else if(clickO.button == 'create_wd_2')
		{
			createEmptyFormWD_1({type:'door', lotid: 4});
		}
		else if(clickO.button == 'create_wd_3')
		{
			createEmptyFormWD_1({type:'window', lotid: 1});
		}			
		else if(clickO.button == 'add_lotid')
		{
			loadObjServer({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == camera3D)
	{
		if(clickO.button == 'add_lotid')
		{
			loadObjServer({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == cameraWall)
	{
		if(clickO.button == 'create_wd_3')
		{
			createEmptyFormWD_1({type:'window'});
		}
	}
	
	clickO.buttonAct = clickO.button;
	clickO.button = null;

	
}	
	

function clickInterface(cdm)
{
	if(clickO.move)
	{
		deActiveSelected();
		mouseDownRight();
	}

	console.log(cdm);
	if(cdm)
	{		
		deActiveSelected();	
		
		if(cdm.button == '2D')
		{  			
			changeCamera(cameraTop);
		}
		else if(cdm.button == '3D')
		{
			changeCamera(camera3D);
		}	
		else if(cdm.button == 'point_1')
		{
			clickO.button = 'create_wall';
		}
		else if(cdm.button == 'create_wd_2')
		{
			clickO.button = 'create_wd_2';
		}
		else if(cdm.button == 'create_wd_3')
		{
			clickO.button = 'create_wd_3';
		}		
		else if(cdm.button == 'add_lotid')
		{
			clickO.button = 'add_lotid';
			clickO.options = cdm.value;
		}			
		else if(cdm.button == 'grid_show_1')
		{
			showHideGrid(); 
		}
		else if(cdm.button == 'grid_move_1')
		{
			startEndMoveGrid(); 
		}
		else if(cdm.button == 'grid_link_1')
		{
			linkGrid(); 
		}		
	}

}	



// декативируем старое выделение (объект и меню)
function deActiveSelected()
{
	clickO.obj = null;
	clickO.rayhit = null;
	
	hideMenuObjUI_2D();		
}




function upUvs_1( obj )
{ 
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {
			return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;	
}





//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math
 

 
 

// screenshot
function saveAsImage() 
{ 
	try 
	{		
		renderer.antialias = true;
		renderer.render( scene, camera );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		renderer.antialias = false;
		renderer.render( scene, camera );
 
		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}


// screenshot сохраняем в bd
function saveAsImagePreview() 
{ 
	try 
	{		
		var rd = 400/window.innerWidth;
		var flag = infProject.scene.grid.obj.visible;
		
		if(flag) { infProject.scene.grid.obj.visible = false; }
		renderer.setSize( 400, window.innerHeight *rd );
		renderer.antialias = true;
		renderer.render( scene, camera );
		
		var imgData = renderer.domElement.toDataURL("image/jpeg", 0.7);	

		if(flag) { infProject.scene.grid.obj.visible = true; }
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.antialias = false;
		renderer.render( scene, camera );
		
		return imgData;
	} 
	catch (e) 
	{
		console.log(e);
		return null;
	}
}


// открыть или сохранить screenshot
var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
} 
  
 
	
	
 
function setUnits()
{
	 
}



// находим стены/точки/объекты по id
function findObjFromId( cdm, id )
{
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	var obj = infProject.scene.array.obj; 
	
	
	if(cdm == 'wall')
	{
		for ( var i = 0; i < wall.length; i++ ){ if(wall[i].userData.id == id){ return wall[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < point.length; i++ ){ if(point[i].userData.id == id){ return point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < floor.length; i++ ){ if(floor[i].userData.id == id){ return floor[i]; } }
	}
	else if(cdm == 'obj')
	{
		for ( var i = 0; i < obj.length; i++ ){ if(obj[i].userData.id == id){ return obj[i]; } }
	}
	
	return null;
}



animate();
renderCamera();



document.body.addEventListener('contextmenu', function(event) { event.preventDefault() });
document.body.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.body.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.body.addEventListener( 'mouseup', onDocumentMouseUp, false );


document.body.addEventListener( 'touchstart', onDocumentMouseDown, false );
document.body.addEventListener( 'touchmove', onDocumentMouseMove, false );
document.body.addEventListener( 'touchend', onDocumentMouseUp, false );

document.addEventListener('DOMMouseScroll', mousewheel, false);
document.addEventListener('mousewheel', mousewheel, false);	


document.body.addEventListener("keydown", function (e) 
{ 
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			console.log(infProject.activeInput);
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { inputChangeWall_1({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'size-wd-height') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'rp_wd_h1') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'size-grid-tube-xy-1')
			{
				updateGrid({size : $('[nameid="size-grid-tube-xy-1"]').val()});
			}
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				inputWidthOneWall({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'}); 
			}
			else if(infProject.activeInput == 'dp_inf_1_proj')
			{
				inputLoadProject();
			}			
		}		
		 
		return; 
	}


	if(e.keyCode == 46) { detectDeleteObj(); }
	
	if(clickO.keys[18] && e.keyCode == 90) { loadFile({json: true}); }		// alt + z
	if(clickO.keys[18] && e.keyCode == 72) { getConsoleRendererInfo(); }		// alt + h
	if(clickO.keys[18] && e.keyCode == 77) { inputLoadProject(); }				// alt + m
	if(clickO.keys[18] && e.keyCode == 84) { saveFile({json: true}); }			// alt + t
	if(clickO.keys[18] && e.keyCode == 86) { console.log(infProject); }
	if(clickO.keys[18] && e.keyCode == 86) { console.log(clickO); }  		// alt + v
	if(clickO.keys[18] && e.keyCode == 66) 	// alt + b
	{ 
		if(infProject.settings.shader.saoPass)
		{
			saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
			console.log(saoPass['params']['output']);
			renderCamera();			
		}
	}  
	
	if(e.keyCode == 66) { loadUrlFile(); } 	// b
	//if(e.keyCode == 86) { switchLight({switch: true}); } 	// v
	if(e.keyCode == 89) { saveFile({txt: true}); } 			// y
	if(e.keyCode == 86) { resetScene(); getAutoBuildingJson(); } // v
} );

document.body.addEventListener("keydown", function (e) 
{ 
	clickO.keys[e.keyCode] = true;
	if(e.keyCode == 61) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 173) { zoomLoop = 'zoomOut'; }
	if(e.keyCode == 187) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 189) { zoomLoop = 'zoomOut'; }	
});
document.body.addEventListener("keyup", function (e) 
{ 
	clickO.keys[e.keyCode] = false;
	if(e.keyCode == 173) { zoomLoop = ''; }
	if(e.keyCode == 61) { zoomLoop = ''; }
	if(e.keyCode == 187) { zoomLoop = ''; }
	if(e.keyCode == 189) { zoomLoop = ''; }		
});


// вкл/выкл сглаживание 
function switchFxaaPass(cdm)
{
	if(!cdm) return;	
	if(infProject.settings.shader.fxaaPass == undefined) return;
	
	if(cdm.switch)
	{
		var visible = (fxaaPass.enabled) ? false : true;
	}

	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}		
	
	fxaaPass.enabled = visible;		


	renderCamera();
}


// переключаем глобальное/ламповое освещение 
function switchLight(cdm)
{  
	if(!cdm) return;
	
	if(cdm.switch)
	{
		var type = infProject.settings.light.type;
		type = (type == 'global') ? 'lamp' : 'global';
		infProject.settings.light.type = type;
	}
	
	if(cdm.visible !== undefined)
	{
		var type = (cdm.visible) ? 'global' : 'lamp';
		infProject.settings.light.type = type;
	}	
	
	if(infProject.settings.light.type == 'global')
	{
		var global_intensity = 0.93;
		var global_visible = true;
		var lamp_visible = false;
	}
	else
	{
		var global_intensity = 0.5;
		var global_visible = false;
		var lamp_visible = true;			
	}
	
	for ( var i = 0; i < infProject.scene.light.lamp.length; i++ )
	{
		infProject.scene.light.lamp[i].visible = lamp_visible;
	}
	
	for ( var i = 0; i < infProject.scene.light.global.point.length; i++ )
	{
		infProject.scene.light.global.point[i].visible = global_visible;
	}		
	
	infProject.scene.light.global.ambient.intensity = global_intensity;
	
	renderCamera();
}


// загрзука проекта из базы через input
function inputLoadProject()
{
	var visible = $('[nameid="dp_inf_1"]').is(":visible");
	
	$('[nameid="dp_inf_1"]').toggle();
	
	if(visible)
	{
		var num = Number($('[nameid="dp_inf_1_proj"]').val());
		
		loadFile({id: num});
		
		console.log(num);
	}
}



// проверяем правильность ввода числа (вводим число в своих единицах, отдаем в метрах)
function checkNumberInput(cdm)
{	
	var value = cdm.value; 
	//var value = value.trim();
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!isNumeric(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } // см
		else if(cdm.unit == 0.001) { value /= 1000; } // мм
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}








function drawIntersectionPoints(cdm) 
{
	var obj = cdm.obj;
	var plane = cdm.plane;
	
	
	plane.updateMatrixWorld();
	
	var arrP = [];
	var pointsOfIntersection = new THREE.Geometry();
	var pointOfIntersection = new THREE.Vector3();	
	
	
	var a = new THREE.Vector3();
	var b = new THREE.Vector3();
	var c = new THREE.Vector3();
	var planePointA = new THREE.Vector3();
	var planePointB = new THREE.Vector3();
	var planePointC = new THREE.Vector3();
	var lineAB = new THREE.Line3();
	var lineBC = new THREE.Line3();
	var lineCA = new THREE.Line3();

	
	var mathPlane = new THREE.Plane();
	plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
	plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
	plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
	mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

	obj.geometry.faces.forEach(function(face) 
	{
		obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
		obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
		obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
		lineAB = new THREE.Line3(a, b);
		lineBC = new THREE.Line3(b, c);
		lineCA = new THREE.Line3(c, a);
		setPointOfIntersection(lineAB, mathPlane);
		setPointOfIntersection(lineBC, mathPlane);
		setPointOfIntersection(lineCA, mathPlane);
	});
	
	
	function setPointOfIntersection(line, plane) 
	{
		pointOfIntersection = plane.intersectLine(line, new THREE.Vector3());
		if (pointOfIntersection) 
		{ 
			pointsOfIntersection.vertices.push(pointOfIntersection.clone());
			arrP[arrP.length] = new THREE.Vector2(pointOfIntersection.x, pointOfIntersection.z);
		};
	}
	
	
	// отображаем точки пересечения и контур
	if(1==1)
	{
		var pointsMaterial = new THREE.PointsMaterial({ size: .1, color: "yellow" });
		var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
		scene.add(points);

		var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffff00 } );
		var line = new THREE.LineSegments( pointsOfIntersection, lineMaterial );
		scene.add( line ); 		
	}
	
	return arrP;
}


var planeGeom = new THREE.PlaneGeometry(10, 10);
//planeGeom.rotateX(-Math.PI / 2);
var plane2 = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({ color: "pink", transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
plane2.position.y = 4;
scene.add(plane2);
	
	
	
	

var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 	
		 

	 //getAutoBuildingJson();
	//loadFile({json: true});  
	//loadObjServer({lotid: 6, pos: new THREE.Vector3(1, 1, 0)});
	//loadObjServer({lotid: 6, pos: new THREE.Vector3(0, 1, 0)});
	//loadObjServer({lotid: 6, pos: new THREE.Vector3(1, 1, 1), rot: new THREE.Vector3(0, 1, 0)});
	
	// /import/furn_1.fbx 
	// /import/vm_furn_3.glb
	// /import/80105983_krovat_dafna5.glb
	
	if(1==1)	// gltf/glb
	{
		var loader = new THREE.GLTFLoader();
		loader.load( 'import/80105983_krovat_dafna9.glb', function ( obj ) 						
		{ 
			//console.log(obj);
			//var obj = obj.scene.children[0];
			var obj = obj.scene;
			
			setParamObj({obj: obj});
		});			
	}	
	
});






















