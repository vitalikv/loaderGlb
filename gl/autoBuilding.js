

//getAutoBuildingJson();

function getAutoBuildingJson()
{
	$.ajax
	({
		url: infProject.path+'auto_building/room2.json',
		type: 'POST',
		dataType: 'json',
		success: function(json)
		{ 
			readAutoBuildingJson({json: json});
		},
	});	
}



function readAutoBuildingJson(cdm)
{
	var rooms = cdm.json.rooms;
	var middle_wall = cdm.json.middle_wall;
	
	var arr = [];
	var point = [];
	
	var id = 1;
	
	for( var i = 0; i < rooms.length; i++ )
	{
		var w = rooms[i].walls;
		arr[i] = {w: []};
		var p = [];
		
		for( var i2 = 0; i2 < w.length; i2++ )
		{
			var x = w[i2].inner_part.point_1.x/100 * 3;
			var z = w[i2].inner_part.point_1.y/100 * 3;
			var pos = new THREE.Vector3(x, 0, z);
			
			var copy = null;
			
			for( var i3 = 0; i3 < point.length; i3++ )
			{
				if(comparePos(pos, point[i3].pos, {kof: 0.1}))
				{
					copy = point[i3];
					break;
				}						
			}
			
			if(copy)
			{
				p[i2] = copy;
			}
			else
			{
				var n = point.length;
				point[n] = {id: id, pos: pos}; id++;
				
				p[i2] = point[n];
			}
			
		}
		
		for( var i2 = 1; i2 < p.length; i2++ )
		{
			arr[i].w[i2 - 1] = null;
			
			if(p[i2 - 1] != p[i2])
			{
				arr[i].w[i2 - 1] = {};
				arr[i].w[i2 - 1].p = [p[i2 - 1], p[i2]];
			}						
		}
	}
	

	var geometry = createGeometryCube(0.2, 0.2, 0.2);
	var material = new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 1, depthTest: false }); 


	for( var i = 0; i < middle_wall.length; i++ )
	{
		var x = middle_wall[i].inner_part.point_1.x/100 * 3;
		var z = middle_wall[i].inner_part.point_1.y/100 * 3;
		var pos = new THREE.Vector3(x, 0, z);
		
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(pos.x, 0.3, pos.z);
		scene.add( cube ); 					
	}
	
	
	console.log('AutoBuildingJson');
	console.log(arr.length, arr[0].w.length, arr);
	
	
	for( var i = 0; i < arr.length; i++ )
	{
		for( var i2 = 0; i2 < arr[i].w.length; i2++ )
		{
			if(!arr[i].w[i2]) continue;
			
			var point1 = findObjFromId( 'point', arr[i].w[i2].p[0].id );
			var point2 = findObjFromId( 'point', arr[i].w[i2].p[1].id );	
			
			if(point1 == null) { point1 = createPoint( arr[i].w[i2].p[0].pos, arr[i].w[i2].p[0].id ); }
			if(point2 == null) { point2 = createPoint( arr[i].w[i2].p[1].pos, arr[i].w[i2].p[1].id ); }	

			var obj = crtW({p: [point1, point2], width: 0.01}); 
		}
	}
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY_2(obj_point[i]); }
	
	upLabelPlan_1(infProject.scene.array.wall);	// размеры стен
	detectRoomZone();	// пол		
	
	centerCamera2D();
	
	rayCrossWall();
	
	renderCamera();
}



function rayCrossWall()
{
	var floor = infProject.scene.array.floor;
	var inf = [];
	
	for ( var i = 0; i < floor.length; i++ )
	{
		for ( var i2 = 0; i2 < floor[i].userData.room.w.length; i2++ )
		{
			var wall = floor[i].userData.room.w[i2];
			var side = floor[i].userData.room.s[i2];
			
			var line = setRay({wall: wall, side: side});
			
			for ( var i3 = 0; i3 < floor.length; i3++ )
			{
				if(floor[i] == floor[i3]) continue;
				
				var cross = [];
				
				for ( var i4 = 0; i4 < floor[i3].userData.room.w.length; i4++ )
				{
					var res = crossWallinPoint({dir: line, w2: floor[i3].userData.room.w[i4]});
					
					if(res) { cross[cross.length] = res; }
				}
				
				inf[inf.length] = {wall: wall, cross: []};
			}
		}
	}
	
	
	function setRay(cdm)
	{
		var wall = cdm.wall;
		var side = cdm.side;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;
		
		var dir = wall.getWorldDirection(new THREE.Vector3());
		
		if(side == 1) { dir.x *= -1; dir.y *= -1; dir.z *= -1; }
		
		wall.updateMatrixWorld();
		wall.geometry.computeBoundingSphere();
		var pos = wall.localToWorld( wall.geometry.boundingSphere.center.clone() );	

		var arrowHelper = new THREE.ArrowHelper( dir, pos, 1, 0xff0000 );
		scene.add( arrowHelper );

		var line = {p1: pos, p2: pos.clone().add(dir)};
		
		return line;
	}
	
	
	// проверка пересеклась ли стена с другой стеной (когда тащим точку)
	function crossWallinPoint(cdm)
	{
		var dir = cdm.dir;
		var w2 = cdm.w2;
		
		var p0 = dir.p1;
		var p1 = dir.p2;
		var p2 = w2.userData.wall.p[0].position;
		var p3 = w2.userData.wall.p[1].position;
		
		if( !CrossLine(p0, p1, p2, p3) ) { return null; }		// стены не пересеклись
		
		var pos = crossPD_1(p0, p1, p2, p3);
		
		if(pos && 1==2)
		{ 
			var material = new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 1, depthTest: false }); 
			var cube = new THREE.Mesh( createGeometryCube(0.2, 0.2, 0.2), material );
			cube.position.set(pos.x, 1, pos.z);
			scene.add( cube ); 				
		}
		
		return pos;
	}


	// точка пересечения двух прямых 2D
	function crossPD_1(a1, a2, b1, b2)
	{
		var t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
		var t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);

		var point = new THREE.Vector3();
		var f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001){ return null; } // параллельны 
		
		point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
		
		return point;
	}	
	
}






