

// линейки для окон/мебели (создается при старте)
// линейки для отображения длины/высоты стены в режиме cameraWall
function createRulerWin(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	var material = new THREE.LineBasicMaterial( mat );
	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( createGeometryCube(1, 0.025, 0.025), material );
		var v = arr[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = -0.5;
		v[3].x = v[2].x = v[5].x = v[4].x = 0.5;
		
		v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
		
		arr[i].geometry.verticesNeedUpdate = true;			
		arr[i].visible = false;	 
		arr[i].renderOrder = 1;
		arr[i].userData = {rulerwd: {cone:[]}};
		scene.add( arr[i] );
		
		for ( var i2 = 0; i2 < cdm.count; i2++ )
		{
			var cone = new THREE.Mesh(infProject.geometry.cone[1], material); 
			cone.visible = false;
			scene.add( cone );	
			
			arr[i].userData.rulerwd.cone[i2] = cone;			
		}
	}
	
	return arr;
}




// label размера длины/высоты стены в режиме cameraWall
// label размера окна/двери/объекты
function createLabelCameraWall(cdm) 
{	
	var arr = [];

	if(!Array.isArray(cdm.text)) 
	{
		var text = [];
		
		for ( var i = 0; i < cdm.count; i++ )
		{
			text[i] = cdm.text;
		}
		
		cdm.text = text;
	}
	

	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var canvs = document.createElement("canvas");
		var ctx = canvs.getContext("2d");
		
		canvs.width = 256;
		canvs.height = 256/2;
		
		if(cdm.ratio) { canvs.width = cdm.ratio.x; canvs.height = cdm.ratio.y; }
		
		ctx.font = cdm.size + 'pt Courier New';
		if(cdm.border == 'border line')
		{
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillRect(0, 0, canvs.width, canvs.height);
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	 	
		}
		else if(cdm.border == 'white')
		{
			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(0, 0, canvs.width, canvs.height);	 			
		}

		ctx.fillStyle = 'rgba(82,82,82,1)';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(cdm.text[i], canvs.width / 2, canvs.height / 2 );	
		
		var texture = new THREE.Texture(canvs);
		texture.needsUpdate = true;	
		
		if(cdm.materialTop == 'no') { var material = { transparent: true }; }
		else { var material = { transparent: true, depthTest: false }; }

		if(cdm.opacity) { material.opacity = cdm.opacity; }
		
		material.map = texture;
		var material = new THREE.MeshBasicMaterial(material);
		
		
		var label = new THREE.Mesh(cdm.geometry, material);	
		label.visible = false; 
		label.renderOrder = 1.1;
		arr[i] = label;
		scene.add( label );			
	}
	
	return arr;
}





// обновляем label 
function upLabelCameraWall(cdm)  
{		
	//if(!label){ return; }
	var canvs = cdm.label.material.map.image; 
	var ctx = canvs.getContext("2d");
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	ctx.font = (cdm.sizeText) ? cdm.sizeText+'pt Courier New' : '50pt Courier New';
	
	if(cdm.border == 'border line')
	{
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);		
	}
	else if(cdm.border == 'white')
	{
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);		
	}
	
	
	if(cdm.str)
	{
		var value = cdm.text;		
	}
	else 
	{
		var value = cdm.text * infProject.settings.unit.wall;
		if(infProject.settings.unit.wall == 1) { value += ' м'; } 		
	}
	
	ctx.fillStyle = cdm.color;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(value, canvs.width / 2, canvs.height / 2 );
	
	cdm.label.material.map.needsUpdate = true;
}






// room
function upLabelArea2(label, area, text2, size, color, border) 
{		
	if(!label){ return; }
	var canvs = label.material.map.image; 
	var ctx = canvs.getContext("2d");
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	ctx.font = size + 'pt Arial';
	
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0, 0, canvs.width, canvs.height);
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(1, 1, canvs.width - 2, canvs.height - 2);	
	
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	
	if(infProject.settings.unit.floor == 1) 
	{
		ctx.fillText('площадь : '+area+ ' м2', canvs.width / 2, canvs.height / 2 - 10 );
		ctx.fillText('объем : '+Math.round((area * infProject.settings.height) * 100) / 100 +' м3', canvs.width / 2, canvs.height / 2 + 110 );			
	}
	else if(infProject.settings.unit.floor == 0.01)
	{
		var value = Math.round(area*infProject.settings.unit.floor * 100) / 100;
		ctx.fillText('площадь участка', canvs.width / 2, canvs.height / 2 - 10 );
		ctx.fillText(value+' (сотка)', canvs.width / 2, canvs.height / 2 + 110 );			
	}
	
	label.material.map.needsUpdate = true;
}








// из массива объектов, находим ближайший левый и правый объект от выбранного объекта
// 1. находим ближайший левый и правый объект
// 2. находим ближайшую точку к выбранному объекту
function getNearlyWinV(arr, obj, wall, z)
{
	var hitL = null;
	var hitR = null;
	
	var xL = -999999;
	var xR = 999999;
	
	var posL = false;
	var posR = false;
	
	// 1
	wall.updateMatrixWorld();
	var pos = wall.worldToLocal( obj.position.clone() );
	
	for ( var i = 0; i < arr.length; i++ )
	{ 
		var v = wall.worldToLocal( arr[i].position.clone() );

		if (v.x < pos.x){ if(xL <= v.x) { hitL = arr[i]; xL = v.x; } } 
		else { if(xR >= v.x) { hitR = arr[i]; xR = v.x; } }	
	}

	// 2	
	if(hitL != null)
	{
		hitL.updateMatrixWorld();
		var pos = hitL.worldToLocal( obj.position.clone() );
		var v = hitL.geometry.vertices;
			
		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist >= pos.x - v[i].x){ dist = pos.x - v[i].x; posL = v[i].clone(); }
		}
		
		posL.z = z;
		posL = hitL.localToWorld( posL.clone() );
	}
	if(hitR != null)
	{
		hitR.updateMatrixWorld();
		var pos = hitR.worldToLocal( obj.position.clone() );
		var v = hitR.geometry.vertices;

		var dist = pos.x;
		for ( var i = 0; i < v.length; i++ )
		{
			if (dist <= pos.x - v[i].x){ dist = pos.x - v[i].x; posR = v[i].clone(); }
		}
		posR.z = z;
		posR = hitR.localToWorld( posR.clone() );
	}	

	return [posR, posL];
}














