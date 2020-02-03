


function fname_s_01( wd, wall )  
{
	
	
	if(!wall) { wall = wd.userData.door.wall; }		else {  }		
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;	
	var d = p1.distanceTo( p2 );		
	
	wall.geometry = fname_s_0206(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);		
		var v = wall.geometry.vertices;
	
	for ( var i = 0; i < v.length; i++ ) { v[i] = wall.userData.wall.v[i].clone(); }
	
	
	fname_s_0220( wall ); 
	
		var arrO = wall.userData.wall.arrO;
	
	for ( var n = 0; n < arrO.length; n++ )
	{
		if(arrO[n] == wd) continue;
		
		var objClone = fname_s_02( arrO[n] ); 

		var wdBSP = new ThreeBSP( objClone );    
		var wallBSP = new ThreeBSP( wall ); 					var newBSP = wallBSP.subtract( wdBSP );				wall.geometry = newBSP.toGeometry();	
	}
	
	if(arrO.length > 1 || wd == null)
	{
		wall.geometry.computeFaceNormals();

		for ( var i = 0; i < wall.geometry.faces.length; i++ )
		{
			wall.geometry.faces[i].normal.normalize();
			if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
			else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
			else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
			else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
		}		
	}			
	
	return wall; 
}




function fname_s_02( wd )
{
		var obj = new THREE.Mesh();
	obj.geometry = wd.geometry.clone(); 
	obj.position.copy( wd.position );
	obj.rotation.copy( wd.rotation );
	
		var minZ = wd.userData.door.form.v.minZ;
	var maxZ = wd.userData.door.form.v.maxZ;
	
	var v = obj.geometry.vertices;
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z -= 3.2; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z += 3.2; }

	return obj;		
}



function fname_s_03( wd, objsBSP, wall )
{  
	if(!wall) wall = wd.userData.door.wall;
	
	var wallClone = objsBSP.wall;
	var wdClone = objsBSP.wd;
	
	wdClone.position.copy( wd.position );

	var wdBSP = new ThreeBSP( wdClone );    
	var wallBSP = new ThreeBSP( wallClone ); 				var newBSP = wallBSP.subtract( wdBSP );					
	wall.geometry.dispose();	
	
	wall.geometry = newBSP.toGeometry();	
	
	wall.geometry.computeFaceNormals();
 
	for ( var i = 0; i < wall.geometry.faces.length; i++ )
	{
		wall.geometry.faces[i].normal.normalize();
		if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
		else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
		else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
		else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
	}
	
}

 
 
 
 function fname_s_04( arrW ) 
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i]; 
		
		if(wall.userData.wall.arrO.length == 0) continue;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;	
		var d = p1.distanceTo( p2 );		
		
		wall.geometry = fname_s_0206(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);			 
				var v = wall.geometry.vertices;
		for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;	
		wall.geometry.computeBoundingSphere();
	}
}
 
 
function fname_s_05( arrW )   
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i];
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			
			var wdClone = fname_s_02( wd );
			
			objsBSP = { wall : wall, wd : wdClone };		
			
			fname_s_03( wd, objsBSP );			
		}
		
		fname_s_0220( wall ); 
	}
} 





 
 


function fname_s_06( wall, index )
{
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	var h = v[1].y;	
	
	if(index == 1)
	{
		var x = v[v.length - 6].x - v[0].x;
	}
	else if(index == 2)
	{
		var x = v[v.length - 2].x - v[4].x;
	}	
	
	var space = Math.round((x * h) * 100) / 100;
	
	var length = x;
	var spaceArrO = 0;
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var v = wall.userData.wall.arrO[i].geometry.vertices;
		var h = v[1].y;
		var x = Math.abs(v[0].x * 2);
		spaceArrO += Math.round((x * h) * 100) / 100;
	}
	
	space = space - spaceArrO;	
	
	return { area : space, length : length }; 
}
 

 




function fname_s_07(arrWall, Zoom)
{
	
	if(Zoom){}
	else if(typeof Zoom !== "undefined") { Zoom = false; }
	
	for ( var i = 0; i < arrWall.length; i ++ )
	{
		var wall = arrWall[i];
		
		if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside')
		{
			var label_1 = wall.label[0]; 
		}
		else
		{
			var label_2 = wall.label[0];
			var label_1 = wall.label[1];			
		}
		
		
		if(Zoom) { var v = wall.userData.wall.v; }		
		else { var v = wall.geometry.vertices; }
		
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;

		
		if(!Zoom)
		{
			if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside')
			{
				if(infProject.settings.wall.dist == 'inside')
				{
					var dist = Math.abs( v[10].x - v[4].x );
				}
				else if(infProject.settings.wall.dist == 'outside')
				{
					var dist = Math.abs( v[6].x - v[0].x );
				}				
				else
				{
					var dist = p1.distanceTo( p2 );
				}							
				
				fname_s_0172({label : label_1, text : Math.round(dist * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});
			}
			else
			{
				var v = wall.geometry.vertices;
				var d1 = Math.abs( v[6].x - v[0].x );		
				var d2 = Math.abs( v[10].x - v[4].x );

				fname_s_0172({label : label_1, text : Math.round(d1 * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});
				fname_s_0172({label : label_2, text : Math.round(d2 * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});				
			}			
		}		
		
		var dir = new THREE.Vector3().subVectors( p2, p1 );
		var rotY = Math.atan2(dir.x, dir.z);
		var pos = dir.divideScalar ( 2 ).add( p1 );
		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }
		
		 
		var v1 = wall.label[0].geometry.vertices;
		
		var x1 = p2.z - p1.z;
		var z1 = p1.x - p2.x;		 
		 
		 
		if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside')
		{
			label_1.rotation.set( 0, rotY, 0 );
			
			var side = (infProject.settings.wall.label == 'outside') ? 1 : 2;
			
			if(wall.userData.wall.room.side2[side])
			{ 
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + (v1[1].z - v1[0].z) / 2 );
			}
			else
			{
				var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - (v1[1].z - v1[0].z) / 2 );
			}
			
			dir.y = 0.05;
			label_1.position.copy( new THREE.Vector3().addVectors( pos, dir ) );				
		}
		else
		{
			label_1.rotation.set( 0, rotY, 0 );
			label_2.rotation.set( 0, rotY, 0 );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - (v1[1].z - v1[0].z) / 2 );
			dir.y = 0.05;
			label_1.position.copy( new THREE.Vector3().addVectors( pos, dir ) );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + (v1[1].z - v1[0].z) / 2 );
			dir.y = 0.05;
			label_2.position.copy( new THREE.Vector3().addVectors( pos, dir ) );			
		}		 


		if(!Zoom)	
		{
			var v = wall.geometry.vertices; wall.geometry.verticesNeedUpdate = true;
			for ( var i2 = 0; i2 < v.length; i2++ ) { wall.userData.wall.v[i2] = v[i2].clone(); }	
		}
	}
	
}



function fname_s_08(cdm)
{
	var wall = cdm.wall;
	
	var label_2 = wall.label[0];
	var label_1 = wall.label[1];	
	
	var v = wall.userData.wall.v;
	
	var d1 = Math.abs( v[6].x - v[0].x );		
	var d2 = Math.abs( v[10].x - v[4].x );

	fname_s_0172({label : label_1, text : Math.round(d1 * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});
	fname_s_0172({label : label_2, text : Math.round(d2 * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});	
}




function fname_s_09( room ) 
{	 
	if(!infProject.settings.floor.o) { return; }	
	
	var contour = [];	
	
	for (var u = 0; u < room.length; u++)
	{  
		var arrW = room[u].userData.room.w; 
		var arrP = room[u].userData.room.p;  
		var arrS = room[u].userData.room.s;
		var n = room[u].userData.room.w.length;
		var res = 0;
		
		contour[u] = [];
		
		if(infProject.settings.floor.areaPoint == 'inside')
		{
			for (i = 0; i < n; i++) { arrW[i].updateMatrixWorld(); }
			
			for (i = 0; i < n; i++) 
			{
				var ch = (arrS[i] == 0) ? 4 : 6;
				
				var p1 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );		
				
				if (i == 0) 
				{
					var ch1 = (arrS[ n-1 ] == 0) ? 4 : 6; 
					var ch2 = (arrS[ i+1 ] == 0) ? 4 : 6;
					
					var p2 = arrW[n-1].localToWorld( arrW[n-1].userData.wall.v[ ch1 ].clone() );
					var p3 = arrW[i+1].localToWorld( arrW[i+1].userData.wall.v[ ch2 ].clone() );						
				}
				else if (i == n-1) 
				{
					var ch1 = (arrS[ i-1 ] == 0) ? 4 : 6;
					var ch2 = (arrS[ 0 ] == 0) ? 4 : 6;
					
					var p2 = arrW[i-1].localToWorld( arrW[i-1].userData.wall.v[ ch1 ].clone() );
					var p3 = arrW[0].localToWorld( arrW[0].userData.wall.v[ ch2 ].clone() );									
				}
				else 
				{
					var ch1 = (arrS[ i-1 ] == 0) ? 4 : 6;
					var ch2 = (arrS[ i+1 ] == 0) ? 4 : 6;
					
					var p2 = arrW[i-1].localToWorld( arrW[i-1].userData.wall.v[ ch1 ].clone() );
					var p3 = arrW[i+1].localToWorld( arrW[i+1].userData.wall.v[ ch2 ].clone() );							
				}
				
				var sum = p1.x*(p2.z - p3.z); 
				sum = Math.round(sum * 100) * 10;
				res += sum;	

				contour[u][contour[u].length] = p1;
			}			
		}
		else
		{
			for (i = 0; i < arrW.length; i++)
			{
				var p1 = (arrS[i] == 0) ? arrW[i].userData.wall.p[0].position : arrW[i].userData.wall.p[1].position;	
				
				if (i == 0) 
				{
					var p2 = (arrS[ n-1 ] == 0) ? arrW[n-1].userData.wall.p[0].position : arrW[n-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position;						
				}
				else if (i == n-1) 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position;
					var p3 = (arrS[ 0 ] == 0) ? arrW[0].userData.wall.p[0].position : arrW[0].userData.wall.p[1].position;								
				}
				else 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position; 						
				}
				
				var sum = p1.x*(p2.z - p3.z); 
				sum = Math.round(sum * 100) * 10;
				res += sum;				
			}			
		}

		
		res = Math.abs( res ) / 2;
		res = Math.round(res / 10) / 100;
		
		var sumX = 0;
		var sumZ = 0;
		for (i = 0; i < n; i++) { sumX += arrP[i].position.x; }
		for (i = 0; i < n; i++) { sumZ += arrP[i].position.z; }		
		
		
		room[u].label.position.set(sumX / n, 0.2, sumZ / n);
		
		room[u].userData.room.areaTxt = res;
		
		if(res < 0.5) { res = ''; }
		
		fname_s_0173(room[u].label, res, '80', 'rgba(255,255,255,1)', true);
		
		if(infProject.settings.floor.label) room[u].label.visible = true;
	}

	return contour;
}




function fname_s_010( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
	{
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	res = Math.round(res * 10) / 10;
	
	return res;
}





 







function fname_s_011(cdm)
{
	var lineGrid = new THREE.Group();
	
	var size = (cdm.size) ? cdm.size : 1.0;
	size = Math.round(size * 100)/100; 
	var count = (cdm.count) ? cdm.count : (15/size);
	
	var color = 0xd6d6d6;
	var color = 0xcccccc;	
	if(cdm.color) { color = cdm.color; }	
	
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: color, opacity: 1 } );
	material.visible = false;
	var ofsset = (count * size) / 2;
	
		geometry.vertices.push(new THREE.Vector3( -ofsset, 0, 0 ) );	
	geometry.vertices.push(new THREE.Vector3( ofsset, 0, 0 ) );


	for ( var i = 0; i <= count; i ++ ) 
	{
		var line = new THREE.Line( geometry, material );
		line.position.z = ( i * size ) - ofsset;
		lineGrid.add( line );

		var line = new THREE.Line( geometry, material );
		line.position.x = ( i * size ) - ofsset;
		line.rotation.y = 90 * Math.PI / 180;
		lineGrid.add( line );
		
			}
	
	scene.add( lineGrid );	

	
	lineGrid.userData.mouse = { down: false, move: false, up: false, startPos: new THREE.Vector3() };
	lineGrid.userData.size = size;
	lineGrid.userData.count = count;
	lineGrid.userData.color = (cdm.uColor) ? cdm.uColor : lineGrid.children[0].material.color.clone();

	
	$('[nameid="size-grid-tube-xy-1"]').val(Math.round(size * 100));		
	
	if(cdm.pos)
	{
		if(cdm.pos.x) lineGrid.position.x = cdm.pos.x;
		if(cdm.pos.y) lineGrid.position.y = cdm.pos.y;
		if(cdm.pos.z) lineGrid.position.z = cdm.pos.z;
	}
	
	return lineGrid;
}


function fname_s_012(cdm)
{
	var grid = infProject.scene.grid.obj;
	
	var size = fname_s_0231({ value: cdm.size, unit: 0.01, limit: {min: 0.05, max: 5} });
	
	if(!size) 
	{
		var size = grid.userData.size * 100; 		$('[nameid="size-grid-tube-xy-1"]').val(size);
		
		return;
	}
	
	var size = size.num;
	
	var pos = grid.position.clone();
	var color = grid.children[0].material.color.clone();
	var uColor = grid.userData.color.clone();
	var count = grid.userData.count;
	
	scene.remove( grid );
	
	infProject.scene.grid.obj = fname_s_011({pos: pos, color: color, size: size, uColor : uColor});
	
	fname_s_0195();
}


function fname_s_013()
{
	var grid = infProject.scene.grid.obj;
	
	if(grid.visible)
	{
		grid.visible = false;
		
		if(infProject.scene.grid.active) { fname_s_014(); }
		
		infProject.scene.grid.show = false;
	}
	else
	{
		grid.visible = true;
		infProject.scene.grid.show = true;
	}
}



function fname_s_014()
{
	var grid = infProject.scene.grid.obj;
	
	if(!infProject.scene.grid.active)
	{
		for(var i = 0; i < grid.children.length; i++)
		{
			grid.children[i].material.color = new THREE.Color(infProject.listColor.active2D);
		}
		
		infProject.scene.grid.active = true;		
	}
	else
	{
		for(var i = 0; i < grid.children.length; i++)
		{
			grid.children[i].material.color = grid.userData.color.clone();
		}

		infProject.scene.grid.active = false;
	}
}



function fname_s_015(event)
{
	var grid = infProject.scene.grid.obj;
	
	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;

		grid.userData.mouse.offset = new THREE.Vector3().subVectors( intersects[0].point, grid.position );
	grid.userData.mouse.down = true;
}


function fname_s_016(event)
{
	var grid = infProject.scene.grid.obj;
	
	if(!grid.userData.mouse.down) return;
	
	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;

	grid.position.x = intersects[0].point.x - grid.userData.mouse.offset.x;
	grid.position.z = intersects[0].point.z - grid.userData.mouse.offset.z;

	return true;
}



function fname_s_017()
{
	var grid = infProject.scene.grid.obj;
	
	grid.userData.mouse.down = false;
}



function fname_s_018()
{
	var flag = !infProject.scene.grid.link;
	
	infProject.scene.grid.link = flag;
}









function fname_s_019(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   
   
   
}




function fname_s_020(point)
{
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(point.w[i] == wall[i2]) { continue; }
			
			if(Math.abs(point.position.y - wall[i2].userData.wall.p[0].position.y) > 0.3) continue;		
			
			var p0 = point.w[i].userData.wall.p[0].position;
			var p1 = point.w[i].userData.wall.p[1].position;
			var p2 = wall[i2].userData.wall.p[0].position;
			var p3 = wall[i2].userData.wall.p[1].position;
			
			if(fname_s_0107(p0, p1, p2, p3)) { return true; }	
		}
	}
	
	return false;  
}




function fname_s_021(a1, a2, b1, b2)
{
	var t1 = fname_s_024(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_024(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_025(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return new THREE.Vector3(a2.x, 0, a2.z); } 
	
	point.x = fname_s_025(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_025(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return point;
}




function fname_s_022(a1, a2, b1, b2)
{
	var t1 = fname_s_024(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_024(b1.x, b1.z, b2.x, b2.z);
	var f1 = fname_s_025(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001)
	{ 
		var s1 = new THREE.Vector3().subVectors( a1, b1 );
		var s2 = new THREE.Vector3().addVectors( s1.divideScalar( 2 ), b1 );
		
		return [new THREE.Vector3(s2.x, 0, s2.z), true]; 
	} 
	
	var point = new THREE.Vector3();
	point.x = fname_s_025(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_025(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return [point, false];
}




function fname_s_023(a1, a2, b1, b2)
{
	var t1 = fname_s_024(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_024(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_025(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return [new THREE.Vector3(a2.x, 0, a2.z), true]; } 
	
	point.x = fname_s_025(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_025(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
	
	return [point, false];
}



function fname_s_024(x1, y1, x2, y2)
{
	var a = y1 - y2;
	var b = x2 - x1;
	var c = x1 * y2 - x2 * y1;

	return [ a, b, c ];
}

	
function fname_s_025(x1, y1, x2, y2)
{
	return x1 * y2 - x2 * y1;
}



function fname_s_026(a, b, c, d)
{
	return fname_s_027(a.x, b.x, c.x, d.x) && fname_s_027(a.z, b.z, c.z, d.z) && fname_s_028(a, b, c) * fname_s_028(a, b, d) <= 0 && fname_s_028(c, d, a) * fname_s_028(c, d, b) <= 0;
}

function fname_s_027(a, b, c, d)
{
	if (a > b) { var res = fname_s_029(a, b); a = res[0]; b = res[1]; }
	if (c > d) { var res = fname_s_029(c, d); c = res[0]; d = res[1]; }
	return Math.max(a, c) <= Math.min(b, d);
}

function fname_s_028(a, b, c) { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }


function fname_s_029(a, b) { var c; c = a; a = b; b = c; return [a, b]; }






 

function fname_s_030(A,B,C){
    var x1=A.x, y1=A.z, x2=B.x, y2=B.z, x3=C.x, y3=C.z;
    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px, z = y1 + u * py;
    return {x:x, y:0, z:z}; 
} 



function fname_s_031(A,B,C)
{	
	var AB = { x : B.x - A.x, y : B.z - A.z }
	var CD = { x : C.x - A.x, y : C.z - A.z }
	var r1 = AB.x * CD.x + AB.y * CD.y;				

	var AB = { x : A.x - B.x, y : A.z - B.z }
	var CD = { x : C.x - B.x, y : C.z - B.z }
	var r2 = AB.x * CD.x + AB.y * CD.y;

	var cross = (r1 < 0 | r2 < 0) ? false : true;	
	
	return cross;
}

 

function fname_s_032(p1, p2, M)
{	
	var urv = fname_s_024(p1.x, p1.z, p2.x, p2.z);
	
	var A = urv[0];
	var B = urv[1];
	var C = urv[2];
	
	return Math.abs( (A * M.x + B * M.z + C) / Math.sqrt( (A * A) + (B * B) ) );
}







function fname_s_033(point, arrP)
{
	var p = arrP;
	var result = false;
	var j = p.length - 1;
	for (var i = 0; i < p.length; i++) 
	{
		if ( (p[i].position.z < point.position.z && p[j].position.z >= point.position.z || p[j].position.z < point.position.z && p[i].position.z >= point.position.z) &&
			 (p[i].position.x + (point.position.z - p[i].position.z) / (p[j].position.z - p[i].position.z) * (p[j].position.x - p[i].position.x) < point.position.x) )
			result = !result;
		j = i;
	}
	
	return result;
}



function fname_s_034(pos1, pos2, cdm)
{
	if(!cdm) cdm = {};
	
	var x = pos1.x - pos2.x;
	var y = pos1.y - pos2.y;
	var z = pos1.z - pos2.z;
	
	var kof = (cdm.kof) ? cdm.kof : 0.01;
	
	
	var equals = true;
	if(Math.abs(x) > kof){ equals = false; }
	if(Math.abs(y) > kof){ equals = false; }
	if(Math.abs(z) > kof){ equals = false; }

	return equals;
}







function fname_s_035( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



 



function fname_s_036(point) 
{
	var obj = point.userData.point.cross;
	
	if(!obj) return;
	
	if(point.userData.point.type == 'create_wall')
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_047( point ); } 
		else if(obj.userData.tag == 'point') { fname_s_044( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_046( obj, point ); } 
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_044( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_046( obj, point ); }
		else if(obj.userData.tag == 'point') { fname_s_044( point ); }
	}	
	else if(point.userData.point.type == 'add_point')
	{  
		if(obj.userData.tag == 'wall') { fname_s_046( obj, point ); } 
	}
	else
	{   
		if(!fname_s_038(point))
		{ 
			if(obj.userData.tag == 'planeMath') { fname_s_037(point); }
			else if(obj.userData.tag == 'point') { fname_s_044( point ); }
			else if(obj.userData.tag == 'wall') { fname_s_046( obj, point ); }	 		
		}
	}
	
	point.userData.point.cross = null;
}



function fname_s_037(point) 
{
	fname_s_0142(point.zone); 
	
	fname_s_05(param_wall.wallR);
}



function fname_s_038(point)
{
	var flag = false;
	var crossObj = point.userData.point.cross;
	
	if(crossObj.userData.tag == 'point' || crossObj.userData.tag == 'wall')
	{  
		if(point.w.length > 1)
		{
			if(Math.abs(point.position.y - crossObj.position.y) < 0.3) { flag = true; }			
		}		
	}
		
	
	if(fname_s_020(point)) { flag = true; }	
	
	
	if(flag)
	{
		fname_s_0108( point, param_wall.wallR ); 			
		
				
	}
	
	return flag;
}





function fname_s_039(point1, point2)
{
	var wall = null;
	
	for ( var i = 0; i < point1.p.length; i++ )
	{
		if(point1.p[i] == point2) { wall = point1.w[i]; break; }
	}

	return wall;
}




function fname_s_040()
{
	var wall = clickO.obj;
	clickO.obj = null;
	fname_s_0178();
	
	var pos1 = wall.userData.wall.p[0].position;
	var pos2 = wall.userData.wall.p[1].position;
	
	var pos = new THREE.Vector3().subVectors( pos2, pos1 ).divideScalar( 2 ).add(pos1); 
	var point = fname_s_0213( pos, 0 );
	
	fname_s_041( wall, point );
}



function fname_s_041( wall, point )
{	 
	clickO.move = null;					
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;																
	  
	point.userData.point.last.cdm = 'add_point';
	
	var walls = fname_s_043( wall, point )	

	point.userData.point.type = null; 

	return point;
}




function fname_s_042(wall, posx)
{
	var arrL = [], arrR = [];
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		if (v.x <= posx){ arrL[arrL.length] = wall.userData.wall.arrO[i]; }
		else { arrR[arrR.length] = wall.userData.wall.arrO[i]; }
	}	

	return { wall_1 : arrL, wall_2 : arrR };
}





function fname_s_043( wall, point )
{
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;   
	var p1 = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	var p2 = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	
	 
	var arrW_2 = [];
	var point1 = wall.userData.wall.p[0];
	var point2 = wall.userData.wall.p[1];
	for ( var i = 0; i < point1.w.length; i++ ) { if(point1.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point1.w[i]; }
	for ( var i = 0; i < point2.w.length; i++ ) { if(point2.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point2.w[i]; }
	
	if(point.p.length > 0)
	{ 
		for ( var i = 0; i < point.p[0].w.length; i++ )
		{
			for ( var i2 = 0; i2 < arrW_2.length; i2++ )
			{
				if(point.p[0].w[i] == arrW_2[i2]) continue;
				
				arrW_2[arrW_2.length] = point.p[0].w[i]; break;
			}
		}		
	}
	var wallC = point.w[0];
	var point_0 = point.p[0];
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall] : fname_s_0102(wallC);
	fname_s_04( arrW );	
	
	
	wall.updateMatrixWorld();
	var ps = wall.worldToLocal( point.position.clone() );	
	var wd = fname_s_042(wall, ps.x);	

	
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point')
	{	
		var zone = fname_s_035( point.w[0] ).obj;
		var oldZ_1 = fname_s_0143(zone);
	}

	var v2 = wall.userData.wall.v;
	for ( var i2 = 0; i2 < wall.userData.wall.v.length; i2++ ) { v2[i2] = wall.userData.wall.v[i2].clone(); }

	var oldZones = fname_s_0162( wall );   	
	var oldZ = fname_s_0143( oldZones );
	fname_s_0156( oldZones );						
	
	fname_s_0132( wall, {dw : 'no delete'} );  							
	
	
	var point1 = fname_s_0227( 'point', p1.id );
	var point2 = fname_s_0227( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0213( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0213( p2.pos, p2.id ); }		
	
	
	var wall_1 = fname_s_0214({ p: [point1, point], width: width, offsetZ : offsetZ, height : height });	 			
	var wall_2 = fname_s_0214({ p: [point, point2], width: width, offsetZ : offsetZ, height : height });

	
	wall_1.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];  
	wall_2.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];
	wall_1.userData.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall_2.userData.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	
	for ( var i = 0; i < v2.length/2; i++ ) { wall_1.userData.wall.v[i] = v2[i].clone(); wall_1.geometry.vertices[i] = v2[i].clone(); }
	
	var sub = v2[8].x - wall_2.userData.wall.v[8].x;
	for ( var i = v2.length/2; i < v2.length; i++ ) { v2[i].x -= sub; } 
	for ( var i = v2.length/2; i < v2.length; i++ ) { wall_2.userData.wall.v[i] = v2[i].clone(); wall_2.geometry.vertices[i] = v2[i].clone(); }
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall_1, wall_2] : fname_s_0102(wallC);
	
	if(point.userData.point.last.cdm == 'add_point')
	{
		fname_s_0104(point);
	}
	else
	{
		fname_s_0104(point);
		fname_s_0104(point_0);
	}
	
	fname_s_07(arrW); 	
	fname_s_05( arrW );
	
	var newZones = fname_s_0145();		
	
	
	var flag = false;
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point') { if(zone) { flag = true; } }	
	
	if(flag) { fname_s_0160(newZones, oldZ_1[0], true); } 
	else { fname_s_0158(oldZ, newZones, 'add'); }		
	
	
	
	for ( var i = 0; i < wd.wall_1.length; i++ ) 
	{ 
		var obj = wd.wall_1[i];
		
		obj.userData.door.wall = wall_1;
		wall_1.userData.wall.arrO[wall_1.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_1, wd : fname_s_02( obj ) };				
		fname_s_03( obj, objsBSP ); 		
	} 
	
	for ( var i = 0; i < wd.wall_2.length; i++ ) 
	{ 
		var obj = wd.wall_2[i];
		
		obj.userData.door.wall = wall_2;
		wall_2.userData.wall.arrO[wall_2.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_2, wd : fname_s_02( obj ) };				
		fname_s_03( obj, objsBSP ); 	
	} 	
	
	
	return [wall_1, wall_2];
}









function fname_s_044( point )
{ 	
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_037(point); return; }
	
	if(point.userData.point.type == 'create_wall')			
	{		 	
		var wall = fname_s_0214({ p: [point, point.userData.point.cross] }); 		 
		point.userData.point.type = 'continue_create_wall';
		point.userData.point.cross.userData.point.last.cdm = 'new_wall_from_point';
		clickO.move = point;
		fname_s_04( point.userData.point.cross.w );	
		
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(point.userData.point.cross == planeMath)		
		{	
			if(fname_s_020(point)) return; 	
			
			point.userData.point.type = null; 			
			var point2 = fname_s_0213( point.position, 0 );			
			var wall = fname_s_0214({ p: [point, point2] }); 			
			clickO.move = point2;
			fname_s_07( point.p[0].w );			
			point2.userData.point.type = 'continue_create_wall'; 

			if(point.p[0].userData.point.last.cdm == 'new_point_1' || point.p[0].userData.point.last.cdm == 'new_wall_from_point')
			{
				fname_s_05( point.p[0].w );				
			}			
			
			
		} 
		else if(point.userData.point.cross.userData.tag == 'point')		
		{			
			if(point.userData.point.cross.userData.point.last.cdm == 'new_point_1' && clickO.move.userData.point.cross == point || point.userData.point.cross == point.p[0])
			{ 
				fname_s_0131(point.w[0]);
				clickO.move = null;
				clickO = resetPop.clickO();
			}						
			else
			{
				fname_s_045(point);
			}			
		}
	} 
	else if(!point.userData.point.type) 	
	{ 	
		fname_s_045(point);		
	}

	param_wall.wallR = point.w;
}


function fname_s_045(point)
{	
	if(fname_s_038(point)) { return; }		

	fname_s_04( point.userData.point.cross.w );
	
	var wall = point.w[0];
	var point1 = point.userData.point.cross;
	var point2 = point.p[0];								

	var m = point1.p.length; 
	point1.p[m] = point2;
	point1.w[m] = wall;
	point1.start[m] = point.start[0];
	
	var m = point2.p.length; 
	point2.p[m] = point1;
	point2.w[m] = wall;
	point2.start[m] = (point.start[0] == 0) ? 1 : 0;
			
	var m = (wall.userData.wall.p[0] == point) ? 0 : 1;	
	wall.userData.wall.p[m] = point1;
	
	fname_s_0137(point2, wall);			
	fname_s_0138(point);
	scene.remove(point);

	fname_s_0104(point1);
	fname_s_07( point1.w ); 

	fname_s_0159(wall);   
	
	if(!point.userData.point.type) 
	{ 
		 		
		
		if(wall.userData.wall.p[0] == point1) { var p1 = [point1, point2]; var p2 = [point, point2]; }
		else { var p1 = [point2, point1]; var p2 = [point2, point]; }							 
	} 
	else if(point.userData.point.cross.userData.tag == 'point') 
	{ 
		 
	}	
	
	var arrW = [];
	for ( var i = 0; i < point1.w.length; i++ ) { arrW[arrW.length] = point1.w[i]; }
	
	
	if(1==1)	
	{
		for ( var i = 0; i < point2.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW.length; i2++ ) 
			{
				if(point2.w[i] == arrW[i2]) { flag = false; break; }
			}
			
			if(flag) arrW[arrW.length] = point2.w[i];
		}		
	}
	
	fname_s_05( arrW );
	
	clickO.move = null;
}


 






function fname_s_046( wall, point )
{ 
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_037(point); return; }
	
	if(point.userData.point.type == 'add_point')			
	{    
		fname_s_041( wall, point ); 
		
	}
	else if(point.userData.point.type == 'continue_create_wall')			
	{
						 

		point.userData.point.last.cdm = 'new_point_2'; 
		
		var arrW = fname_s_043( wall, point );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		point.userData.point.type = null; 		
		
		clickO.move = null; 		
	}
	else if(point.userData.point.type == 'create_wall')		
	{	
		
		point.userData.point.type = null;
		point.userData.point.last.cdm = 'new_point_1'; 
		var point1 = point;		
		var point2 = fname_s_0213( point.position.clone(), 0 );			 							
		
		point2.userData.point.cross = point1;
		
		var newWall = fname_s_0214({p: [point1, point2] }); 
		var arrW = fname_s_043( wall, point1 );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		fname_s_04( point1.w );

		clickO.move = point2;
		point2.userData.point.type = 'continue_create_wall'; 				 
	}
	else if(!point.userData.point.type)		
	{		
		 			
		
		var p1 = point.p[0];
		var selectWall = point.w[0];
		
		point.userData.point.last.cdm = 'new_point';
		
		var arrW = fname_s_043( wall, point );		 
		
		var arrW2 = p1.w;
		
		for ( var i = 0; i < p1.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW2.length; i2++ ) 
			{
				if(p1.w[i] == arrW2[i2]) { flag = false; break; }
			}
			
			if(flag) arrW2[arrW2.length] = p1.w[i];
		}
		
		fname_s_05( arrW2 );	

		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};		  	  
		
		clickO.move = null;
	}

	param_wall.wallR = point.w;
}






function fname_s_047( point1 )
{  		
	point1.userData.point.type = null;		
	var point2 = fname_s_0213( point1.position.clone(), 0 );			
	point2.userData.point.type = 'continue_create_wall';
	
	var wall = fname_s_0214({ p: [point1, point2] });		
	
	clickO.move = point2; 
	
	param_wall.wallR = [wall];
}





 






function fname_s_048(cdm)
{
	if(!cdm) { cdm = {} };
	
	var type = (cdm.type) ? cdm.type : 'door';
	
	var color = infProject.listColor.door2D;
	
	if(type == 'window'){ color = infProject.listColor.window2D; }
	else if(type == 'door'){ color = infProject.listColor.door2D; }
	
	var material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: 1.0, depthTest: false, lightMap : lightMap_1 });
	
	
	if(camera == cameraTop)
	{ 
		material.depthTest = false;		
		material.opacity = 1.0; 	
	}
	else if(1 == 2)
	{ 		
		material.depthTest = true;
		material.opacity = 0;					
	}	
	
	var spline = [];			
	
	if(cdm.size)
	{
		var x = cdm.size.x/2;
		var y = cdm.size.y/2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );			
	}
	else if(type == 'window')
	{
		var x = infProject.settings.wind.width / 2;
		var y = infProject.settings.wind.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else if(type == 'door')
	{  
		var x = infProject.settings.door.width / 2;
		var y = infProject.settings.door.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else
	{
		return;
	}
	
	var shape = new THREE.Shape( spline );
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material );	
	
	var v = obj.geometry.vertices;
	
	var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
	
	for ( var i = 0; i < v.length; i++ )
	{
		v[i].z = Math.round(v[i].z * 100) / 100;
		if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
		if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
	}
	
	obj.geometry.computeBoundingBox();	

	for ( var i = 0; i < v.length; i++ )
	{
		if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
		if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
		if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
		if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
	}
	
	
	var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
	
	var form = { type : '' , v : arr };	
	
	obj.userData.tag = 'free_dw';
	obj.userData.door = {};
	obj.userData.door.type = type;
	obj.userData.door.size = new THREE.Vector3();
	obj.userData.door.form = form;
	obj.userData.door.bound = {}; 
	obj.userData.door.width = 0.2;
	obj.userData.door.h1 = 0;		
	obj.userData.door.color = obj.material.color; 
	obj.userData.door.wall = null;
	obj.userData.door.controll = {};
	obj.userData.door.ruler = {};
	obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
	obj.userData.door.topMenu = true;
	obj.userData.door.lotid = (cdm.lotid)? cdm.lotid : null;
	
	
	
	
	if(1==1)
	{
		obj.geometry.computeBoundingBox();		
		var dX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var dY = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;			
		
		obj.userData.door.form.size = new THREE.Vector3(dX, dY, 1);
		
		var h1 = (type == 'window') ? infProject.settings.wind.h1 : 0;
		 
		obj.userData.door.h1 = h1 - obj.geometry.boundingBox.min.y; 

		if(cdm.pos) { obj.userData.door.h1 = cdm.pos.y - obj.geometry.boundingBox.min.y; }
	}
		
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.door.form.v2 = v2;		
	}
	
	fname_s_0212( obj );
	
	scene.add( obj );
	
	
	if(cdm.status)
	{
		obj.userData.id = cdm.id;
		obj.position.copy(cdm.pos);
		
		obj.position.y += (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2; 	
		
		fname_s_053(obj, cdm.wall);		
		fname_s_051({ obj: obj });
	}
	else
	{
		clickO.move = obj; 
		clickO.last_obj = obj;		
	}
}



function fname_s_049( event, obj ) 
{ 
	var arrDp = [];
	
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = fname_s_0215( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	obj.material.color = obj.userData.door.color;
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall')
			{ 
				wall = object; 
				obj.rotation.copy( wall.rotation ); 
				pos = intersects[i].point; 
			}
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); } 
		}
	}

	if(obj.material.color == new THREE.Color(infProject.listColor.active2D)) { obj.userData.door.wall = null; return; }
	if(!wall) { obj.userData.door.wall = null; return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	  
	if(camera == camera3D || camera == cameraWall) 
	{ 
		obj.position.set( pos.x, pos.y, pos.z ); 
	}
	else 
	{ 
		obj.position.set( pos.x, obj.userData.door.h1, pos.z ); 
	}		

	fname_s_053(obj, wall);	
}



function fname_s_050(obj)
{ 
	  
	if(obj)
	{    
		
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			fname_s_051({ obj : obj });  
			return true; 
		}
	}

	return false;
}






function fname_s_051( cdm )
{	
	var obj = cdm.obj;
	var wall = obj.userData.door.wall;
	var pos = obj.position;
	obj.userData.tag = obj.userData.door.type;
	
	
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	
	
	if(camera == cameraTop)
	{ 
		obj.material.depthTest = false;
		obj.material.transparent = true;
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	
	
	
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
  
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { infProject.scene.array.window[infProject.scene.array.window.length] = obj; }
	else if(obj.userData.tag == 'door') { infProject.scene.array.door[infProject.scene.array.door.length] = obj; }

	
	
	
	obj.updateMatrixWorld();
	
	
	
	if(1==1)
	{  
		objsBSP = { wall : wall, wd : fname_s_02( obj ) };				
		fname_s_03( obj, objsBSP ); 
	}	


	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	
	if(obj.userData.tag == 'window') { obj.userData.door.lotid = 1; }
		
	if(obj.userData.door.lotid)
	{
		fname_s_0268({type: 'wd', wd: obj, lotid: obj.userData.door.lotid});
	}

 	
	clickO.obj = null;
	clickO.last_obj = null;
	clickO.move = null;
	
	fname_s_0195();
}




function fname_s_052(inf, cdm)
{
	var wd = cdm.wd;
	var objPop = inf.obj;
	
	wd.add( objPop );
	
	wd.userData.door.objPop = objPop;
	
	wd.updateMatrixWorld();
	var centerWD = wd.geometry.boundingSphere.center.clone();	

	objPop.updateMatrixWorld();
	objPop.geometry.computeBoundingBox();
	objPop.geometry.computeBoundingSphere();
	
	var center = objPop.geometry.boundingSphere.center;
	
	
	
	
	
	objPop.position.set(0,0,0);
	objPop.rotation.set(0,0,0);
	
	

	
	if(1==1)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		objPop.geometry.computeBoundingBox();		
		var dX = objPop.geometry.boundingBox.max.x - objPop.geometry.boundingBox.min.x;
		var dY = objPop.geometry.boundingBox.max.y - objPop.geometry.boundingBox.min.y;				
		
		objPop.scale.set(x/dX, y/dY, 1);			
	}
}




function fname_s_053(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;
	obj.userData.door.wall = wall;	
} 
 


 

var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';





function fname_s_054()
{
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	var obj = clickO.move;
	
	if(obj)
	{
		if(obj.userData.tag == 'free_dw') { scene.remove(obj); }
		
		if(obj.userData.tag == 'point') 
		{ 	
			if(obj.w.length == 0){ fname_s_0133(obj); }  
			else 
			{ 
				if(obj.userData.point.type == 'continue_create_wall')
				{
					var point = obj.p[0]; 
					fname_s_0131(obj.w[0]); 
					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { fname_s_0134( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if(obj.userData.tag == 'obj')
		{
			fname_s_0252(obj); 
		}		

		clickO = resetPop.clickO();
	}	
	
	clickO.move = null;	
}



function fname_s_055( event ) 
{
	

 
	long_click = false;
	lastClickTime = new Date().getTime();

	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right';  break;
		case 2: vk_click = 'right'; break;
	}


	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;

	fname_s_072( event, vk_click );
	fname_s_073( event, vk_click );


	if ( vk_click == 'right' ) { fname_s_054( event ); return; } 

	
	if(infProject.scene.grid.active) { fname_s_015(event); return; }


	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'point') 
		{			
			if(clickO.move.userData.point.type) { fname_s_036( clickO.move ); return; }  
		}
	}
	 
	clickO.obj = null; 	
	clickO.actMove = false;	
	clickO.rayhit = fname_s_056(event); 
	
	fname_s_057({type: 'down'});
	
	fname_s_0195();
}





function fname_s_056(event)
{ 
	var rayhit = null;	
		
		
	
	if(infProject.scene.substrate.active) 
	{  
		var plane = infProject.scene.substrate.active;
		
		if(!plane.userData.substrate.img) return null;
		
		var rayhit = fname_s_0215( event, infProject.scene.substrate.ruler, 'arr' );
		var rayhit = (rayhit.length > 0) ? rayhit[0] : null;

		if(!rayhit)
		{
			var rayhit = fname_s_0215( event, plane.userData.substrate.p, 'arr' );
			var rayhit = (rayhit.length > 0) ? rayhit[0] : null;					
		}				
		
		if(!rayhit)
		{
			var rayhit = fname_s_0215( event, [plane], 'arr' );				
			var rayhit = (rayhit.length > 0) ? rayhit[0] : null;					
		}
		 
		if(rayhit) return rayhit;			
		else return null;
	}
	
	if(infProject.tools.pivot.visible)
	{
		var ray = fname_s_0215( event, infProject.tools.pivot.children, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}
	
	if(infProject.tools.gizmo.visible)
	{
		var arr = [];
		for ( var i = 0; i < 3; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
		
		var ray = fname_s_0215( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}

	if(!infProject.scene.block.click.controll_wd)
	{
		var ray = fname_s_0215( event, infProject.tools.controllWD, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.door)
	{
		var ray = fname_s_0215( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.window)
	{
		var ray = fname_s_0215( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.point)
	{
		var ray = fname_s_0215( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.click.wall)
	{
		var ray = fname_s_0215( event, infProject.scene.array.wall, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	
	if(!infProject.scene.block.click.obj)
	{
		var ray = fname_s_0215( event, infProject.scene.array.obj, 'arr' );
		
		if(ray.length > 0)
		{   
			if(rayhit)
			{  
				if(rayhit.distance > ray[0].distance) { rayhit = ray[0]; }				
			}
			else 
			{
				rayhit = ray[0];
			}
		}			
	}
	
	if(!rayhit)
	{
		var ray = fname_s_0215( event, infProject.scene.array.floor, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }			
	}	
	
	
	return rayhit;
}


function fname_s_057(cdm)
{
	fname_s_060(cdm);
	
	if(!clickO.rayhit) return; 

	var obj = clickO.obj = clickO.rayhit.object;
	
	var tag = obj.userData.tag;
	var rayhit = clickO.rayhit;
	var flag = true;
	
	if(cdm.type == 'down')
	{  
		if(fname_s_050(clickO.move)) { flag = false; }
		else if( tag == 'substrate_tool' && camera == cameraTop ) { fname_s_0310({intersect: rayhit}); }
		else if( tag == 'pivot' ) { fname_s_0245( rayhit ); }
		else if( tag == 'gizmo' ) { fname_s_0260( rayhit ); } 
		else if( tag == 'wall' && camera == cameraTop ) { fname_s_0110( rayhit ); }
		else if( tag == 'wall' && camera == cameraWall ) { fname_s_0179( rayhit ); }
		else if( tag == 'point' ) { fname_s_093( rayhit ); }
		else if( tag == 'window' ) { fname_s_0119( rayhit ); }
		else if( tag == 'door' ) { fname_s_0119( rayhit ); }
		else if( tag == 'controll_wd' ) { fname_s_089( rayhit ); }
		else if( tag == 'obj' && camera == cameraTop ) { fname_s_0251( obj ); }		
		else { flag = false; }
	}
	else if(cdm.type == 'up')
	{	
		if( tag == 'wall' && camera == camera3D ) {  }
		else if( tag == 'obj' && camera == camera3D ) { fname_s_0251( obj ); }
		else if( tag == 'room' && camera == cameraTop ) { clickO.last_obj = obj; fname_s_0283({obj: obj}); }
		else { flag = false; }
	}	

	
	if(flag) 
	{
		if(camera == cameraTop)
		{
			fname_s_0177(obj);
		}		

		if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
		else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }		
		
		clickO.last_obj = obj;
		
		fname_s_062( obj );
	}
}


function fname_s_058( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}

	fname_s_0217( event );
	
	if(infProject.scene.grid.active)	
	{
		if(fname_s_016(event)) fname_s_0195();
		
		return;
	}	

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	var obj = clickO.move;
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
			
		if ( tag == 'substrate_tool' ) { fname_s_0311(event); }	
		else if ( tag == 'pivot' ) { fname_s_0246( event ); }
		else if ( tag == 'gizmo' ) { fname_s_0262( event ); }
		else if ( tag == 'wall' ) { fname_s_0113( event, obj ); }
		else if ( tag == 'window' ) { fname_s_0123( event, obj ); }
		else if ( tag == 'door' ) { fname_s_0123( event, obj ); }
		else if ( tag == 'controll_wd' ) { fname_s_090( event, obj ); }
		else if ( tag == 'point' ) { fname_s_095( event, obj ); }
		else if ( tag == 'room' ) { fname_s_071( event ); }		
		else if ( tag == 'free_dw' ) { fname_s_049( event, obj ); }
		else if ( tag == 'obj' ) { fname_s_0249( event ); }
	}
	else 
	{
		if ( camera == camera3D ) { fname_s_071( event ); }
		else if ( camera == cameraTop ) { fname_s_074( event ); }
		else if ( camera == cameraWall ) { fname_s_075( event ); }
	}
	

	fname_s_0175( event );

	fname_s_0195();
}


function fname_s_059( event )  
{

	if(!long_click) 
	{ 
		fname_s_057({type: 'up'}); 
	}	
	
	var obj = clickO.move;	
	
	if(obj)  
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') 
		{  		
			var point = clickO.move;
			if(!clickO.move.userData.point.type) { fname_s_036(clickO.move); }			
			fname_s_0109(point);
		}
		else if(tag == 'wall') { fname_s_0118(obj); }
		else if(tag == 'window' || obj.userData.tag == 'door') { fname_s_0128(obj); }	
		else if(tag == 'controll_wd') { fname_s_092(obj); } 
		else if(tag == 'obj') { fname_s_0250(obj); }
		
		if(tag == 'free_dw') {  }
		else if (tag == 'point') 
		{
			if(obj.userData.point.type) {  } 
			else { clickO.move = null; }
		}		
		else { clickO.move = null; }		
	}

	if(infProject.scene.grid.active) { fname_s_017(); }		
	
	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	
	
	clickO.offset = new THREE.Vector3();
	
	fname_s_0195();
}





function fname_s_060(cdm)
{
	var obj = clickO.last_obj;
	if(!cdm) { cdm = {type: ''}; }
	
	var flag = true;
	
	if(obj)
	{ 
		fname_s_0178(); 
		

		var tag = obj.userData.tag;
		
		if(cdm.type == 'down')
		{
			if(tag == 'wall' && camera == cameraTop) { fname_s_061(obj); }
			else if(tag == 'point' && camera == cameraTop) { fname_s_061(obj); }
			else if(tag == 'window' && camera == cameraTop) { fname_s_0125(obj); fname_s_061(obj); }
			else if(tag == 'door' && camera == cameraTop) { fname_s_0125(obj); fname_s_061(obj); }
			else if(tag == 'obj' && camera == cameraTop) { fname_s_0253(obj); }
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{
			if(tag == 'room' && camera == cameraTop) { fname_s_061(obj); }
			else if(tag == 'obj' && camera == camera3D) { fname_s_0253(obj); }
			else { flag = false; }
		}
		else
		{
			if(tag == 'wall') { fname_s_061(obj); }
			else if(tag == 'point') { fname_s_061(obj); }
			else if(tag == 'window') { fname_s_0125(obj); fname_s_061(obj); }
			else if(tag == 'door') { fname_s_0125(obj); fname_s_061(obj); }
			else if(tag == 'room') { fname_s_061(obj); }
			else if(tag == 'obj') { fname_s_0253(obj); }
			else { flag = false; }
		}
	}
	
	if(flag) clickO.last_obj = null;
}




function fname_s_061(obj) 
{
	if(!obj) return;  
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { fname_s_0283(); }
	else if(tag == 'point') { fname_s_0283(); }
	else if(tag == 'window') { fname_s_0283(); }
	else if(tag == 'door') { fname_s_0283(); }
	else if(tag == 'room') { fname_s_0283(); }
}





function fname_s_062( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if ( tag == 'room' ) 
	{
		var txt = '';
		
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		
	}
	else if( tag == 'wall' )
	{ 
		
		 
	}
	else if( tag == 'point' )
	{ 
		 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};		
		 
	}
	else if ( tag == 'controll_wd' ) 
	{
		
	}
	else if ( tag == 'obj' ) 
	{
		
	}		
	else 
	{
		
	}	
}



    



function fname_s_063(cam)
{  
	fname_s_0219();
	
	camera = cam;
	renderPass.camera = cam;
	outlinePass.fname_s_0195 = cam;
	if(saoPass) saoPass.camera = cam;
	
	
	if(camera == cameraTop)
	{				
		fname_s_067({visible_1: false, visible_2: false});
		
		fname_s_064();			
		fname_s_078( camera.zoom );
		if(infProject.scene.grid.show) infProject.scene.grid.obj.visible = true;

		fname_s_0295();	
		
		fname_s_0282({current: true});
	}
	else if(camera == camera3D)
	{	
		fname_s_067({visible_1: true, visible_2: true});
		
		fname_s_0176(); 
		fname_s_078( cameraTop.zoom );
		fname_s_064();
		if(infProject.scene.grid.show) infProject.scene.grid.obj.visible = true;
		
		
		fname_s_0293();
		fname_s_0294();
		
		fname_s_0282({current: true});
	}
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	

	clickO = resetPop.clickO();
	
	fname_s_0195();
}







function fname_s_064()
{
	if(camera == cameraTop)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
		var visible_2 = true;
	}
	else if(camera == camera3D || camera == cameraWall)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
	}
	else { return; } 
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	
	for ( var i = 0; i < wall.length; i++ )
	{
		if(wall[i].children[0]) wall[i].children[0].visible = visible_2;	
				
		for ( var i2 = 0; i2 < wall[i].label.length; i2++ )
		{
			wall[i].label[i2].visible = visible;
		}
	}
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	fname_s_065(window, visible_2);
	fname_s_065(door, visible_2);
	
}



function fname_s_065(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].material.visible = visible; }				
}






function fname_s_066()  
{ 	
	cameraWall.zoom = 2;
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
	
	var posX = { min : arrWallFront.bounds.min.x.clone(), max : arrWallFront.bounds.max.x.clone() };
	var posY = { min : arrWallFront.bounds.min.y.clone(), max : arrWallFront.bounds.max.y.clone() };
	
	posX.min.project(camera);
	posY.min.project(camera);	
	
	
	
	var x = 0.6/posX.min.x;
	var y = 0.6/posY.min.y;
	
	camera.zoom = (posX.min.x < posY.min.y) ? Math.abs(x) * 2 : Math.abs(y) * 2;    
	
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
}

 






function fname_s_067(cdm)
{
	var visible_1 = cdm.visible_1;
	var visible_2 = cdm.visible_2;
	
	infProject.scene.block.click.wall = visible_1;
	infProject.scene.block.hover.wall = visible_1;

	infProject.scene.block.click.point = visible_1;
	infProject.scene.block.hover.point = visible_1;

	infProject.scene.block.click.window = visible_1;
	infProject.scene.block.hover.window = visible_1;

	infProject.scene.block.click.door = visible_1;
	infProject.scene.block.hover.door = visible_1;

	infProject.scene.block.click.room = visible_1;
	infProject.scene.block.hover.room = visible_1;

	infProject.scene.block.click.controll_wd = visible_1;
	infProject.scene.block.hover.controll_wd = visible_1;	
}




function fname_s_068(cdm)
{ 
	if(!cdm) cdm = {};
	
	if(cdm.active)
	{
		var txtButton = (infProject.settings.interface.button.showHideWall_1.active == 'Спрятать стены')?'Показать стены':'Спрятать стены';
	}
	else
	{
		var txtButton = infProject.settings.interface.button.showHideWall_1.active;	
		infProject.settings.interface.button.showHideWall_1.active = (txtButton == 'Спрятать стены')?'Показать стены':'Спрятать стены';
		
		$('[nameId="showHideWall_1"]').text(infProject.settings.interface.button.showHideWall_1.active);
	}
	
	
	if(txtButton == 'Спрятать стены') { fname_s_0169({height: 0.3}); }
	else { fname_s_0169({height: infProject.settings.height}); }
}



var type_browser = fname_s_084();
var newCameraPosition = null;


function fname_s_069() 
{
	
	
	var flag = false;
	
	var keys = clickO.keys;  
	if(keys.length == 0) return;
	
	if ( camera == cameraTop )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.z -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.z += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == camera3D ) 
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( -x, 0, -z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			var x = Math.sin( camera.rotation.y );
			var z = Math.cos( camera.rotation.y );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
			var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
			var dir = new THREE.Vector3( x, 0, z );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 88 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 67 ] ) 
		{
			var dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, 0.1 );
			dir.addScalar( 0.0001 );
			camera.position.add( dir );
			infProject.camera.d3.targetPos.add( dir );
			newCameraPosition = null;
			flag = true;
		}
	}
	else if ( camera == cameraWall )
	{
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			camera.position.y += 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			camera.position.y -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			camera.position.x -= 0.1;
			newCameraPosition = null;
			flag = true;
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			camera.position.x += 0.1;
			newCameraPosition = null;
			flag = true;
		}
	}

	if(flag) { fname_s_0195(); }
}



function fname_s_070(cdm)
{
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));	
}



function fname_s_071( event )
{ 
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			newCameraPosition = null;
			var radious = infProject.camera.d3.targetPos.distanceTo( camera.position );
			
			var theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + infProject.camera.d3.theta;
			var phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + infProject.camera.d3.phi;
			var phi = Math.min( 180, Math.max( 5, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( infProject.camera.d3.targetPos );  
			camera.lookAt( infProject.camera.d3.targetPos );
			
			var gizmo = infProject.tools.gizmo;
			
			if(gizmo.visible) fname_s_0259(gizmo.userData.gizmo.obj);
			
			fname_s_0294();
		}
		if ( isMouseDown3 )    
		{
			newCameraPosition = null;
			
			var intersects = fname_s_0215( event, planeMath, 'one' );
			var offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera.position.add( offset );
			infProject.camera.d3.targetPos.add( offset );
			
			fname_s_0294();
		}
	}
	else if ( camera3D.userData.camera.type == 'first' )
	{
		if ( isMouseDown2 )
		{
			newCameraPosition = null;
			var y = ( ( event.clientX - onMouseDownPosition.x ) * 0.006 );
			var x = ( ( event.clientY - onMouseDownPosition.y ) * 0.006 );

			camera.rotation.x -= x;
			camera.rotation.y -= y;
			onMouseDownPosition.x = event.clientX;
			onMouseDownPosition.y = event.clientY;

			var dir = camera.getWorldDirection();			
			
			dir.normalize();
			dir.x *= camera3D.userData.camera.dist;
			dir.z *= camera3D.userData.camera.dist;
			dir.add( camera.position );
			dir.y = 0;
			
			infProject.camera.d3.targetPos.copy( dir ); 		
		}
	} 		
	
}




function fname_s_072( event, click )
{
	if ( camera == cameraTop || camera == cameraWall) { }
	else { return; }

	isMouseDown1 = true;
	isMouseRight1 = true;
	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;
	newCameraPosition = null;
	

	if(camera == cameraTop) 
	{
		planeMath.position.set(camera.position.x,0,camera.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		var intersects = fname_s_0215( event, planeMath, 'one' );
		
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.z = intersects[0].point.z;	 		
	}
	if(camera == cameraWall) 
	{
		var dir = camera.getWorldDirection();
		dir = new THREE.Vector3().addScaledVector(dir, 10);
		planeMath.position.copy(camera.position);  
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 
		planeMath.updateMatrixWorld();

		var intersects = fname_s_0215( event, planeMath, 'one' );	
		onMouseDownPosition.x = intersects[0].point.x;
		onMouseDownPosition.y = intersects[0].point.y;
		onMouseDownPosition.z = intersects[0].point.z;		 		
	}	
}




function fname_s_073( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				
	{
		
		var dir = new THREE.Vector3().subVectors( infProject.camera.d3.targetPos, camera.position ).normalize();
		
		
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		
		dir.y = 0; 
		dir.normalize();    			
		
		isMouseDown2 = true;
		infProject.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		infProject.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		
	{
		isMouseDown3 = true;
		planeMath.position.copy( infProject.camera.d3.targetPos );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();

		var intersects = fname_s_0215( event, planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}





function fname_s_074( event ) 
{
	if(isMouseRight1 || isMouseDown1) {}
	else { return; }


	newCameraPosition = null;	
	
	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;	
}



function fname_s_075( event )
{
	if ( !isMouseRight1 ) { return; }

	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	camera.position.x += onMouseDownPosition.x - intersects[0].point.x;
	camera.position.y += onMouseDownPosition.y - intersects[0].point.y;	
	camera.position.z += onMouseDownPosition.z - intersects[0].point.z;
	
	newCameraPosition = null;	
}



function fname_s_076( e )
{
	
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	if(camera == cameraTop) 
	{ 
		fname_s_078( camera.zoom - ( delta * 0.1 * ( camera.zoom / 2 ) ) ); 
	}
	else if(camera == camera3D) 
	{ 
		fname_s_079( delta, 1 ); 
	}
	
	fname_s_0247();
	
	fname_s_0195();
}





var zoomLoop = '';
function fname_s_077() 
{
	var flag = false;
	
	if ( camera == cameraTop )
	{
		if ( zoomLoop == 'zoomOut' ) { fname_s_078( camera.zoom - ( 0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { fname_s_078( camera.zoom - ( -0.05 * ( camera.zoom / 2 ) ) ); flag = true; }
	}
	else if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { fname_s_079( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { fname_s_079( -0.3, 0.3 ); flag = true; }
	}
	else if ( camera == cameraWall )
	{
		if ( zoomLoop == 'zoomOut' ) { camera.zoom = camera.zoom - ( 0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { camera.zoom = camera.zoom - ( -0.4 * 0.1 * ( camera.zoom / 2 ) ); flag = true; }
		camera.updateProjectionMatrix();
	}
	
	if(flag) { fname_s_0195(); }
}






function fname_s_078( delta )
{
	if(camera == cameraTop)
	{
		camera.zoom = delta;
		camera.updateProjectionMatrix();		
	}

	
	infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
	infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
	
	
	var k = 1 / delta;
	if(k <= infProject.settings.camera.limitZoom) 
	{
		k *= kof_rd;

		
		var n1 = 0.25 * k *2;
		var n2 = 0.125 * k *2;		
		var v1 = infProject.geometry.labelWall.vertices;
		v1[ 0 ].x = v1[ 1 ].x = -n1;
		v1[ 2 ].x = v1[ 3 ].x = n1;
		v1[ 1 ].z = v1[ 2 ].z = n2;
		v1[ 0 ].z = v1[ 3 ].z = -n2;
		infProject.geometry.labelWall.verticesNeedUpdate = true;
		infProject.geometry.labelWall.elementsNeedUpdate = true;
		fname_s_07( infProject.scene.array.wall, true );


		var n1 = 1 * k;
		var n2 = 0.25 * k;
		var v = infProject.geometry.labelFloor.vertices;
		v[ 0 ].x = v[ 1 ].x = -n1;
		v[ 2 ].x = v[ 3 ].x = n1;
		v[ 1 ].z = v[ 2 ].z = n2;
		v[ 0 ].z = v[ 3 ].z = -n2;
		infProject.geometry.labelFloor.verticesNeedUpdate = true;
		infProject.geometry.labelFloor.elementsNeedUpdate = true;
		
		
		var n1 = 0.25 * k *2;
		var n2 = 0.125 * k *2;	
		var v1 = infProject.geometry.labelWD.vertices;
		v1[ 0 ].x = v1[ 1 ].x = -n1;
		v1[ 2 ].x = v1[ 3 ].x = n1;
		v1[ 1 ].y = v1[ 2 ].y = n2;
		v1[ 0 ].y = v1[ 3 ].y = -n2;
		infProject.geometry.labelWD.verticesNeedUpdate = true;
		infProject.geometry.labelWD.elementsNeedUpdate = true;	


		
		var point = infProject.tools.point;	
		var v = point.geometry.vertices;
		var v2 = point.userData.tool_point.v2;
			
		for ( var i = 0; i < v2.length; i++ )
		{
			v[i].x = v2[i].x * 1/delta;
			v[i].z = v2[i].z * 1/delta;
		}	

		infProject.tools.point.geometry.verticesNeedUpdate = true;
		infProject.tools.point.geometry.elementsNeedUpdate = true;


		
		for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
	}
}



function fname_s_079( delta, z )
{
	if ( camera != camera3D ) return;

	var vect = ( delta < 0 ) ? z : -z;

	var pos2 = camera.position.clone();

	var dir = new THREE.Vector3().subVectors( infProject.camera.d3.targetPos, camera.position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, vect );
	dir.addScalar( 0.001 );
	var pos3 = new THREE.Vector3().addVectors( camera.position, dir );	


	var qt = fname_s_0223( new THREE.Vector3().subVectors( infProject.camera.d3.targetPos, camera.position ).normalize() );
	var v1 = fname_s_0221( new THREE.Vector3().subVectors( infProject.camera.d3.targetPos, pos3 ), qt );


	var offset = new THREE.Vector3().subVectors( pos3, pos2 );
	var pos2 = new THREE.Vector3().addVectors( infProject.camera.d3.targetPos, offset );

	var centerCam_2 = infProject.camera.d3.targetPos.clone();
	
	if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
	
	if ( v1.z >= 0.5) 
	{ 
		infProject.camera.d3.targetPos.copy(centerCam_2);
		camera.position.copy( pos3 ); 	
	}	
}





function fname_s_080()
{
	if ( camera != cameraTop ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	if(1==2)
	{
		newCameraPosition = {position2D: new THREE.Vector3(pos.x, cameraTop.position.y, pos.z)};
	}
	else
	{
		cameraTop.position.x = pos.x;
		cameraTop.position.z = pos.z;
		newCameraPosition = null;
	}
}


function fname_s_081()
{
	if ( camera != camera3D ) return;

	var pos = new THREE.Vector3();

	if ( obj_point.length > 0 )
	{
		for ( var i = 0; i < obj_point.length; i++ ) { pos.add( obj_point[ i ].position ); }
		pos.divideScalar( obj_point.length );
	}

	newCameraPosition = { position3D: new THREE.Vector3( pos.x, 0, pos.z )};

}


function fname_s_082()
{

	if ( !newCameraPosition ) return;

	if (camera === cameraTop && newCameraPosition.position2D) 
	{ 
		var pos = camera.position.clone();
		
		camera.position.lerp(newCameraPosition.position2D, 0.1);
		
		if(camera3D.userData.camera.startProject)
		{
			var pos2 = new THREE.Vector3( camera.position.x - pos.x, 0, camera.position.z - pos.z );
			infProject.camera.d3.targetPos.add( pos2 );
			camera3D.position.add( pos2 );			
		}
		
		if(fname_s_034(camera.position, newCameraPosition.position2D)) { newCameraPosition = null; if(camera3D.userData.camera.startProject) { camera3D.userData.camera.startProject = false; }; };		
	}
	
	else if ( camera === camera3D && newCameraPosition.position3D )
	{
		infProject.camera.d3.targetPos.lerp( newCameraPosition.position3D, 0.1 );

		var oldDistance = infProject.camera.d3.targetPos.distanceTo( camera.position );

		camera.position.x = oldDistance * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = oldDistance * Math.sin( phi * Math.PI / 360 );
		camera.position.z = oldDistance * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		camera.position.add( infProject.camera.d3.targetPos );
		camera.lookAt( infProject.camera.d3.targetPos );
		
		if(fname_s_034(infProject.camera.d3.targetPos, newCameraPosition.position3D)) { newCameraPosition = null; };		
	}

	else if ( camera === camera3D && newCameraPosition.positionFirst || camera === camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		camera.lookAt( infProject.camera.d3.targetPos ); 
		
		if(fname_s_034(camera.position, pos)) { newCameraPosition = null; };		
	}
	else
	{
		newCameraPosition = null;
	}
	
	fname_s_0195();
}



function fname_s_083(value)
{
	if(camera3D.userData.camera.type != 'first') return;
	
	$('.range-slider2').attr("value", value);
	
	camera3D.position.y = (value / 100) * 2 + 0.2;  
}


function fname_s_084()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	
	return 'Search Bot';
}






function fname_s_085() 
{
	var arr = []; 
	
	var geometry1 = new THREE.SphereGeometry( 0.07, 16, 16 );
	var geometry2 = new THREE.SphereGeometry( 0.05, 16, 16 );
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 } ) );
		
		obj.userData.tag = 'controll_wd';
		obj.userData.controll_wd = { id : i, obj : null };		
		obj.visible = false;
		
		
		var child = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 1, depthTest: false, lightMap : lightMap_1 } ) );
		child.renderOrder = 2;
		obj.add( child );
		 
		arr[i] = obj;
		scene.add( arr[i] );
	}		
	
	return arr;
}






function fname_s_086( wall, obj )
{	
	var p = [];	
	
	obj.geometry.computeBoundingBox(); 
	obj.geometry.computeBoundingSphere(); 	
	
	var bound = obj.geometry.boundingBox;
	var center = obj.geometry.boundingSphere.center; 


	var arrVisible = [true, true, true, true];
	
	if(camera == cameraTop) { arrVisible = [true, true, false, false]; }
	else if(camera == camera3D) { arrVisible = [false, false, false, false]; }
	
	if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
	{
		if(!obj.userData.door.topMenu) { arrVisible = [false, false, false, false]; }
		
		
		p[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, center.y, center.z) );
		p[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, center.y, center.z) );
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}
	else
	{
		arrVisible = [false, false, false, false];
		
		
		var p3 = [];
		p3[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.min.z)) );	
		p3[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.max.z)) );		
		p3[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.min.z)) );
		p3[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.max.z)) );

		var min = { vx: p3[0].x, vz: p3[0].z };
		var max = { vx: p3[0].x, vz: p3[0].z };
		
		for ( var i = 0; i < p3.length; i++ )
		{
			if(min.vx > p3[i].x) { min.vx = p3[i].x; }
			if(max.vx < p3[i].x) { max.vx = p3[i].x; }
			if(min.vz > p3[i].z) { min.vz = p3[i].z; }
			if(max.vz < p3[i].z) { max.vz = p3[i].z; }			
		}
		
		p[0] = wall.localToWorld( new THREE.Vector3(min.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		p[1] = wall.localToWorld( new THREE.Vector3(max.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}

	var arr = infProject.tools.controllWD;
	for ( var i = 0; i < arr.length; i++ )
	{		
		arr[i].position.copy( p[i] );	
		arr[i].rotation.copy( wall.rotation );
		arr[i].visible = arrVisible[i];
		arr[i].obj = obj; 
		arr[i].userData.controll_wd.obj = obj;
	}
}


		
		


function fname_s_087(obj)
{
	var wall = obj.userData.door.wall;   

	fname_s_086( wall, obj );		
	
	
	var boundPos = [];
	
	if(camera == cameraWall)
	{
		var arr = fname_s_0115(wall, arrWallFront.wall[0].index, fname_s_0117(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();		
	}
	else	
	{
		
		var arr = fname_s_0115(wall, 1, fname_s_0117(wall, 1));	
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();
		
		var arr = fname_s_0115(wall, 2, fname_s_0117(wall, 0));
		boundPos[2] = arr[0].clone();
		boundPos[3] = arr[2].clone();  		
	}	
	
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		arrWallFront.wall[i].obj.label[0].visible = false;
		arrWallFront.wall[i].obj.label[1].visible = false;		
	}
	
	var v = wall.userData.wall.v;
	var vZ = v[0].z + (v[4].z - v[0].z) / 2; 
	
	for ( var i = 0; i < boundPos.length; i++ ){ boundPos[i].z = vZ; boundPos[i].y = 0; wall.localToWorld( boundPos[i] ); } 

	
	obj.userData.door.ruler.boundPos = boundPos;	
	
	
	if(clickO.rayhit.object.userData.tag == 'window' || clickO.rayhit.object.userData.tag == 'door') 
	{ 
		
		obj.userData.door.ruler.faceIndex = clickO.rayhit.face.normal.z;
	}	 
	
	fname_s_088(obj);  
}




function fname_s_088(wd)
{
	if(camera != cameraTop) return;
	
	var wall = wd.userData.door.wall;
	
	var line = infProject.scene.size.wd_1.line;
	var label = infProject.scene.size.wd_1.label;	
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;
	
	
	var dirW = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var ang2 = Math.atan2(dirW.x, dirW.z);
	if(ang2 <= 0.001){ ang2 += Math.PI / 2;  }
	else { ang2 -= Math.PI / 2; }	
	
	
	
	var b2 = [];
	wd.updateMatrixWorld();
	var bound = wd.geometry.boundingBox;
	b2[0] = wd.localToWorld( new THREE.Vector3(bound.min.x, 0, 0) ); 
	b2[1] = wd.localToWorld( new THREE.Vector3(bound.max.x, 0, 0) );	
	b2[0].y = b2[1].y = p1.y;
	
	
	
	var pw = [];
	
	if(1==2)	
	{
		pw[0] = wd.userData.door.ruler.boundPos[0]; 	
		pw[1] = wd.userData.door.ruler.boundPos[1]; 	
		pw[2] = wd.userData.door.ruler.boundPos[2]; 	
		pw[3] = wd.userData.door.ruler.boundPos[3]; 	
	}
	else
	{
		pw[0] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[0].x, 0, 0) ); 
		pw[1] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[6].x, 0, 0) ); 
		pw[2] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[4].x, 0, 0) ); 
		pw[3] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[10].x, 0, 0) );		
	}		 	
	
	
	var dirW = wall.getWorldDirection(new THREE.Vector3());
	var offset_1 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[0].z ).multiplyScalar( 1.3 );
	var offset_2 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[4].z ).multiplyScalar( 1.3 );


	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( p2, p1 ).normalize();
	dir[1] = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	
	
	var arrP = [];
	arrP[0] = {p1: b2[0], p2: pw[0], offset: offset_1, dir: dir[0]};
	arrP[1] = {p1: b2[1], p2: pw[1], offset: offset_1, dir: dir[1]};
	arrP[2] = {p1: b2[0], p2: pw[2], offset: offset_2, dir: dir[0]};
	arrP[3] = {p1: b2[1], p2: pw[3], offset: offset_2, dir: dir[1]};			
	arrP[4] = {p1: b2[0], p2: b2[1], offset: offset_1, dir: dir[1]};
	arrP[5] = {p1: b2[0], p2: b2[1], offset: offset_2, dir: dir[1]};
	
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var d = arrP[i].p1.distanceTo( arrP[i].p2 );	
		
		var v = line[i].geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = -d/2;
		v[3].x = v[2].x = v[5].x = v[4].x = d/2;		
		line[i].geometry.verticesNeedUpdate = true;			
		
		var pos = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).divideScalar( 2 ).add(arrP[i].p2);	
		
		
		if(1==1)
		{
			var dir = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).normalize();			
			d = (dir.dot(arrP[i].dir) < - 0.99) ? -d : d;
		}
		
		line[i].position.copy(pos).add(arrP[i].offset);
		line[i].rotation.copy(wall.rotation);

		label[i].position.copy(pos).add(arrP[i].offset.clone().multiplyScalar( 2 ));	 		
		label[i].rotation.set(-Math.PI / 2, 0, ang2);
						
		fname_s_0172({label : label[i], text : Math.round(d * 100) / 100, sizeText : 85, color : 'rgba(0,0,0,1)'});
		
		line[i].visible = true;	
		label[i].visible = true;
		
		line[i].updateMatrixWorld();
		
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			var cone = line[i].userData.rulerwd.cone[i2];
			
			var xp = v[0].x;
			var zr = -Math.PI/2;
			
			if(i2 == 1) { xp = v[3].x; zr = Math.PI/2; }
			
			var pos = line[i].localToWorld( new THREE.Vector3(xp, 0, 0) );
			cone.position.copy(pos);
			cone.rotation.set(-Math.PI/2, 0, wall.rotation.y-zr);
			
			cone.visible = true;
		}
	}
		
}









function fname_s_089( intersect, cdm )
{
	clickO.move = intersect.object; 
	var controll = intersect.object;	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;
	var pos2 = new THREE.Vector3();
	
	
	var m = controll.userData.controll_wd.id;
	
	if(camera == cameraTop)
	{
		planeMath.position.set( 0, intersect.point.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
		var v = wall.userData.wall.v;
		var z = v[0].z + (v[4].z - v[0].z) / 2;
	
		if(m == 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		else if(m == 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }				
	}
	else if(camera == cameraWall)
	{
		
		planeMath.position.copy( intersect.point );
		planeMath.rotation.set( 0, controll.rotation.y, 0 );
		
		var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position ).normalize();
		
		if(m == 0) { pos2 = new THREE.Vector3().addVectors( controll.position, dir ); }
		else if(m == 1) { pos2 = new THREE.Vector3().subVectors( controll.position, dir ); }	
		else if(m == 2) { pos2 = controll.position.clone(); pos2.y = -9999; }
		else if(m == 3) { pos2 = controll.position.clone(); pos2.y = 9999; }
	}

	
	var offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point ); 
	var dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();  
	var qt = fname_s_0223( dir );

	
	wd.userData.door.wall.controll = {  }; 
	wd.userData.door.wall.controll.obj = controll;
	wd.userData.door.wall.controll.pos = controll.position.clone();
	wd.userData.door.wall.controll.dir = dir;
	wd.userData.door.wall.controll.qt = qt;
	wd.userData.door.wall.controll.offset = offset;
	
	var ps = [];
	var arr = infProject.tools.controllWD;
	ps[ps.length] = wall.worldToLocal( arr[0].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[1].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[2].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[3].position.clone() );
	
	wd.userData.door.wall.controll.arrPos = ps;
	
	wd.updateMatrixWorld();	
	wall.updateMatrixWorld();
	
	param_win.click = true;
}

 

 

function fname_s_090( event, controll )
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 	
	if ( intersects.length < 1 ) return; 
	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;

	
	if(param_win.click) 
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_01( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_02( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		
	}	
	
	var pos = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.offset, intersects[ 0 ].point );	
	var v1 = fname_s_0221( new THREE.Vector3().subVectors( pos, wd.userData.door.wall.controll.pos ), wd.userData.door.wall.controll.qt );
	v1 = new THREE.Vector3().addScaledVector( wd.userData.door.wall.controll.dir, v1.z );  
	v1 = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.pos, v1 );	


	
	if(1==2)
	{		
		var pos2 = wall.worldToLocal( v1.clone() );	

		function fname_s_091(pos, pos2)
		{
			var res = Math.floor((pos2 - pos) * 10)/10;
			
			return pos2 - res;
		}		
 
		if(controll.userData.controll_wd.id == 0)
		{  
			pos2.x = fname_s_091(pos2.x, wd.userData.door.wall.controll.arrPos[1].x);
			
			var x_min = wd.userData.door.bound.min.x;  
			if(pos2.x < x_min){ pos2.x = x_min; } 	
			else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 1)
		{
			pos2.x = fname_s_091(pos2.x, wd.userData.door.wall.controll.arrPos[0].x);
			
			var x_max = wd.userData.door.bound.max.x;
			if(pos2.x > x_max){ pos2.x = x_max; }
			else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
		}
		else if(controll.userData.controll_wd.id == 2)
		{
			pos2.y = fname_s_091(pos2.y, wd.userData.door.wall.controll.arrPos[3].y);
			
			var y_min = wd.userData.door.bound.min.y + 0.1;
			if(pos2.y < y_min){ pos2.y = y_min; }
			else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 3)
		{
			pos2.y = fname_s_091(pos2.y, wd.userData.door.wall.controll.arrPos[2].y);
			
			var y_max = wd.userData.door.bound.max.y;
			if(pos2.y > y_max){ pos2.y = y_max; }
			else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
		}		
		
		v1 = wall.localToWorld( pos2 );			
	}
	
	var pos2 = new THREE.Vector3().subVectors( v1, controll.position );  
	controll.position.copy( v1 ); 	

	
	{
		var arr = infProject.tools.controllWD;
		
		var x = arr[0].position.distanceTo(arr[1].position);
		var y = arr[2].position.distanceTo(arr[3].position);
		
		var pos = pos2.clone().divideScalar( 2 ).add( wd.position.clone() );
		
		сhangeSizePosWD( wd, pos, x, y );
	}
	
	
	var arr = infProject.tools.controllWD;	
	if(controll.userData.controll_wd.id == 0 || controll.userData.controll_wd.id == 1)
	{ 
		arr[2].position.add( pos2.clone().divideScalar( 2 ) );
		arr[3].position.add( pos2.clone().divideScalar( 2 ) );
	}
	else if(controll.userData.controll_wd.id == 2 || controll.userData.controll_wd.id == 3)
	{ 
		arr[0].position.add( pos2.clone().divideScalar( 2 ) );
		arr[1].position.add( pos2.clone().divideScalar( 2 ) );
	}	
	
	 
	fname_s_0126(wd);
	
	fname_s_088(wd);
}




function fname_s_092( controll )
{
	if(param_win.click) { param_win.click = false; return; }
	
	var wd = controll.userData.controll_wd.obj;
	
	objsBSP.wd = fname_s_02( wd );
	
	fname_s_03( wd, objsBSP );
	
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}
	
	clickO.last_obj = wd;
}





function fname_s_093( intersect )
{
	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'free_dw') { return; }	
	}	 
	
	var obj = intersect.object;	
	clickO.move = obj;
	

	offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.wallR = fname_s_0100([], clickO.move);

	
	if(1==1)
	{  
		obj.userData.point.last.pos = obj.position.clone(); 		
		
		for ( var i = 0; i < param_wall.wallR.length; i++ )
		{						
			for ( var i2 = 0; i2 < param_wall.wallR[i].userData.wall.arrO.length; i2++ )
			{
				var wd = param_wall.wallR[i].userData.wall.arrO[i2];
				 
				wd.userData.door.last.pos = wd.position.clone();
				wd.userData.door.last.rot = wd.rotation.clone(); 
			}
		}		 			
	}

	fname_s_0283({obj: obj}); 	
}



function fname_s_094()
{
	var arr = [];
	
	for ( var i = 0; i < clickO.move.w.length; i++ )
	{
		arr[i] = { id : clickO.move.w[i].userData.id, arrO : [] };
		
		for ( var i2 = 0; i2 < clickO.move.w[i].userData.wall.arrO.length; i2++ )
		{
			arr[i].arrO[i2] = { pos : '', rot : '' };
			arr[i].arrO[i2].pos = clickO.move.w[i].userData.wall.arrO[i2].position.clone();
			arr[i].arrO[i2].rot = clickO.move.w[i].userData.wall.arrO[i2].rotation.clone();			 
		}
	}

	return arr;
}





function fname_s_095( event, obj )
{
	if(obj.userData.point.type) 
	{ 
		if(obj.userData.point.type == 'continue_create_wall') {  } 
		else { fname_s_097( event, obj ); return; } 
	}	
	
	if(param_win.click) 
	{
		fname_s_04(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );				
		pos.y = obj.position.y; 
		
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		
		obj.position.copy( pos );				
		fname_s_097( event, obj );	
				
		 
		for ( var i = 0; i < obj.w.length; i++ )
		{			
			fname_s_0167(obj.w[i]);	
		}		
	
		fname_s_0103(obj);			
		
		fname_s_07(param_wall.wallR); 
	}
	
}


function fname_s_096(point, point2, wall, side, pos2)
{
	var v = wall.userData.wall.v;
	
	var offX = 0; 
	
	if(side == 0)
	{
		var x1 = v[6].x - (v[0].x + offX);
		var x2 = v[10].x - (v[4].x + offX);	
		var xmin = (x1 < x2) ? x1 : x2;		
	}
	if(side == 1)
	{
		var n = v.length;
		var x1 = (v[n - 6].x - offX) - v[n - 12].x;
		var x2 = (v[n - 2].x - offX) - v[n - 8].x;	
		var xmin = (x1 < x2) ? x1 : x2;			
	}

	
	
	if(xmin <= 0.1)
	{		
		var dir = new THREE.Vector3().subVectors( point.position, point2.position ).normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, Math.abs(xmin - 0.1) + 0.1 );		
		point.position.add( v1 );
	}
	
	return point.position;
}




function fname_s_097( event, obj )
{	
	var arrDp = [];
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; }  
	arrDp[arrDp.length] = planeMath;
	
	var intersects = fname_s_0215( event, arrDp, 'arr' );
	
	var plane = null;
	var point = null;
	var wall = null;	
	var dw = null;
	var pos = new THREE.Vector3();	
	
	for ( var i = 0; i < intersects.length; i++ ) 
	{
		var object = intersects[ i ].object;
		
		if(object.userData.tag == 'planeMath')
		{ 
			pos = intersects[i].point; 
			obj.position.set( pos.x, obj.position.y, pos.z ); 
			plane = object; 
		} 			
		else if(object.userData.tag == 'wall')
		{ 			
			var flag = true;
			for ( var i2 = 0; i2 < object.userData.wall.p.length; i2++ ) 
			{				
				if(object.userData.wall.p[i2].userData.id == obj.userData.id) { flag = false; break; }									
			}
			if(flag) { wall = object; }			
		}
		else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ dw = object; } 
	}
	
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == obj) { continue; }		

		var p1 = new THREE.Vector3( obj.position.x, 0, obj.position.z ); 
		var p2 = new THREE.Vector3( obj_point[i].position.x, 0, obj_point[i].position.z ); 
		
		if(p1.distanceTo( p2 ) < 0.2 / camera.zoom)
		{ 
			obj.position.set( obj_point[i].position.x, obj.position.y, obj_point[i].position.z );
			obj.userData.point.cross = point = obj_point[i];
			break;
		}	
	}	
 
	  
	if(point) 
	{
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;		
	} 
	else if(dw)
	{
		obj.userData.point.cross = null; 
	}
	else if(!wall) 
	{ 
		obj.userData.point.cross = plane;
		
		fname_s_098( obj );		
	}
	else
	{ 
		wall.updateMatrixWorld();			
		var pos = wall.worldToLocal( pos.clone() );	
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, 0, 0 ) ); 		
		obj.position.set( pos.x, obj.position.y, pos.z ); 
		obj.userData.point.cross = wall; 
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;

		fname_s_098( obj );
	}
}

  




function fname_s_098( point )
{ 
	var pX = [];
	var pZ = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == point) { continue; }		

		var p1 = fname_s_030(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(10,0,0)), point.position);	
		var p2 = fname_s_030(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(0,0,10)), point.position);
		
		var x = Math.abs( obj_point[i].position.x - p1.x );
		var z = Math.abs( obj_point[i].position.z - p2.z );
		
		if(x < 0.06 / camera.zoom){ pX[pX.length] = i; }
		if(z < 0.06 / camera.zoom){ pZ[pZ.length] = i; }			
	}
	
	
	if(pX.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pX.length; i++ ){ v[i] = obj_point[pX[i]].position; }
		var n1 = pX[fname_s_0122(v, point.position)];		 
	} 
	
	if(pZ.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pZ.length; i++ ){ v[i] = obj_point[pZ[i]].position; }
		var n2 = pZ[fname_s_0122(v, point.position)]; 		
	}	
	
	
	if(pX.length > 0 && pZ.length > 0) 
	{ 
		point.position.x = obj_point[n1].position.x; 
		point.position.z = obj_point[n2].position.z; 		
		fname_s_099(point, obj_point[n1].position, infProject.tools.axis[0], 'xz'); 
		fname_s_099(point, obj_point[n2].position, infProject.tools.axis[1], 'xz'); 
	}
	else
	{
		(pX.length > 0) ? fname_s_099(point, obj_point[n1].position, infProject.tools.axis[0], 'x') : infProject.tools.axis[0].visible = false;
		(pZ.length > 0) ? fname_s_099(point, obj_point[n2].position, infProject.tools.axis[1], 'z') : infProject.tools.axis[1].visible = false;
	}
}

 



function fname_s_099(point, pos2, lineAxis, axis)
{
	
	if(axis == 'x') { point.position.x = pos2.x; }
	if(axis == 'z') { point.position.z = pos2.z; } 
	
	var pos2 = new THREE.Vector3(pos2.x, point.position.y, pos2.z);

	var dir = new THREE.Vector3().subVectors( point.position, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	lineAxis.rotation.set(0, angleDeg + Math.PI / 2, 0);		
	lineAxis.position.copy( point.position );
	lineAxis.visible = true;	
}


 



function fname_s_0100(arr, point) 
{	
	for ( var i = 0; i < point.p.length; i++ )
	{				
		for ( var j = 0; j < point.p[i].w.length; j++ )
		{
			var flag = false;
			for ( var i2 = 0; i2 < arr.length; i2++ )
			{
				if(point.p[i].w[j] == arr[i2]){ flag = true; break; }
			}
			
			if(flag){ continue; }				

			arr[arr.length] = point.p[i].w[j];
		}		
	}
	
	return arr;	
}



function fname_s_0101(wall) 
{	
	var arr = [];

	for ( var j = 0; j < wall.userData.wall.p.length; j++ )
	{
		for ( var i = 0; i < wall.userData.wall.p[j].p.length; i++ )
		{ 
			for ( var i2 = 0; i2 < wall.userData.wall.p[j].p[i].w.length; i2++ ) 
			{ 	
				var flag = true;
				for ( var i3 = 0; i3 < arr.length; i3++ )
				{
					if(arr[i3] == wall.userData.wall.p[j].p[i].w[i2]) { flag = false; }
				}

				if(flag) { arr[arr.length] = wall.userData.wall.p[j].p[i].w[i2]; }
			} 
		}		
	}
	
	return arr;	
}




function fname_s_0102(wall) 
{	
	var arr = [];

	for ( var i = 0; i < wall.userData.wall.p.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[i].w.length; i2++ )
		{ 
			var flag = true;
			for ( var i3 = 0; i3 < arr.length; i3++ )
			{
				if(arr[i3] == wall.userData.wall.p[i].w[i2]) { flag = false; }
			}

			if(flag) { arr[arr.length] = wall.userData.wall.p[i].w[i2]; } 
		}		
	}
	
	return arr;	
}




function fname_s_0103(point)
{		
	
	fname_s_0104(point);	

	
	
	var arrP = point.p;
	for ( var j = 0; j < arrP.length; j++ )
	{
		
		if(arrP[j].p.length > 1) { fname_s_0104(arrP[j]); }		
	}
	
}


function fname_s_0104(point)
{
	var point = point;
	var arrP = point.p;
	var arrW = point.w;
	var arrS = point.start;
	
	var arrD = [];
	
	var n = 0;
	for ( var i = 0; i < arrP.length; i++ )
	{
		if(point.position.distanceTo(arrP[i].position) < 0.1)
		{ 
			arrW[i].geometry.vertices[0].x = 0;
			arrW[i].geometry.vertices[1].x = 0;	
			arrW[i].geometry.vertices[2].x = 0;	
			arrW[i].geometry.vertices[3].x = 0;	
			arrW[i].geometry.vertices[4].x = 0;	
			arrW[i].geometry.vertices[5].x = 0;			
			arrW[i].geometry.vertices[6].x = 0;
			arrW[i].geometry.vertices[7].x = 0;	
			arrW[i].geometry.vertices[8].x = 0;	
			arrW[i].geometry.vertices[9].x = 0;	
			arrW[i].geometry.vertices[10].x = 0;	
			arrW[i].geometry.vertices[11].x = 0;	
			continue; 
		}
		
		arrD[n] = [];
		arrD[n][1] = i;
		arrD[n][0] = new THREE.Vector3().subVectors( point.position, arrP[i].position ).normalize();
		arrD[n][0] = Math.atan2(arrD[n][0].x, arrD[n][0].z);
		
		if(arrD[n][0] < 0){ arrD[n][0] += Math.PI * 2; }		
		n++;
	}
	
	arrD.sort(function (a, b) { return a[0] - b[0]; });
	
	for ( var i = 0; i < arrD.length - 1; i++ )
	{ 
		fname_s_0105(arrW[arrD[i][1]], arrW[arrD[i + 1][1]], arrS[arrD[i][1]], arrS[arrD[i + 1][1]], point.position); 
	}	
	var i2 = arrD.length - 1; 
	if(arrD[i2]) 
	{
		fname_s_0105(arrW[arrD[i2][1]], arrW[arrD[0][1]], arrS[arrD[i2][1]], arrS[arrD[0][1]], point.position);		
	}
}



function fname_s_0105(line1, line2, s1, s2, pointC)
{
	var v1 = line1.geometry.vertices;
	var v2 = line2.geometry.vertices;
	
	if(s1 == 1){ var n1 = 0; var n2 = 6; var n3 = 7; var n4 = 8; var n5 = 9; }
	else { var n1 = 10; var n2 = 4; var n3 = 5; var n4 = 2; var n5 = 3; }
	
	if(s2 == 1){ var f1 = 4; var f2 = 10; var f3 = 11; var f4 = 8; var f5 = 9; }
	else { var f1 = 6; var f2 = 0; var f3 = 1; var f4 = 2; var f5 = 3; }


	
	
	line1.updateMatrixWorld();
	var m1a = line1.localToWorld( v1[n1].clone() );
	var m1b = line1.localToWorld( v1[n2].clone() );

	line2.updateMatrixWorld();
	var m2a = line2.localToWorld( v2[f1].clone() );
	var m2b = line2.localToWorld( v2[f2].clone() );

	
	var crossP = fname_s_022(m1a, m1b, m2a, m2b);

	var cross = false;
	
	if(!crossP[1]) { if(fname_s_0106(m1a, m1b, m2a, m2b)) { cross = true; } }	
	
	if(cross)
	{		
		var per1 = line1.worldToLocal( crossP[0].clone() ).x;
		var per2 = line2.worldToLocal( crossP[0].clone() ).x;
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;
	}
	else
	{
		var vpc = line1.worldToLocal( pointC.clone() );
		vpc.z = m1a.z;
		
		crossP[0] = vpc;
		crossP[0] = line1.localToWorld( crossP[0].clone() );
		 
		var rs = line1.userData.wall.width - line2.userData.wall.width;
		
		if(rs < -0.1) 
		{
			var per1 = line1.worldToLocal( fname_s_022(m1a, m1b, pointC, m2b)[0] ).x;
			var per2 = line2.worldToLocal( pointC.clone() ).x;
		}
		else if(rs > 0.1)
		{
			var per1 = line1.worldToLocal( pointC.clone() ).x;
			var per2 = line2.worldToLocal( fname_s_022(pointC, m1b, m2a, m2b)[0] ).x;
		}
		else 
		{ 
			var per1 = line1.worldToLocal( crossP[0].clone() ).x; 
			var per2 = line2.worldToLocal( crossP[0].clone() ).x;			
		}		
		
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;	
	}


	v1[n2].x = v1[n3].x = per1;
	v2[f2].x = v2[f3].x = per2;
	
	v1[n4].x = v1[n5].x = per3;
	v2[f4].x = v2[f5].x = per4;	

	line1.geometry.verticesNeedUpdate = true;	
	line2.geometry.verticesNeedUpdate = true;
	
	line1.geometry.computeBoundingBox(); 	
	line1.geometry.computeBoundingSphere();	
	
	line2.geometry.computeBoundingBox(); 	
	line2.geometry.computeBoundingSphere();	
}






 
 
function fname_s_0106(p0, p1, p2, p3)
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
	var p1 = new THREE.Vector3().addVectors( p1, v1 );		
		
	var dir = new THREE.Vector3().subVectors( p3, p2 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 10.2 );
	var p3 = new THREE.Vector3().addVectors( p3, v1 );	
	
	if( !fname_s_026(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}



 
function fname_s_0107(p0, p1, p2, p3) 
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.01 );
	var p0 = new THREE.Vector3().addVectors( p0, v1 );		
	var p1 = new THREE.Vector3().subVectors( p1, v1 );
	
	if( !fname_s_026(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}





function fname_s_0108( point, walls )
{
	point.position.copy( point.userData.point.last.pos );
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		fname_s_0167(point.w[i], {point:point});		
	}		
	
	fname_s_0103(point);  
	fname_s_07(walls);
	fname_s_0142(point.zone); 
	
	fname_s_05(walls);
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;		
}


function fname_s_0109(obj)
{  	
	obj.userData.point.last.pos = obj.position.clone();
}







var param_wall = { click : false, wallR : [], posS : 0, qt_1 : [], qt_2 : [], arrZone : [] };


function fname_s_0110( intersect )
{
	var obj = intersect.object;
	
	clickO.move = obj;
	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.posS = new THREE.Vector3().addVectors( intersect.point, offset );	
	  
	param_wall.wallR = fname_s_0101(obj);

	var p = obj.userData.wall.p;
	
	for ( var i = 0; i < p[0].w.length; i++ )
	{  
		var dir = new THREE.Vector3().subVectors( p[0].position, p[0].p[i].position ).normalize();	
		param_wall.qt_1[i] = fname_s_0223(dir);
	}
	
	for ( var i = 0; i < p[1].w.length; i++ )
	{ 
		var dir = new THREE.Vector3().subVectors( p[1].position, p[1].p[i].position ).normalize();
		param_wall.qt_2[i] = fname_s_0223(dir);
	}
	
	param_wall.arrZone = fname_s_0112(obj);

	clickO.click.wall = [...new Set([...p[0].w, ...p[1].w])];  
	
	fname_s_0111(obj);
	
	if(camera == cameraTop)
	{
		fname_s_0283({obj: obj}); 	
	}
}



function fname_s_0111(wall)
{
	wall.userData.wall.p[0].userData.point.last.pos = wall.userData.wall.p[0].position.clone();
	wall.userData.wall.p[1].userData.point.last.pos = wall.userData.wall.p[1].position.clone();
	
	var walls = fname_s_0101(wall);
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		walls[i].userData.wall.last.pos = walls[i].position.clone();
		walls[i].userData.wall.last.rot = walls[i].rotation.clone();
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			 
			wd.userData.door.last.pos = wd.position.clone();
			wd.userData.door.last.rot = wd.rotation.clone(); 
		}
	}		 				
}
	




function fname_s_0112( wall )
{
	var m = 0;
	arr = [];
	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) { arr[m] = wall.userData.wall.p[0].zone[i]; m++; } 
	for ( var i = 0; i < wall.userData.wall.p[1].zone.length; i++ )
	{
		var flag = true;
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(wall.userData.wall.p[1].zone[i] == arr[i2]) { flag = false; break; }
		}
		
		if(flag) { arr[m] = wall.userData.wall.p[1].zone[i]; m++; }
	}

	return arr;	
}







function fname_s_0113( event, obj ) 
{		
	
	if(camera == camera3D) { fname_s_071( event ); return; }
	
	if(param_win.click) 
	{
		fname_s_04(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );	
		
		
		
		var x1 = obj.userData.wall.p[1].position.z - obj.userData.wall.p[0].position.z;
		var z1 = obj.userData.wall.p[0].position.x - obj.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						
		
		var qt1 = fname_s_0223(dir);
		var v1 = fname_s_0221( new THREE.Vector3().subVectors( pos, param_wall.posS ), qt1 );	
		v1 = new THREE.Vector3().addScaledVector( dir, v1.z );
		pos = new THREE.Vector3().addVectors( param_wall.posS, v1 );

		var pos3 = obj.position.clone();
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );			
		
		
		
		pos2 = new THREE.Vector3().subVectors ( fname_s_0114(obj.userData.wall.p[0], pos2, param_wall.qt_1, dir), obj.userData.wall.p[0].position ); 
		pos2 = new THREE.Vector3().subVectors ( fname_s_0114(obj.userData.wall.p[1], pos2, param_wall.qt_2, dir), obj.userData.wall.p[1].position );
		
		
		pos2 = new THREE.Vector3(pos2.x, 0, pos2.z);
						
		obj.userData.wall.p[0].position.add( pos2 );
		obj.userData.wall.p[1].position.add( pos2 );		
		
		
		for ( var i = 0; i < clickO.click.wall.length; i++ )
		{ 
			fname_s_0167(clickO.click.wall[i]);		
		}
		
		fname_s_0103(obj.userData.wall.p[0]);
		fname_s_0103(obj.userData.wall.p[1]);
		
		fname_s_07(param_wall.wallR); 
	}	
}







function fname_s_0114(point, pos2, qt, dir2)
{
	var pos = new THREE.Vector3().addVectors ( point.position, pos2 );	
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.w[i] == clickO.move){ continue; }
		
		var v = point.w[i].userData.wall.v;
		
		
		if(point.start[i] == 0)
		{
			var x1_a = v[0].x;
			var x1_b = v[4].x;				
			var x2_a = v[6].x;
			var x2_b = v[10].x;
			

			var v2 = fname_s_0221( new THREE.Vector3().subVectors( new THREE.Vector3(0,0,0), pos2 ), qt[i] );
			
			var fg1 = false;
			var fg2 = false;
			if(x2_a - (x1_a + v2.z) <= 0.05){ fg1 = true; }
			if(x2_b - (x1_b + v2.z) <= 0.05){ fg2 = true; } 
			if(fg1 & fg2)
			{ 
				if(x2_a - (x1_a + v2.z) < x2_b - (x1_b + v2.z) ){ fg2 = false; } 
				else{ fg1 = false; }
			}
			
						
			if(fg1)
			{				
				var zx1 = v[6].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[4], v[0] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{	
				var zx1 = v[10].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[0], v[4] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );			
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_021(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}
		}
		else if(point.start[i] == 1)
		{
			var v2 = fname_s_0221( new THREE.Vector3().subVectors( pos2, new THREE.Vector3(0,0,0) ), qt[i] );
			
			var n = v.length;				
			var x1_a = v[n - 12].x;
			var x1_b = v[n - 8].x;				
			var x2_a = v[n - 6].x;
			var x2_b = v[n - 2].x;	

			
			var fg1 = false;
			var fg2 = false;
			if((x2_a + v2.z) - x1_a < 0.05){ fg1 = true; }
			if((x2_b + v2.z) - x1_b < 0.05){ fg2 = true; }
			if(fg1 & fg2)
			{ 
				if((x2_a + v2.z) - x1_a < (x2_b + v2.z) - x1_b){ fg2 = false; } 
				else{ fg1 = false; }
			}			

			
			if(fg1)
			{
				var zx1 = v[v.length - 12].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 2], v[v.length - 6] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{			
				var zx1 = v[v.length - 8].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 6], v[v.length - 2] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );		
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_021(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}			
		}	

				
	}
	
	return pos;
}









function fname_s_0115(wall, index, room) 
{
	var p = wall.userData.wall.p;
	var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();						
	var unique = fname_s_0116([{ obj : wall, dir : 'forward' }], p, dir1);	
	
	var arrW = [];
	var arrS = [];
	for (i = 0; i < unique.length; i++) 
	{  
		arrW[i] = unique[i].obj; 
		arrS[i] = (unique[i].dir == 'forward') ? index : (index == 1) ? 2 : 1; 	
	}
	
		
	arrWallFront.index = index;  
	arrWallFront.room = room;
	arrWallFront.wall = [];	  
	arrWallFront.wall_2 = [];	
	
	
	
	if(room)
	{
		for (var i = arrW.length - 1; i >= 0; i--) 
		{ 
			var flag = true;
			
			for (var i2 = 0; i2 < room.w.length; i2++)  
			{
				if(arrW[i] == room.w[i2]) { flag = false; break; }
			}	

			if(flag) { arrW.splice(i, 1); arrS.splice(i, 1); }
		}

		
		var arrW2 = [];
		for (var i = 0; i < arrW.length; i++)
		{
			var p = arrW[i].userData.wall.p;
			
			for (var i2 = 0; i2 < p.length; i2++)
			{
				for (var i3 = 0; i3 < p[i2].w.length; i3++)
				{
					if(p[i2].w[i3] == arrW[i]) continue;		
					
					var flag = false;					
					for (var i4 = 0; i4 < arrW.length; i4++)  
					{
						if(p[i2].w[i3] == arrW[i4]) { flag = true; break; }		
					}										
					if(flag) { continue; }
				
					
					for (var i4 = 0; i4 < room.w.length; i4++)  
					{
						
						if(p[i2].w[i3] == room.w[i4]) 
						{ 
							var dir2 = new THREE.Vector3().subVectors( p[i2].w[i3].userData.wall.p[1].position, p[i2].w[i3].userData.wall.p[0].position ).normalize();
							var rad = new THREE.Vector3(dir1.z, 0, dir1.x).angleTo(new THREE.Vector3(dir2.z, 0, dir2.x));
							
							if(index == 2) if(Math.round(THREE.Math.radToDeg(rad)) > 90) continue;		
							if(index == 1) if(Math.round(THREE.Math.radToDeg(rad)) < 90) continue; 
							
							
							arrW2.push(p[i2].w[i3]); 
							break; 
						}	
					}					
				}
			}			
		}
		
		arrWallFront.wall_2 = arrW2; 	
	}
	

	
	for (i = 0; i < arrW.length; i++) 
	{ 
		arrWallFront.wall[i] = { obj : arrW[i], index : arrS[i] };  
	}


	
	var arrV2 = [];
	for (i = 0; i < arrW.length; i++)
	{
		arrW[i].updateMatrixWorld();
		var v = arrW[i].userData.wall.v;			
		
		var arrN = (arrS[i] == 2) ? [4,5,11,10] : [0,1,7,6];

		for (i2 = 0; i2 < arrN.length; i2++)
		{ 
			if(i == 0) { arrV2[arrV2.length] = v[arrN[i2]].clone(); }
			else 
			{ 
				var worldV = arrW[i].localToWorld( v[arrN[i2]].clone() ); 
				arrV2[arrV2.length] = arrW[0].worldToLocal( worldV );  
			}
		}
		
	}
	
	
	var box = { min : { x : arrV2[0].x, y : arrV2[0].y }, max : { x : arrV2[0].x, y : arrV2[0].y } };
	
	for (i = 0; i < arrV2.length; i++)
	{
		if(arrV2[i].x < box.min.x) { box.min.x = arrV2[i].x; }
		else if(arrV2[i].x > box.max.x) { box.max.x = arrV2[i].x; }
		
		if(arrV2[i].y < box.min.y) { box.min.y = arrV2[i].y; }
		else if(arrV2[i].y > box.max.y) { box.max.y = arrV2[i].y; }			
	}
	
	
	var arrV3 = 
	[
		new THREE.Vector3(box.min.x, box.min.y, 0), 
		new THREE.Vector3(box.min.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.min.y, 0), 
	];
	
	
	
	var arrV = [];
	
	for (i = 0; i < arrV3.length; i++)
	{
		var min = 99999;
		var n = 0;
		
		for (i2 = 0; i2 < arrV2.length; i2++)
		{
			var d = arrV3[i].distanceTo(arrV2[i2]); 
			
			if(min > d) { n = i2; min = d; }
		}
		
		arrV[i] = arrV2[n];
	}	
	
	arrV[arrV.length] = arrV[0].clone();
	
	var vZ = (index == 2) ? v[4].z : v[0].z;
	for (i = 0; i < arrV.length; i++) { arrV[i].z = vZ; }


	
	
	arrWallFront.bounds = { min : { x : 0, y : 0 }, max : { x : 0, y : 0 } };
	
	var xC = (box.max.x - box.min.x)/2 + box.min.x;
	var yC = (box.max.y - box.min.y)/2 + box.min.y;
	
	arrWallFront.bounds.min.x = wall.localToWorld( new THREE.Vector3(box.min.x, yC, vZ) );	 
	arrWallFront.bounds.max.x = wall.localToWorld( new THREE.Vector3(box.max.x, yC, vZ) );
	arrWallFront.bounds.min.y = wall.localToWorld( new THREE.Vector3(xC, box.min.y, vZ) );
	arrWallFront.bounds.max.y = wall.localToWorld( new THREE.Vector3(xC, box.max.y, vZ) );	
	
	return arrV;
}





function fname_s_0116(arr, p, dir1)
{
	
	var arrW = [...new Set([...p[0].w, ...p[1].w])];		
	
	
	for (var i = 0; i < arrW.length; i++)
	{ 	
		var flag = false;
		for (i2 = 0; i2 < arr.length; i2++) { if(arrW[i] == arr[i2].obj) { flag = true; break; } }
		if(flag) continue;
		
		var dir2 = new THREE.Vector3().subVectors( arrW[i].userData.wall.p[1].position, arrW[i].userData.wall.p[0].position ).normalize();
		
		var str = null;
		
		if(fname_s_034(dir1, dir2)) { str = 'forward'; }
		else if(fname_s_034(dir1, new THREE.Vector3(-dir2.x,-dir2.y,-dir2.z))) { str = 'back'; }
		
		if(str) 
		{ 	
			arr[arr.length] = { obj : arrW[i], dir : str }; 
			arr = fname_s_0116(arr, arrW[i].userData.wall.p, dir1); 
		}
	}		

	
	return arr;
}



function fname_s_0117(wall, index)
{
	var num = -1;
	
	for ( var i = 0; i < room.length; i++ ) 
	{  
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(wall == room[i].w[i2])
			{
				var side = (index == 1) ? 1 : 0;
				
				if(side == room[i].s[i2]) { num = i; }
				
				break;
			} 
		}	
	}

	if(num == -1) { return null;  };

	return room[num];
}




function fname_s_0118(wall)
{
	if(fname_s_034(wall.userData.wall.last.pos, wall.position)) { return; }		
	
	fname_s_0103( wall.userData.wall.p[ 0 ] );
	fname_s_0103( wall.userData.wall.p[ 1 ] );
	fname_s_07( param_wall.wallR ); 
	fname_s_0142( param_wall.arrZone ); 		
	
	fname_s_05(param_wall.wallR);
}




var param_win = { click : false };


function fname_s_0119( intersect )
{	
	var obj = intersect.object;

	clickO.move = obj;
	
	var pos = intersect.point;
	
	if(camera != cameraWall) { pos.y = obj.position.y; }
	
	if(camera == cameraTop) 
	{
		planeMath.position.set( 0, pos.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	else
	{
		planeMath.position.copy( pos );
		planeMath.rotation.set( 0, obj.rotation.y, 0 );					
	}	
	
	planeMath.updateMatrixWorld();  

	param_win.click = true;

	obj.userData.door.offset = new THREE.Vector3().subVectors( obj.position, pos );	
	
	fname_s_0120(obj);	
	
	if(camera == cameraTop)
	{
		fname_s_087( obj ); 	
		fname_s_0126( obj );		
		
		fname_s_0283({obj: obj}); 	
	}
}






function fname_s_0120(wd)
{
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.0;	
	var off_2 = 0.0;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off_2 }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	
	var arrWD = {};
	if(arrWD.left && 1==2)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0122(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right && 1==2)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0122(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
}





function fname_s_0121(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}





function fname_s_0122(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}


 

function fname_s_0123( event, wd ) 
{
	if(camera == camera3D) { return; }
	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 	
	if ( intersects.length > 0 ) { fname_s_0124( wd, intersects[ 0 ].point ); }	
}


var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();

function fname_s_0124( wd, pos )
{
	var wall = wd.userData.door.wall;
	
	if(param_win.click)  
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_01( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_02( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 			
	}
	
	pos = new THREE.Vector3().addVectors( wd.userData.door.offset, pos );			
	pos = wall.worldToLocal( pos.clone() );
	
	var x_min = wd.geometry.boundingBox.min.x;
	var x_max = wd.geometry.boundingBox.max.x;
	var y_min = wd.geometry.boundingBox.min.y;
	var y_max = wd.geometry.boundingBox.max.y;
	
	var bound = wd.userData.door.bound;
	
	if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
	else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }	
	
	
	if(camera != cameraTop)
	{
		if(pos.y + y_min < bound.min.y){ pos.y = bound.min.y - y_min; }
		else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }
	}	
	
	if(camera == cameraTop){ pos.z = 0; }	
	
	var pos = wall.localToWorld( pos.clone() );
	
	var pos2 = new THREE.Vector3().subVectors( pos, wd.position );
	
	wd.position.copy( pos );	

	wd.userData.door.h1 += pos2.y;
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].position.add( pos2 ); } 	
	
	fname_s_088(wd); 	
}





function fname_s_0125( obj )
{	
	if(clickO.rayhit) 
	{
		if(clickO.rayhit.object == obj) return;	
		
		if(clickO.rayhit.object.userData.tag == 'controll_wd')
		{
			if(clickO.rayhit.object.userData.controll_wd.obj == obj) { return; }
		}		
	}		
		
	if(camera == cameraTop || camera == camera3D) 
	{ 		
		if(obj)
		{
			if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
			{
				if(camera == camera3D)
				{
					obj.userData.door.wall.label[0].visible = true; 
					obj.userData.door.wall.label[1].visible = true;	 
				}
				else
				{
					for ( var i = 0; i < arrWallFront.wall.length; i++ )
					{
						arrWallFront.wall[i].obj.label[0].visible = true;
						arrWallFront.wall[i].obj.label[1].visible = true;		
					}					
				}
			}			
		}
	}
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].visible = false; }
	for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ) 
	{ 
		var line = infProject.scene.size.wd_1.line[i];
		line.visible = false; 
		for ( var i2 = 0; i2 < line.userData.rulerwd.cone.length; i2++ )
		{
			line.userData.rulerwd.cone[i2].visible = false; 
		}	
	}
	for ( var i = 0; i < infProject.scene.size.wd_1.label.length; i++ ){ infProject.scene.size.wd_1.label[i].visible = false; }
}



function fname_s_0126(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			
	
	$('[nameId="size-wd-length"]').val(Math.round(d1 * 100) / 100);
	$('[nameId="size-wd-height"]').val(Math.round(d2 * 100) / 100);
	$('[nameId="rp_wd_h1"]').val(Math.round((wd.userData.door.h1 + minY) * 100) / 100);
}




function fname_s_0127(wd)
{  
	if(!wd) return;
	if(wd.userData.tag == 'window' || wd.userData.tag == 'door'){}
	else { return; }
	
	var wall = wd.userData.door.wall;
	
	var x = $('[nameId="size-wd-length"]').val();		
	var y = $('[nameId="size-wd-height"]').val();		
	var h = $('[nameId="rp_wd_h1"]').val();				
	
	
	
	wd.geometry.computeBoundingBox();
	var x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
	var y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));
	var h2 = wd.userData.door.h1 + wd.geometry.boundingBox.min.y;	
		
	var resX = fname_s_0231({ value: x, unit: 1, limit: {min: 0.1, max: 5} });
	var resY = fname_s_0231({ value: y, unit: 1, limit: {min: 0.1, max: 5} });
	var resH = fname_s_0231({ value: h, unit: 1, limit: {min: 0, max: 5} });
	
	x = (!resX) ? x2 : resX.num;
	y = (!resY) ? y2 : resY.num;	 
	h = (!resH) ? h2 : resH.num;
	
	
	wd.userData.door.h1 = h - wd.geometry.boundingBox.min.y;    
	
	var pos = wd.position.clone(); 
	pos.y = wd.userData.door.h1; 
	
	сhangeSizePosWD( wd, pos, x, y );	
	
	wallClone.geometry = fname_s_01( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );		

	fname_s_03( wd, { wall : wallClone, wd : fname_s_02( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	fname_s_087(wd);	
	fname_s_0126(wd);	
	
	fname_s_0195();
}





function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var v2 = wd.userData.door.form.v2;
	var size = wd.userData.door.form.size;
	
	var scale = new THREE.Vector3(x/size.x, y/size.y, 1);	
	
	for ( var i = 0; i < v2.length; i++ )
	{
		v[i].x = v2[i].x * scale.x;
		v[i].y = v2[i].y * scale.y;
		
	}		

	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
	
	 
	
	if(wd.userData.door.objPop)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		var objPop = wd.userData.door.objPop;
		
		objPop.geometry.computeBoundingBox();		
		var dX = objPop.geometry.boundingBox.max.x - objPop.geometry.boundingBox.min.x;
		var dY = objPop.geometry.boundingBox.max.y - objPop.geometry.boundingBox.min.y;				
		
		objPop.scale.set(x/dX, y/dY, 1);			
	}	
}





function fname_s_0128(wd)
{
	if(param_win.click) { param_win.click = false; return; }
	
	fname_s_03( wd, objsBSP );
	 
	if(camera == cameraTop)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}	

	
}




function fname_s_0129()
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(camera == camera3D)
	{
		if ( tag == 'wall' ) return;
	}
	else if(camera == cameraWall)
	{
		if ( tag == 'wall' ) return;
	}	
		
	if ( tag == 'wall' ) { fname_s_0130( obj ).room; }
	else if ( tag == 'point' ) { if(obj.p.length == 2) { fname_s_0134( obj ); } }
	else if ( tag == 'window' || tag == 'door' ) { fname_s_0135( obj ); }
	else if ( tag == 'obj' ) { fname_s_0252(obj); }
	
	 fname_s_0195();
}


function fname_s_0130( wall )
{	
	fname_s_061(wall);
	
	var points = wall.userData.wall.p;

	var arrZone = fname_s_0162( wall );
	var oldZ = fname_s_0143(arrZone);
	fname_s_0156(arrZone); 
	
	var zone = (arrZone.length == 0) ? fname_s_035( wall ).obj : null; 
	
	fname_s_0131(wall);
	
	var newZones = [];
	
	
	if(oldZ.length > 0) 
	{ 
		var area = oldZ[0].floor.userData.room.areaTxt;
		var n = 0;
		for ( var i = 0; i < oldZ.length; i++ ) { if(oldZ[i].floor.userData.room.areaTxt > area) { n = i; } }
		
		newZones = fname_s_0145();

		if(newZones.length > 0) { fname_s_0160([newZones[0]], oldZ[n], false); } 
	}
	else
	{	
		if(zone) { fname_s_09([zone]); }				
	}

	return { room : newZones }; 
}



function fname_s_0131(wall)
{
	fname_s_0178();
	
	var arr = wall.userData.wall.arrO;

	for(var i = 0; i < arr.length; i++)
	{
		if(arr[i].userData.tag == 'window') { fname_s_0136({arr : infProject.scene.array.window, o : arr[i]}); }
		if(arr[i].userData.tag == 'door') { fname_s_0136({arr : infProject.scene.array.door, o : arr[i]}); }
		scene.remove( arr[i] );
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	fname_s_0137(p0, wall);
	fname_s_0137(p1, wall);
	fname_s_0136({arr : infProject.scene.array.wall, o : wall});;
	
	for ( var i = 0; i < wall.label.length; i ++ ){ scene.remove(wall.label[i]); } 
	scene.remove( wall );
	
	if(p0.w.length == 0){ fname_s_0138( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ fname_s_0138( p1 ); scene.remove( p1 ); }


	var arrW = [];
	for ( var i = 0; i < p0.w.length; i++ ) { arrW[arrW.length] = p0.w[i]; }
	for ( var i = 0; i < p1.w.length; i++ ) { arrW[arrW.length] = p1.w[i]; }  
	fname_s_04( arrW );	
	
	if(p0.w.length > 0){ fname_s_0104(p0); }
	if(p1.w.length > 0){ fname_s_0104(p1); }

	fname_s_07(arrW);
	
	fname_s_05( arrW );
}



function fname_s_0132(wall, cdm)
{
	if(!cdm) { cdm = {}; }
	if(!cdm.dw) { cdm.dw = ''; }
	
	fname_s_0178();
	
	if(cdm.dw == 'no delete') {}
	else
	{
		var arr = wall.userData.wall.arrO;
		
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i].userData.tag == 'window') { fname_s_0136({arr : infProject.scene.array.window, o : arr[i]}); }
			if(arr[i].userData.tag == 'door') { fname_s_0136({arr : infProject.scene.array.door, o : arr[i]}); }
			scene.remove( arr[i] );
		}		
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	fname_s_0137(p0, wall);
	fname_s_0137(p1, wall);
	fname_s_0136({arr : infProject.scene.array.wall, o : wall});;
	
	for ( var i = 0; i < wall.label.length; i ++ ){ scene.remove(wall.label[i]); }	
	scene.remove( wall );
	
	if(p0.w.length == 0){ fname_s_0138( p0 ); scene.remove( p0 ); }
	if(p1.w.length == 0){ fname_s_0138( p1 ); scene.remove( p1 ); }

}



function fname_s_0133( point )
{
	fname_s_0138(point); 
	scene.remove(point);
}


function fname_s_0134( point )
{
	if(!point){ return [ null, null ]; }
	if(point.p.length != 2){ return [ null, null ]; }
	
	fname_s_061(point);
	
	var wall_1 = point.w[0];
	var wall_2 = point.w[1];
		
	var arrW_2 = fname_s_0100([], point);
	
	fname_s_04( arrW_2 );
	 
	var point1 = point.p[0];
	var point2 = point.p[1];
	
	var p1 = { id : point1.userData.id, pos : point1.position.clone() };
	var p2 = { id : point2.userData.id, pos : point2.position.clone() };	

	var dir1 = new THREE.Vector3().subVectors( point.position, point1.position ).normalize();
	var dir2 = new THREE.Vector3().subVectors( point2.position, point.position ).normalize();
	
	var d1 = wall_1.userData.wall.p[0].position.distanceTo( wall_1.userData.wall.p[1].position );
	var d2 = wall_2.userData.wall.p[0].position.distanceTo( wall_2.userData.wall.p[1].position );
	
	var wall = (d1 > d2) ? wall_1 : wall_2;	
	var res = (d1 > d2) ? 1 : 2;
	
	
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;
	var userData_material = wall.userData.material;
	
	
	if(res == 1)
	{
		if(point.start[0] != 1)		
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}
	if(res == 2)
	{
		if(point.start[1] != 0)
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}	
	
	
	var arrO = [];
	for ( var i = 0; i < wall_1.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_1.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}

	for ( var i = 0; i < wall_2.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_2.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = fname_s_0162( wall_1 );   	
	var oldZ = fname_s_0143( oldZones );
	fname_s_0156( oldZones );						

	
	fname_s_0132( wall_1 );		
	fname_s_0132( wall_2 );		
	 

	
	var point1 = fname_s_0227( 'point', p1.id );
	var point2 = fname_s_0227( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0213( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0213( p2.pos, p2.id ); }	
	
	var wall = fname_s_0214({ p: [point1, point2], width: width, offsetZ : offsetZ, height : height }); 

	fname_s_0104(point1);
	fname_s_0104(point2);
	
	var arrW = [];
	for ( var i = 0; i < arrW_2.length; i++ ) { arrW[arrW.length] = arrW_2[i]; }
	arrW[arrW.length] = wall;
	
	fname_s_07( arrW );	
	
	var newZones = fname_s_0145();		
	fname_s_0158(oldZ, newZones, 'delete');		
	
	
	
	if(fname_s_034(dir1, dir2)) 
	{
		for ( var i = 0; i < arrO.length; i++ ) { arrO[i].wall = wall; } 
	}
	
	
	wall.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall.userData.material = userData_material; 
	
	fname_s_05( arrW );
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false; 
	
	return { point : { id : point.userData.id }, wall : wall }; 
} 




function fname_s_0135( obj )
{	
	var wall = obj.userData.door.wall; 		
	
	fname_s_01( obj );		
		
	fname_s_0136({arr : wall.userData.wall.arrO, o : obj});	
	
	if(obj.userData.tag == 'window') { fname_s_061(obj); }
	if(obj.userData.tag == 'door') { fname_s_061(obj); }
	
	clickO = resetPop.clickO();
	fname_s_0125( obj ); 

	if(camera == camera3D)
	{
		wall.label[0].visible = false; 
		
	}
	
	
	if(obj.userData.tag == 'window') { fname_s_0136({arr : infProject.scene.array.window, o : obj}); }
	if(obj.userData.tag == 'door') { fname_s_0136({arr : infProject.scene.array.door, o : obj}); }
	
	scene.remove( obj );	
}







function fname_s_0136(cdm)
{
	var arr = cdm.arr;
	var o = cdm.o;
	
	for(var i = arr.length - 1; i > -1; i--) { if(arr[i] == o) { arr.splice(i, 1); break; } }
}



function fname_s_0137(point, wall)
{
	var n = -1;
	for ( var i = 0; i < point.w.length; i++ ){ if(point.w[i].userData.id == wall.userData.id) { n = i; break; } }
	
	point.p.splice(n, 1);
	point.w.splice(n, 1);
	point.start.splice(n, 1);	
}





function fname_s_0138(point)
{
	var n = -1;
	for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == point.userData.id) { n = i; break; } }
		
	obj_point.splice(n, 1);	
}







function fname_s_0139(cdm)
{	
	var arrP = cdm.point;
	var arrW = cdm.wall;
	var arrS = cdm.side;
	var id = (cdm.id) ? cdm.id : null;
	var material = (cdm.material) ? cdm.material : null;
	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}
	
	
		 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	
	var color = 0xe3e3e5;
	
	if(infProject.settings.floor.color){ color = infProject.settings.floor.color; }
	
	var material =new THREE.MeshPhongMaterial( { color : color, lightMap : lightMap_1, dithering: true } );
	
	var floor = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ), material ); 
	room[n] = floor;
	
	floor.position.set( 0, infProject.settings.floor.posY, 0 );
	floor.rotation.set( Math.PI / 2, 0, 0 );	
	floor.p = arrP;
	floor.w = arrW; 
	floor.s = arrS;	
	
	
	if(!id) { id = countId; countId++; }  
	 
	floor.userData.tag = 'room';
	floor.userData.id = id;
	floor.userData.room = { areaTxt : 0, p : floor.p, w : floor.w, s : floor.s, outline : null };
	floor.userData.room.height = infProject.settings.floor.height;
	floor.userData.material = { tag: 'room', color: floor.material.color, img: null };	
	
	var ceil = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color : 0xffffff, lightMap : lightMap_1, dithering: true } ) );
	ceiling[n] = ceil;
	
	ceil.position.set( 0, arrP[0].position.y + infProject.settings.height, 0 );  
	ceil.rotation.set( Math.PI / 2, 0, 0 );		
	ceil.userData.tag = 'ceiling';
	ceil.userData.id = id;
	ceil.userData.material = { tag: 'ceiling', color: ceil.material.color, img: null };

	
	
	if(infProject.settings.floor.material)
	{	
		fname_s_0216({obj: floor, material: infProject.settings.floor.material});	
	}
	
	if(infProject.settings.floor.o)
	{ 	
		floor.label = fname_s_0171({ count : 1, text : 0, size : 65, ratio : {x:256*4, y:256}, geometry : infProject.geometry.labelFloor, opacity : 0.5 })[0];
		
		if(!infProject.settings.floor.label) floor.label.visible = false; 
			
		fname_s_09([floor]); 
		scene.add(floor); 
		scene.add(ceil);		
	}
	else
	{
		fname_s_07(arrW); 
	}

	
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		var ind = (arrS[i] == 0) ? 2 : 1; 
		arrW[i].userData.wall.room.side2[ind] = floor; 
	}	
	
	fname_s_0140(arrP, floor);
	
	floor.castShadow = true; 
	floor.receiveShadow = true;
	ceil.castShadow = true; 
	ceil.receiveShadow = true;	
	
	return floor;
}






function fname_s_0140(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}




function fname_s_0141(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}





function fname_s_0142(arrRoom)
{  
	if(!infProject.settings.floor.o) { return; }
	
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{	 
		var point = [];
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { point[i2] = new THREE.Vector2 ( arrRoom[i].p[i2].position.x, arrRoom[i].p[i2].position.z ); }				
		
		var shape = new THREE.Shape( point );				

		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ); 
		
		arrRoom[i].geometry.vertices = geometry.vertices;
		arrRoom[i].geometry.faces = geometry.faces;		
		arrRoom[i].geometry.verticesNeedUpdate = true;
		arrRoom[i].geometry.elementsNeedUpdate = true;
		
		arrRoom[i].geometry.computeBoundingSphere();
		arrRoom[i].geometry.computeBoundingBox();
		arrRoom[i].geometry.computeFaceNormals();
		
		arrRoom[i].position.y = infProject.settings.floor.posY;
		fname_s_0220( arrRoom[i] );
		fname_s_09([arrRoom[i]]); 

		
		var num = 0;		
		for ( var i2 = 0; i2 < room.length; i2++ ) { if(room[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	
		
		var geometry = new THREE.ShapeGeometry( shape );
		ceiling[num].geometry.vertices = geometry.vertices;
		ceiling[num].geometry.faces = geometry.faces;			
		ceiling[num].geometry.verticesNeedUpdate = true;
		ceiling[num].geometry.elementsNeedUpdate = true;
		
		ceiling[num].geometry.computeBoundingSphere();
		ceiling[num].geometry.computeBoundingBox();
		ceiling[num].geometry.computeFaceNormals();		
	}
	
	
}




function fname_s_0143(arr) 
{
	var arrN = [];
	if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
		}		
	}	
	
	return arrN;
}




function fname_s_0144(cdm) 
{
	var result = null;
	var obj = cdm.obj;
	
	if(obj.userData.tag == 'room')
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == obj) { result = { floor: room[i2], ceiling: ceiling[i2] }; break; }
		}		
	}
	else if(obj.userData.tag == 'ceiling')
	{
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(ceiling[i2] == obj) { result = { floor: room[i2], ceiling: ceiling[i2] }; break; }
		}			
	}
	else 
	{
		return;
	}	
	
	return result;
}









function fname_s_0145()
{		
	var arrRoom = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{			
		if(obj_point[i].p.length < 2){ continue; }

		for ( var i2 = 0; i2 < obj_point[i].p.length; i2++ )
		{
			if(obj_point[i].p[i2].p.length < 2){ continue; }									
			
			

			var p = fname_s_0149([obj_point[i]], obj_point[i].p[i2]); 		
			 
			
			if(p[0] != p[p.length - 1]){ continue; }	
			if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }
			if(fname_s_010(p) <= 0){ continue; }		
			if(fname_s_0146( obj_point[i].zone, p )){ continue; }
								
			 
			var arr = fname_s_0150(p);						
			
			arrRoom[arrRoom.length] = fname_s_0139({point : p, wall : arr[0], side : arr[1]});			
			break; 
		}
	}

	return arrRoom;
}







function fname_s_0146( arrRoom, arrP )
{
	var flag = false;
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		var ln = 0;
		
		if(arrRoom[i].p.length != arrP.length) { continue; }
			
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length - 1; i3++ )
			{
				if(arrRoom[i].p[i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrP.length - 1) 
		{ 
			
			
			
			flag = true; 
			break; 
		}
	}
	
	return flag;
}





function fname_s_0147( arrRoom, arrP )
{
	var flag = false;
	var ln = 0;
	
	if(arrRoom.p.length - 1 != arrP.length) { return flag; }
		
	for ( var i2 = 0; i2 < arrRoom.p.length - 1; i2++ )
	{
		for ( var i3 = 0; i3 < arrP.length; i3++ )
		{
			if(arrRoom.p[i2].userData.id == arrP[i3]) { ln++; }
		}
	}
	
	if(arrRoom.p.length - 1 == ln) 
	{ 
		
		
		
		flag = true; 
	}
	
	return flag;
}
 


function fname_s_0148(p1, p2)
{
	for ( var i = 0; i < p1.zone.length; i++ )
	{
		for ( var i2 = 0; i2 < p2.zone.length; i2++ )
		{
			if(p1.zone[i] == p2.zone[i2]) 
			{ 
				if(p1 == p2.zoneP[i2]){ return true; } 
				if(p1.zoneP[i] == p2){ return true; }
			}
		}
	}
	
	return false;	
}






function fname_s_0149(arr, point)
{
	var p2 = arr[arr.length - 1];
	arr[arr.length] = point;
	
	
	var dir1 = new THREE.Vector3().subVectors( point.position, p2.position ).normalize();	
	
	var arrD = [];
	var n = 0;
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.p[i] == p2){ continue; }		
		if(point.p[i].p.length < 2){ continue; }
		
		var dir2 = new THREE.Vector3().subVectors( point.p[i].position, point.position ).normalize();
		
		arrD[n] = [];
		arrD[n][1] = point.p[i];
		
		var d = (point.p[i].position.x - p2.position.x) * (point.position.z - p2.position.z) - (point.p[i].position.z - p2.position.z) * (point.position.x - p2.position.x);
		
		var angle = dir1.angleTo( dir2 );
		
		if(d > 0){ angle *= -1; }
		
		arrD[n][0] = angle;
		if(!fname_s_019(angle)) { return arr; }
		
		
		n++;
	}	
	
	
	if(arrD.length > 0)
	{ 
		arrD.sort(function (a, b) { return a[0] - b[0]; });
		
		for ( var i = 0; i < arrD.length; i++ )
		{			
			if(arr[0] != arrD[i][1]) { return fname_s_0149(arr, arrD[i][1]); }
			else { arr[arr.length] = arrD[i][1]; break; }						
		}
	}
	
	return arr;
}




 

function fname_s_0150(p)
{
	var w = [];  
	var s = [];
	
	for ( var i = 0; i < p.length - 1; i++ )
	{ 		
		for ( var y1 = 0; y1 < p[i].w.length; y1++ )
		{
			for ( var y2 = 0; y2 < p[i + 1].w.length; y2++ )
			{
				if(p[i].w[y1] == p[i + 1].w[y2])
				{
					w[i] = p[i].w[y1];
					s[i] = p[i].start[y1];
					continue;
				}
			}
		}
	}	
	
	return [w, s];			
}









function fname_s_0151( point, obj, arrRoom, num, cdm )
{
	fname_s_0157(arrRoom);		
	fname_s_0152(cdm, arrRoom, num, point); 				
	
	for ( var i = 0; i < arrRoom.length; i++ ) { fname_s_0153(arrRoom[i], num[i], point, cdm); }	
	
	if(obj.userData.tag == 'wall'){ var arr = fname_s_0101(obj); }
	else if(obj.userData.tag == 'point'){ var arr = fname_s_0100([], obj); }

	fname_s_07(arr);				
	fname_s_0142(arrRoom);		
}

 



function fname_s_0152(cdm, arrRoom, numS, point)
{
	var zone = arrRoom;
	var num = numS;
	
	if(cdm.name == 'join')
	{
		zone = cdm.zone;
		num = cdm.num; 
		cdm = 'del';
	}
	
	for ( var i = 0; i < zone.length; i++ )
	{
		if(cdm == 'add') 			
		{ 
			zone[i].p.splice(num[i], 0, point); 
		}		
		else if(cdm == 'del') 		
		{ 				
			if(num[i] == 0 || num[i] == zone[i].p.length - 1)	
			{
				zone[i].p.splice(0, 1);	
				zone[i].p.splice(zone[i].p.length - 1, 1);			
				zone[i].p[zone[i].p.length] = zone[i].p[0];
			}
			else { zone[i].p.splice(num[i], 1); }		
		}		
	}
}






function fname_s_0153(zoneIndex, num, point, cdm)
{		
	var arr = fname_s_0150(zoneIndex.p);	
	
	fname_s_0140(zoneIndex.p, zoneIndex);	
				
	zoneIndex.w = arr[0]; 		
	zoneIndex.s = arr[1];	
}





function fname_s_0154(point1, point2)
{
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { return true; }
	}
	
	return false;
}


function fname_s_0155(point1, point2) 
{
	var arr = [];
	
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { arr[arr.length] = point2.zone[i]; }
	}
	
	return arr;
}

 

function fname_s_0156(arrRoom)
{
	var roomType = [];
	var arrN = [];
	
	
	
	for(var i = 0; i < arrRoom.length; i++)
	{
		for(var i2 = 0; i2 < arrRoom[i].userData.room.w.length; i2++)
		{
			var wall = arrRoom[i].userData.room.w[i2];
			
			if(wall.userData.wall.room.side2[1] == arrRoom[i]){ wall.userData.wall.room.side2[1] = null; }
			else if(wall.userData.wall.room.side2[2] == arrRoom[i]){ wall.userData.wall.room.side2[2] = null; }
		}
	}
	
	
	
	for ( var i = 0; i < room.length; i++ ) 
	{
		for ( var i2 = 0; i2 < arrRoom.length; i2++ ) 
		{ 
			if(room[i] == arrRoom[i2])
			{  				 
				arrN[arrN.length] = i; break;
			}
		}
	}

	fname_s_0157(arrRoom);
	
	for ( var i = arrN.length - 1; i >= 0; i-- )
	{
		roomType[roomType.length] = 
		{ 
			nameTxt : room[arrN[i]].userData.room.roomType,  
			material : room[arrN[i]].material, 
			userData : room[arrN[i]].userData, 
			area : Number(room[arrN[i]].userData.room.areaTxt), 
		}; 
		
		var floor = room[arrN[i]];    			
		room.splice(arrN[i], 1); 
		
		var ceil = ceiling[arrN[i]];
		ceiling.splice(arrN[i], 1);	
		
		scene.remove( floor.label );
		scene.remove( floor );
		scene.remove( ceil );		
	}
	
	return roomType;
}




function fname_s_0157(arrRoom)
{
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		for ( var i2 = 0; i2 < arrRoom[i].p.length; i2++ )
		{
			for ( var i3 = 0; i3 < arrRoom[i].p[i2].zone.length; i3++ )
			{
				if(arrRoom[i].p[i2].zone[i3] == arrRoom[i])
				{ 
					arrRoom[i].p[i2].zone.splice(i3, 1);
					arrRoom[i].p[i2].zoneP.splice(i3, 1); 
					break;
				}							
			}
		}
	}
}





function fname_s_0158( oldZ, newZones, cdm ) 
{
	
	for ( var i = 0; i < newZones.length; i++ ) 
	{
		for ( var i2 = 0; i2 < oldZ.length; i2++ ) 
		{ 			
			var oldZones = oldZ[i2].floor; 
			var count = 0;
			
			for ( var i3 = 0; i3 < newZones[i].p.length - 1; i3++ )
			{
				for ( var i4 = 0; i4 < oldZones.p.length - 1; i4++ )
				{
					if(newZones[i].p[i3].userData.id == oldZones.p[i4].userData.id) { count++; break; };
				}				
			}

			
			if(cdm == 'add') { var countNew = newZones[i].p.length - 2; }
			else if(cdm == 'delete') { var countNew = newZones[i].p.length - 1; }
			else if(cdm == 'copy') { var countNew = newZones[i].p.length - 1; }
			
			if(countNew == count)
			{
				fname_s_0160([newZones[i]], oldZ[i2], false);				
				break;
			}			
		}
	}

}






function fname_s_0159(wall) 
{
	var oldZone = fname_s_035( wall ).obj;
	var oldZ = fname_s_0143(oldZone);
	
	if(oldZone) { fname_s_0156( [oldZone] ); }			
		
	var newZones = fname_s_0145();			
	 
	if(oldZone) { fname_s_0160(newZones, oldZ[0], true); } 
}



function fname_s_0160(newZones, oldZ, addId)
{
	var newZ = fname_s_0143(newZones);
	
	for ( var i = 0; i < newZ.length; i++ )
	{	 
		var floor = newZ[i].floor;		
		var ceiling = newZ[i].ceiling;
		
		floor.userData.id = oldZ.floor.userData.id;	
		floor.userData.material = Object.assign({}, oldZ.floor.userData.material);		
		floor.material = oldZ.floor.material.clone();
		

		ceiling.userData.id = oldZ.ceiling.userData.id;	
		ceiling.userData.material = Object.assign({}, oldZ.ceiling.userData.material);
		ceiling.material = oldZ.ceiling.material.clone();
		
		if(addId) 
		{ 
			floor.userData.id = countId; countId++; 
			ceiling.userData.id = countId; countId++;
		}  
		fname_s_09( [floor] );
	}
}




function fname_s_0161( wall )
{	
	var arrRoom = fname_s_0162( wall );

	
	
	
	
	var num = [];
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{
		for ( var i2 = 0; i2 < arrRoom[i].p.length; i2++ ) 
		{ 			
			if(arrRoom[i].p[i2] == wall.userData.wall.p[0])  
			{ 
				if(arrRoom[i].p[i2 + 1] == wall.userData.wall.p[1]) { num[i] = i2 + 1; break; } 		
			}
			if(arrRoom[i].p[i2] == wall.userData.wall.p[1]) 
			{ 
				if(arrRoom[i].p[i2 + 1] == wall.userData.wall.p[0]) { num[i] = i2 + 1; break; }					
			}			
		}
	}

	return [arrRoom, num];
} 




function fname_s_0162( wall )
{
	var arrRoom = [];	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) 
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[1].zone.length; i2++ )
		{
			if(wall.userData.wall.p[0].zone[i] == wall.userData.wall.p[1].zone[i2])
			{
				arrRoom[arrRoom.length] = wall.userData.wall.p[0].zone[i]; 
			}
		}
	}

	return arrRoom;
}







function fname_s_0163( arrRoom )
{	
	if(arrRoom.length != 2) { return []; } 
	
	
	
	
	
	var arr_1 = [];
	
	for ( var i = 0; i < arrRoom[0].p.length - 1; i++ )	
	{
		var flag = true;
		
		for ( var i2 = 0; i2 < arrRoom[1].p.length - 1; i2++ )
		{
			if(arrRoom[0].p[i] == arrRoom[1].p[i2]) { flag = false; break; }
		}
		
		if(flag)
		{
			arr_1[arr_1.length] = arrRoom[0].p[i];
		}
	}
	
	
	
	var arr_2 = [];
	
	for ( var i = 0; i < arrRoom[1].p.length - 1; i++ )	
	{
		var flag = true;
		
		for ( var i2 = 0; i2 < arrRoom[0].p.length - 1; i2++ )
		{
			if(arrRoom[1].p[i] == arrRoom[0].p[i2]) { flag = false; break; }
		}
		
		if(flag)
		{
			arr_2[arr_2.length] = arrRoom[1].p[i];
		}
	}	
	
	
	
	
	var arr_3 = [];
	
	if(arr_1.length > 0)
	{
		var n1 = -1;
		var n2 = -1;
		for ( var i = 0; i < arrRoom[0].p.length; i++ ) { if(arrRoom[0].p[i] == arr_1[0]) { n1 = i; break; } }
		for ( var i = 0; i < arrRoom[0].p.length; i++ ) { if(arrRoom[0].p[i] == arr_1[arr_1.length - 1]) { n2 = i; break; } }
		
		if(n1 != -1) arr_3[0] = arrRoom[0].p[n1 - 1];
		if(n2 != -1) arr_3[1] = arrRoom[0].p[n2 + 1];		
	}
	else if(arr_2.length > 0)
	{
		var n1 = -1;
		var n2 = -1;
		for ( var i = 0; i < arrRoom[1].p.length; i++ ) { if(arrRoom[1].p[i] == arr_2[0]) { n1 = i; break; } }
		for ( var i = 0; i < arrRoom[1].p.length; i++ ) { if(arrRoom[1].p[i] == arr_2[arr_2.length - 1]) { n2 = i; break; } }
		
		if(n1 != -1) arr_3[0] = arrRoom[1].p[n1 - 1];
		if(n2 != -1) arr_3[1] = arrRoom[1].p[n2 + 1];		
	}
	
	
	arr_1[arr_1.length] = arr_3[0];
	arr_1[arr_1.length] = arr_3[1];
	
	
	
	for ( var i = 0; i < arr_2.length; i++ ) { arr_1[arr_1.length] = arr_2[i]; }
	
	
	
	return arr_1;
}





function fname_s_0164( arrRoom, arrP, arrRoom_2 )
{
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		if(arrRoom[i].p.length - 1 != arrP.length) { continue; }
		
		var ln = 0;
		
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length; i3++ )
			{
				if(arrRoom[i].p[i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrRoom[i].p.length - 1) 
		{ 
			arrRoom_2[0].userData.room.roomType = arrRoom[i].userData.room.roomType; 
			arrRoom_2[1].userData.room.roomType = arrRoom[i].userData.room.roomType;
			
			fname_s_0173(arrRoom_2[0].label, arrRoom_2[0].userData.room.areaTxt + ' м2', '85', 'rgba(255,255,255,1)', false);
			fname_s_0173(arrRoom_2[1].label, arrRoom_2[1].userData.room.areaTxt + ' м2', '85', 'rgba(255,255,255,1)', false);
			
			fname_s_0156([arrRoom[i]]);  
			break; 
		}
	}
}











function fname_s_0165(cdm)
{
	var wall = infProject.scene.array.wall[0];
	
	
	
	 
	cdm.wall = wall;
	cdm.type = 'wallRedBlue';
	cdm.side = 'wall_length_1';
	
	var x = $('[nameId="size-wall-length"]').val();
	var y = $('[nameId="size-wall-height"]').val();
	var z = $('[nameId="size-wall-width"]').val();
	
	
	if(1==1)
	{
		var v = wall.userData.wall.v;
		
		if(x == undefined) { x = '' + (v[6].x - v[0].x); }
		if(y == undefined) { y = '' + (v[1].y - v[0].y); }		
		if(z == undefined) { z = '' + (Math.abs(v[4].z) + Math.abs(v[0].z)); }		
		
		x = x.replace(",", ".");
		y = y.replace(",", ".");
		z = z.replace(",", ".");
		
		var x2 = v[6].x - v[0].x;
		var y2 = v[1].y - v[0].y;		
		var z2 = Math.abs(v[4].z) + Math.abs(v[0].z);
		
		x = (fname_s_019(x)) ? x : x2;
		y = (fname_s_019(y)) ? y : y2;
		z = (fname_s_019(z)) ? z : z2;  
	}
	
	
	
	if(1==1)
	{
		if(x > 30) { x = 30; }
		else if(x < 0.5) { x = 0.5; }

		if(y > 10) { y = 10; }
		else if(y < 0.1) { y = 0.1; }	
		
		if(z > 10) { z = 10; }
		else if(z < 0.02) { z = 0.02; }		
	}	
	
	cdm.length = x;
	cdm.height = y;
	cdm.width = z;	
	
	
	fname_s_0166(cdm);	
	
	fname_s_0195();
}



function fname_s_0166(cdm)
{
	var wall = cdm.wall;
	var value = cdm.length;
	
	var wallR = fname_s_0101(wall);
	fname_s_04(wallR);

	var p1 = wall.userData.wall.p[1];
	var p0 = wall.userData.wall.p[0];

	var walls = [...new Set([...p0.w, ...p1.w])];	
	
	
	
	if(cdm.height)
	{
		var h2 = Number(cdm.height);
		
		var v = wall.geometry.vertices;	
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;

		wall.userData.wall.height_1 = Math.round(h2 * 100) / 100;
	}
 
	
	if(cdm.width)
	{
		var z = cdm.width/2;
		
		var v = wall.geometry.vertices;	
		v[0].z = v[1].z = v[6].z = v[7].z = z;
		v[4].z = v[5].z = v[10].z = v[11].z = -z;	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;
		
		
		
		for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
		{ 
			var wd = wall.userData.wall.arrO[i];	
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
			var v2 = wall.geometry.vertices;
			
			for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
			for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

			wd.geometry.verticesNeedUpdate = true; 
			wd.geometry.elementsNeedUpdate = true;
			wd.geometry.computeBoundingSphere();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeFaceNormals();		
		}

		wall.userData.wall.width = Math.round(cdm.width * 100) / 100;;
	}
 
	
	var ns = 0;
	var flag = true;
	while ( flag )
	{	 
		var v = wall.userData.wall.v;

		var d = 0;
		
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x );  } 
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x );  }
		
		
		var sub = (value - d) / 1;
		if(cdm.type == 'wallRedBlue') { sub /= 2; }	
		
		var dir = new THREE.Vector3().subVectors(p1.position, p0.position).normalize();
		var dir = new THREE.Vector3().addScaledVector( dir, sub );	

		if(cdm.type == 'wallBlueDot')
		{ 
			var offset = new THREE.Vector3().addVectors( p1.position, dir ); 
			p1.position.copy( offset ); 
		}
		else if(cdm.type == 'wallRedDot')
		{ 
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset ); 
			wall.position.copy( offset );
		}
		else if(cdm.type == 'wallRedBlue')
		{ 			
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset );
			wall.position.copy( offset );
			
			p1.position.copy( new THREE.Vector3().addVectors( p1.position, dir ) );				
		}

		
		for ( var i = 0; i < walls.length; i++ )
		{
			fname_s_0167(walls[i]);
		}			 		 
		
		fname_s_0103(p0);
		fname_s_0103(p1);
		fname_s_07( [wall] );
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); }
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); }
		

		if(value - d == 0){ flag = false; }
		
		if(ns > 5){ flag = false; }
		ns++;
	} 	
	 
	fname_s_07( wallR );		
	fname_s_0142( fname_s_0112(wall) );  				 			
	
	fname_s_0283({obj: wall});

	fname_s_05(wallR);
}

	




function fname_s_0167(wall, cdm) 
{
	
	var v = wall.geometry.vertices;
	var p = wall.userData.wall.p;
	
	
	var f1 = false;	
	var f2 = false;	
	
	f1 = !fname_s_034(p[0].userData.point.last.pos, p[0].position); 	
	f2 = !fname_s_034(p[1].userData.point.last.pos, p[1].position); 	
	
	
	if(f1 && f2)
	{
		var offset_1 = new THREE.Vector3().subVectors(p[0].position, p[0].userData.point.last.pos);
		var offset_2 = new THREE.Vector3().subVectors(p[1].position, p[1].userData.point.last.pos);
		
		var equal = fname_s_034(offset_1, offset_2);
		
		
		if(equal)
		{
			var offset = new THREE.Vector3().subVectors(p[0].position, wall.position);
			
			wall.position.copy(p[0].position);
						
			for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
			{
				wall.userData.wall.arrO[i].position.add(offset);
			}
			
			return;
		}
	}	
	
	
	var dist = p[0].position.distanceTo(p[1].position);
	
	v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = 0;
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = dist;
 
	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	wall.geometry.computeBoundingBox();	
	wall.geometry.computeBoundingSphere();	
	wall.geometry.computeFaceNormals();	

	var dir = new THREE.Vector3().subVectors(p[0].position, p[1].position).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);

	wall.position.copy( p[0].position );


	
	
	if(cdm)
	{
		if(cdm.point)	
		{
			if(cdm.point == p[0]) { f1 = true; }
			if(cdm.point == p[1]) { f2 = true; }
		}
	}
	
	
	if(f2){ var dir = new THREE.Vector3().subVectors( p[0].position, p[1].position ).normalize(); }
	else { var dir = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize(); }
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var wd = wall.userData.wall.arrO[i];	

		if(f2)
		{
			var startPos = new THREE.Vector3(p[0].position.x, 0, p[0].position.z);
			var p1 = p[0].position;			
		}
		else
		{
			var startPos = new THREE.Vector3(p[1].position.x, 0, p[1].position.z);
			var p1 = p[1].position;
		}
		
		var dist = startPos.distanceTo(new THREE.Vector3(wd.position.x, 0, wd.position.z));
		
		
		var pos = new THREE.Vector3().addScaledVector( dir, -dist );
		pos = new THREE.Vector3().addVectors( p1, pos );
		
		wd.position.x = pos.x;
		wd.position.z = pos.z;
		wd.rotation.copy( wall.rotation );
	}			
}






function fname_s_0168(cdm) 
{
	var wall = cdm.wall;
	
	var width = cdm.width.value;
	var offset = cdm.offset;
	
	if(!wall){ return; } 
	if(wall.userData.tag != 'wall'){ return; } 
	
	var width = fname_s_0231({ value: width, unit: 1, limit: {min: 0.01, max: 1} });
	
	if(!width) 
	{
		$('[nameid="size_wall_width_1"]').val(wall.userData.wall.width);
		
		return;
	}		

	var width = width.num; 
	
	var wallR = fname_s_0101(wall);
	
	fname_s_04(wallR);
			
	var v = wall.geometry.vertices;
	
	var z = [0,0];
	
	if(offset == 'wallRedBlueArrow')
	{ 	
		width = (width < 0.01) ? 0.01 : width;
		width /= 2;		
		z = [width, -width];		
		var value = Math.round(width * 2 * 1000);
	}
	else if(offset == 'wallBlueArrow')
	{ 
		width = (Math.abs(Math.abs(v[4].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[4].z) : width;   		
		z = [width, v[4].z];
		var value = width * 1000;
	}
	else if(offset == 'wallRedArrow')
	{		 
		width = (Math.abs(Math.abs(v[0].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[0].z) : width;    		
		z = [v[0].z, -width];
		var value = width * 1000;
	}

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = (v[0].z + v[4].z)/2;	 

	
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	fname_s_0104(p0);	
    fname_s_0104(p1);	
	
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		var v2 = wall.geometry.vertices;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals();		
	}	
	
	fname_s_07( wallR );	 				
	fname_s_09( fname_s_0112(wall) );
	
	fname_s_05(wallR);
	
	$('[nameId="size_wall_width_1"]').val(wall.userData.wall.width);
	
	fname_s_0195();
}







function fname_s_0169(cdm)
{  	
	var height = fname_s_0231({ value: cdm.height, unit: 1, limit: {min: 0.1, max: 5} });
	
	if(!height) 
	{
		return;
	}		
	
	if(cdm.load)
	{
		
	}
	else
	{	
		fname_s_04( infProject.scene.array.wall );
		
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{
			var v = infProject.scene.array.wall[i].geometry.vertices;
			
			v[1].y = height.num;
			v[3].y = height.num;
			v[5].y = height.num;
			v[7].y = height.num;
			v[9].y = height.num;
			v[11].y = height.num;
			infProject.scene.array.wall[i].geometry.verticesNeedUpdate = true;
			infProject.scene.array.wall[i].geometry.elementsNeedUpdate = true;
			
			infProject.scene.array.wall[i].userData.wall.height_1 = height.num;
		}
		
		fname_s_07( infProject.scene.array.wall );
		fname_s_05( infProject.scene.array.wall );			
	}
	
	if(cdm.input)
	{  
		$('[nameId="rp_floor_height"]').val(height.num);
	}
	
	if(cdm.globalHeight)
	{
		infProject.settings.height = height.num;  
	}		
	
	fname_s_0195();
}
	
	








function fname_s_0170(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	var material = new THREE.LineBasicMaterial( mat );
	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( fname_s_0205(1, 0.025, 0.025), material );
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






function fname_s_0171(cdm) 
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






function fname_s_0172(cdm)  
{		
	
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







function fname_s_0173(label, area, text2, size, color, border) 
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











function fname_s_0174(arr, obj, wall, z)
{
	var hitL = null;
	var hitR = null;
	
	var xL = -999999;
	var xR = 999999;
	
	var posL = false;
	var posR = false;
	
	
	wall.updateMatrixWorld();
	var pos = wall.worldToLocal( obj.position.clone() );
	
	for ( var i = 0; i < arr.length; i++ )
	{ 
		var v = wall.worldToLocal( arr[i].position.clone() );

		if (v.x < pos.x){ if(xL <= v.x) { hitL = arr[i]; xL = v.x; } } 
		else { if(xR >= v.x) { hitR = arr[i]; xR = v.x; } }	
	}

	
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

















function fname_s_0175( event )
{
	if (camera != cameraTop) { return; }
	if (isMouseDown1) { return; }
	if (infProject.scene.substrate.active) return;

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }	
	}
	
	var rayhit = null;
		
	var ray = fname_s_0215( event, infProject.tools.controllWD, 'arr' );
	if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }			

	if(!infProject.scene.block.hover.door)
	{
		var ray = fname_s_0215( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.hover.window)
	{
		var ray = fname_s_0215( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.hover.point)
	{
		var ray = fname_s_0215( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.hover.wall)
	{
		var ray = fname_s_0215( event, infProject.scene.array.wall, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}	
	

	if ( rayhit ) 
	{
		
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		if ( clickO.last_obj == object ) { fname_s_0176(); return; }	
		if ( clickO.hover == object ) { return; }				

		if ( tag == 'window' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'door' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'point' ) { object.material.color = new THREE.Color(infProject.listColor.hover2D); }
		else if ( tag == 'wall' ) { object.material[ 3 ].color = new THREE.Color(infProject.listColor.hover2D); }		
		else if ( tag == 'controll_wd' ) { if(clickO.last_obj == object.obj) { fname_s_0176(); return; } }
		
		fname_s_0176();

		clickO.hover = object;
	}
	else
	{
		fname_s_0176();
	}
}




function fname_s_0176()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if ( tag == 'window' ) { object.material.color = object.userData.door.color; } 
	else if ( tag == 'door' ) { object.material.color = object.userData.door.color; }	
	else if ( tag == 'wall' ) { object.material[ 3 ].color = object.userData.material[ 3 ].color; }
	else if ( tag == 'point' ) { object.material.color = object.userData.point.color; }
	
	clickO.hover = null;
}





function fname_s_0177(obj)
{ 
	if(camera != cameraTop) return;
	if(!obj) { return; }   
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'window'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }
	else if(tag == 'point'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }	 
	else if(tag == 'wall'){ obj.material[3].color = new THREE.Color(infProject.listColor.active2D); } 	
	else if(tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); }	
	
	if(clickO.hover == obj) { clickO.hover = null; }
}
 

	
 

function fname_s_0178() 
{	
	if(camera != cameraTop) return;
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.rayhit)
	{    
		if(clickO.rayhit.object.userData.tag == 'controll_wd'){ if(clickO.rayhit.object.userData.controll_wd.obj == o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ o.material[3].color = o.userData.material[3].color; fname_s_08({wall: o}); }	
	else if(o.userData.tag == 'point'){ o.material.color = o.userData.point.color; }	
	else if(o.userData.tag == 'window'){ o.material.color = new THREE.Color(infProject.listColor.window2D); }
	else if(o.userData.tag == 'door'){ o.material.color = new THREE.Color(infProject.listColor.door2D); }	
	else if(o.userData.tag == 'room'){ scene.remove(o.userData.room.outline); o.userData.room.outline = null; } 
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
} 






function fname_s_0179( intersect )
{
	
	if(!intersect) return;
	if(!intersect.face) return;
	var index = intersect.face.materialIndex;	
	
	if(index == 1 || index == 2) { } 
	else { return; }
	
	var object = intersect.object;	
	
	clickO.obj = object;
	clickO.index = index;  	
}









function fname_s_0180(href) 
{
	var url = new URL(href); 
	var url = url.searchParams.get('file');  
	if(url) { fname_s_0188(url); }
}



var resetPop =
{
	camera3D : 
	{
		userData : function()
		{
			var camera = { type : 'fly', height : camera3D.position.y, startProject : true, rot360 : { start : false, angle : 0, qEnd : null } };
			camera.click = { pos : new THREE.Vector3() };
			
			return camera;			
		}
	},

	fileInfo : function()
	{
		return { last : {cam : { obj : camera, type : '', pos : new THREE.Vector3(), rot : new THREE.Vector3() }} };
	},
	
	infProjectSceneArray : function()
	{
		var array = { point : obj_point, wall : [], window : [], door : [], floor : room, ceiling : ceiling, obj : [] };
		array.lineGrid = { limit : false };
		array.base = (infProject.start)? infProject.scene.array.base : [];	
		
		return array;
	},

	listColor : function()
	{	
		var array = {};
		
		array.door2D = 'rgb(224, 224, 224)';
		array.window2D = 'rgb(224, 224, 224)';
		array.active2D = 'rgb(255, 162, 23)';
		array.hover2D = 'rgb(69, 165, 58)';

		return array;
	},
	
	clickO : function()
	{
		var inf = { obj: null, last_obj: null, hover: null, rayhit : null, button : null, buttonAct : null };
		inf.down = null;
		inf.move = null;
		inf.up = null;
		inf.offset = new THREE.Vector3();
		inf.actMove = false;
		inf.pos = { clickDown : new THREE.Vector3() };
		inf.click = { wall : [], point : [], side_wall: 0 };
		inf.selectBox = { arr : [], drag : false, move : false, walls : [], walls_2 : [], point : [] };
		inf.keys = [];
		inf.options = null;
		
		return inf;
	},
	
	active : function()
	{
		return { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true, unlock : true };
	},	
}



function fname_s_0181() 
{	
	fname_s_061(clickO.last_obj);
	
	
	var wall = infProject.scene.array.wall;
	var point = infProject.scene.array.point;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	var obj = infProject.scene.array.obj;
	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		fname_s_0184(wall[i]);
		fname_s_0184(wall[i].label[0]);
		fname_s_0184(wall[i].label[1]);
		
		scene.remove(wall[i].label[0]); 
		scene.remove(wall[i].label[1]);
		if(wall[i].userData.wall.outline) { scene.remove(wall[i].userData.wall.outline); }
		if(wall[i].userData.wall.zone) { fname_s_0184(wall[i].userData.wall.zone.label); scene.remove(wall[i].userData.wall.zone.label); }			
		
		wall[i].label = [];
		wall[i].userData.wall.p = [];
		wall[i].userData.wall.outline = null;
		wall[i].userData.wall.zone = null;
		
		scene.remove(wall[i]); 
	}
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		fname_s_0184(point[i]);
		scene.remove(point[i]); 
	}	
	
	for ( var i = 0; i < window.length; i++ )
	{ 
		fname_s_0184(window[i]); 
		scene.remove(window[i]); 
	}
	
	for ( var i = 0; i < door.length; i++ )
	{ 
		fname_s_0184(door[i]); 
		scene.remove(door[i]); 
	}	
	
	
	for ( var i = 0; i < floor.length; i++ )
	{		
		fname_s_0184(floor[i]);
		fname_s_0184(floor[i].label);
		fname_s_0184(ceiling[i]);
		
		scene.remove(floor[i].label); 
		if(floor[i].userData.room.outline) { scene.remove(floor[i].userData.room.outline); }
		scene.remove(floor[i]); 
		scene.remove(ceiling[i]);	
	}
	
	for ( var i = 0; i < obj.length; i++ )
	{ 
		fname_s_0184(obj[i]);
		scene.remove(obj[i]);
	}	
	
	
	
	for(var i = 0; i < infProject.ui.list_wf.length; i++)
	{
		infProject.ui.list_wf[i].remove();
	}		
	
	infProject.ui.list_wf = [];
	
	
	
	
	
	
	obj_point = [];
	room = [];
	ceiling = [];
	arrWallFront = [];
	

	countId = 2;
	
	
	var cube = infProject.tools.controllWD;
	for ( var i = 0; i < cube.length; i++ ) { cube[i].visible = false; }
	
	var line = infProject.scene.size.wd_1.line;
	var label = infProject.scene.size.wd_1.label;
	for ( var i = 0; i < line.length; i++ ) 
	{ 
		line[i].visible = false; 
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			line[i].userData.rulerwd.cone[i2].visible = false; 
		}
	}
	for ( var i = 0; i < label.length; i++ ) { label[i].visible = false; }
	
	
	
	camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
	camera3D.userData.camera.click = { pos : new THREE.Vector3() }; 
	
	clickO = resetPop.clickO();
	infProject.project = null;
	infProject.scene.array = resetPop.infProjectSceneArray();
	infProject.scene.light.lamp = [];
	
	
	fname_s_0182();
}



function fname_s_0182()
{	
	
	
		
}







function fname_s_0183(node, callback) 
{
	for (var i = node.children.length - 1; i >= 0; i--) 
	{
		if(node.children[i].userData.tag)
		{
			var tag = node.children[i].userData.tag;
			
			if(tag == 'point' || tag == 'wall' || tag == 'window' || tag == 'door' || tag == 'room' || tag == 'ceiling' || tag == 'obj')
			{
				var child = node.children[i];

				fname_s_0183(child, callback);
				callback(child);			
			}			
		}			
	}
}


function fname_s_0184(node) 
{
        if (node instanceof THREE.Mesh || node instanceof THREE.Line) 
		{
            if (node.geometry) { node.geometry.dispose(); }
			
            if (node.material) 
			{
                var materialArray;
                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) 
				{
                    materialArray = node.material.materials;
                }
                else if(node.material instanceof Array) 
				{
                    materialArray = node.material;
                }
                
				if(materialArray) 
				{
                    materialArray.forEach(function (mtrl, idx) 
					{
                        if (mtrl.map) mtrl.map.dispose();
                        if (mtrl.lightMap) mtrl.lightMap.dispose();
                        if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                        if (mtrl.normalMap) mtrl.normalMap.dispose();
                        if (mtrl.specularMap) mtrl.specularMap.dispose();
                        if (mtrl.envMap) mtrl.envMap.dispose();
                        mtrl.dispose();
                    });
                }
                else 
				{
                    if (node.material.map) node.material.map.dispose();
                    if (node.material.lightMap) node.material.lightMap.dispose();
                    if (node.material.bumpMap) node.material.bumpMap.dispose();
                    if (node.material.normalMap) node.material.normalMap.dispose();
                    if (node.material.specularMap) node.material.specularMap.dispose();
                    if (node.material.envMap) node.material.envMap.dispose();
                    node.material.dispose();
                }
            }
        }
}




function fname_s_0185()
{
	var json = 
	{
		version: {},
		points: [],
		walls: [],	
		rooms: [],
		object: [],
		height: infProject.settings.height,		
	};
	
	var points = [];
	var walls = [];
	var rooms = [];
	var object = [];
	
	
	var wall = infProject.scene.array.wall;
	
	
	for ( var i = 0; i < wall.length; i++ )
	{			
		var p = wall[i].userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y, p[i2].position.z);
				points[m].type = 'w';
			}
		}
	}	
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var p = wall[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = wall[i].userData.id;
		walls[i].p = { id: [p[0].userData.id, p[1].userData.id] };
		
		
		walls[i].size = {y: wall[i].userData.wall.height_1, z: wall[i].userData.wall.width};

		
		if(1==2)
		{
			var x1 = p[1].position.z - p[0].position.z;
			var z1 = p[0].position.x - p[1].position.x;	
			var dir = new THREE.Vector3(z1, 0, -x1).normalize();						
			dir.multiplyScalar( wall[i].userData.wall.offsetZ );
			walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);			
		}
				
		var wd = fname_s_0186(wall[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;

		
		walls[i].material = [wall[i].userData.material[1], wall[i].userData.material[2]];						
	}	

	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < floor.length; i++ )
	{
		rooms[i] = { contour : [] };
		
		rooms[i].id = floor[i].userData.id;  
		
		rooms[i].contour = [];
		var s = 0; for ( var i2 = floor[i].p.length - 1; i2 >= 1; i2-- ) { rooms[i].contour[s] = floor[i].p[i2].userData.id; s++; } 
		
		rooms[i].material = [floor[i].userData.material, ceiling[i].userData.material];						
	}
	

	
	for ( var i = 0; i < infProject.scene.array.obj.length; i++ )
	{
		var obj = infProject.scene.array.obj[i];		
			
		var m = object.length;
		object[m] = {};
		object[m].id = Number(obj.userData.id);
		object[m].lotid = Number(obj.userData.obj3D.lotid);
		object[m].pos = obj.position;
		
		object[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		
		object[m].type = obj.userData.obj3D.type;
		
		if(obj.userData.obj3D.type == "light point")
		{
			object[m].light = { intensity: obj.children[1].intensity };
		}
	}	
	
	
	json.points = points;
	json.walls = walls;
	json.rooms = rooms;
	json.object = object;
	
	
	

	json.version.id = 2;
	json.version.rooms = { contour: [] };
	
	var contour = fname_s_09( infProject.scene.array.floor );
	
	for(var i = 0; i < contour.length; i++)
	{
		for(var i2 = 0; i2 < contour[i].length; i2++)
		{
			contour[i][i2] = {x: contour[i][i2].x, y: contour[i][i2].z};
		}
	}
	
	json.version.rooms.contour = contour;
	
	return json;
}






function fname_s_0186(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices; 

			wd.updateMatrixWorld();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeBoundingSphere();
			var dX = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
			var dY = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;
			var center = wd.geometry.boundingSphere.center;
		
		
			var v7 = wd.localToWorld( center.clone() );			
			var qt1 = fname_s_0223( new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize() );
			var x = fname_s_0221(new THREE.Vector3().subVectors( v7, p[0].position ), qt1).z; 
			
			x = x / p[1].position.distanceTo( p[0].position );		
			var y = wall.worldToLocal( wd.localToWorld(new THREE.Vector3(0, wd.geometry.boundingBox.min.y, 0)) ).y;
			
			
			var arr = {};
			
			arr.id = wd.userData.id;							
			arr.lotid  = wd.userData.door.lotid;				  
			arr.size = {x: dX, y: dY};									
			arr.pos = {x: x, y: y};								
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}


function fname_s_0187(cdm) 
{ 
	
	var json = JSON.stringify( fname_s_0185() );
	
	if(cdm.json)
	{
		
		$.ajax
		({
			url: infProject.path+'saveJson.php',
			type: 'POST',
			data: {myarray: json},
			dataType: 'json',
			success: function(json)
			{ 			
				 
			},
			error: function(json){   }
		});			
	}
	
	
	if(cdm.id)
	{
		
		
		$.ajax
		({
			url: infProject.path+'components/saveSql.php',
			type: 'POST',
			data: {json: json, id: cdm.id, user_id: infProject.user.id},
			dataType: 'json',
			success: function(json)
			{ 			
				
				
				if(cdm.upUI) { fname_s_0290({id: infProject.user.id}); }		
			},
			error: function(json){  }
		});			
	}
	
	if(cdm.txt)
	{	
		var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(json);	
		
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.href = csvData;
		link.target = '_blank';
		link.download = 'file.json';
		link.click();			
	}	
}





function fname_s_0188(cdm) 
{
	if(cdm.id == 0) { fname_s_0181(); return; }	 
	
	
	if(cdm.json)	
	{
		$.ajax
		({
			url: infProject.path+'t/fileJson.json',
			type: 'POST',
			dataType: 'json',
			success: function(json)
			{ 
				fname_s_0181();
				fname_s_0189(json); 	
			},
		});			
	}
	else	
	{
		$.ajax
		({
			url: infProject.path+'components/loadSql.php',
			type: 'POST',
			data: {id: cdm.id},
			dataType: 'json',
			success: function(json)
			{ 
				fname_s_0181();
				fname_s_0189(json); 	
			},
		});		
		
	}
	
}






function fname_s_0189(arr) 
{                 		
	if(!arr) return;
	
	
	
	infProject.project = { file: arr, load: { furn: [] } };
		
	var point = arr.points;
	var walls = arr.walls;
	var rooms = arr.rooms;
	var furn = (arr.object) ? arr.object : [];
	
	
	fname_s_0169({ load: true, height: arr.height, input: true, globalHeight: true });
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		
		
		wall[i].width = walls[i].size.z;
		wall[i].height = walls[i].size.y;		
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].p.id[0], pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].p.id[1], pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, 0, point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, 0, point[i2].pos.z); }
		}
		
		wall[i].material = walls[i].material;
		
		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  }
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].pos = new THREE.Vector3(arrO[i2].pos.x, arrO[i2].pos.y, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(arrO[i2].size.x, arrO[i2].size.y);
			wall[i].arrO[i2].type = arrO[i2].type;
		} 	
	}
	


	
	 
	
	for ( var i = wall.length - 1; i >= 0; i-- )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(wall[i] == wall[i2]) continue;			
			
			var count = 0;
			var pos1 = [];
			var pos2 = [];
			if(wall[i].points[0].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[0].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			if(wall[i].points[1].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[1].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			
			if(count == 2) { wall.splice(i, 1); }
			else if(count == 1)
			{
				var dir1 = new THREE.Vector3().subVectors( pos1[0], pos1[1] ).normalize();
				var dir2 = new THREE.Vector3().subVectors( pos2[0], pos2[1] ).normalize();
				
				if(!fname_s_034(dir1, dir2)) { continue; }
				
				var d1 = pos1[0].distanceTo( pos1[1] );
				var d2 = pos2[0].distanceTo( pos2[1] );
				
				if(d1 > d2) { wall.splice(i, 1); } 
			}
		}
	}
	
	
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = fname_s_0227( 'point', wall[i].points[0].id );
		var point2 = fname_s_0227( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = fname_s_0213( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = fname_s_0213( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		
		
		var offsetZ = 0;
		var inf = { id: wall[i].id, p: [point1, point2], width: wall[i].width, offsetZ: -offsetZ, height: wall[i].height, load: true };
		
		
		var obj = fname_s_0214(inf); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	
	for ( var i = 0; i < obj_point.length; i++ ) { fname_s_0104(obj_point[i]); }
	
	fname_s_07(infProject.scene.array.wall);	

	fname_s_0145();
	

	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			var inf = { status : 'load', id : wall[i].arrO[i2].id, pos : intP, wall : obj, type : wall[i].arrO[i2].type };	 		
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }				
						
			fname_s_048(inf);
		}		
	}
	
	

	
	{
		var arrTexture = [];
		for ( var i = 0; i < walls.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[0].img, index: walls[i].material[0].index };
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[1].img, index: walls[i].material[1].index };
		}
		for ( var i = 0; i < rooms.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[0].img, tag: rooms[i].material[0].tag };
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[1].img, tag: rooms[i].material[1].tag };
		}
		
		
		
		
		fname_s_0190({arr: arrTexture});
	}
	
	
	fname_s_0191({furn: furn});

	
	fname_s_0193();
	fname_s_078( camera.zoom );
	

	fname_s_0195();
	
	
}



function fname_s_0190(cdm)
{
	
	
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < cdm.arr.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(cdm.arr[i].objId == wall[i2].userData.id)
			{ 
				fname_s_0216({obj: wall[i2], material: cdm.arr[i]});
			}			
		}
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(cdm.arr[i].objId == room[i2].userData.id && cdm.arr[i].tag == 'room')
			{ 
				fname_s_0216({obj: room[i2], material: cdm.arr[i]});
			}			
		}	
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(cdm.arr[i].objId == ceiling[i2].userData.id && cdm.arr[i].tag == 'ceiling')
			{ 
				fname_s_0216({obj: ceiling[i2], material: cdm.arr[i]});
			}			
		}			
	}
}



function fname_s_0191(cdm)
{
	var furn = cdm.furn;
	var lotid = [];
	
	for ( var i = 0; i < furn.length; i++ )
	{
		lotid[lotid.length] = Number(furn[i].lotid); 
	}
	
	lotid = [...new Set(lotid)];  
	
	for ( var i = 0; i < lotid.length; i++ )
	{
		fname_s_0268({lotid: lotid[i], loadFromFile: true, furn: furn});
	}	
}



function fname_s_0192(cdm)
{ 
	var furn = cdm.furn;
	
	for ( var i = 0; i < furn.length; i++ )
	{  
		if(Number(cdm.lotid) == Number(furn[i].lotid))
		{			
			fname_s_0268(furn[i]);  

			infProject.project.load.furn[infProject.project.load.furn.length] = furn[i].id;
			
			if(infProject.project.load.furn.length == infProject.project.file.object.length)
			{ 
				fname_s_0193();
			}
		}
	}	
}



function fname_s_0193(cdm)
{
	
	
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}	
	countId++; 
	
	
	
	
	fname_s_063(cameraTop);
	fname_s_080();	
}











var container = document.getElementById( 'canvasFrame' );
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );


var w_w = container.clientWidth;
var w_h = container.clientHeight;
var aspect = container.clientWidth/container.clientHeight;
var d = 2;



renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( w_w, w_h );


container.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdefbff );
scene.fog = new THREE.Fog('lightblue', 100, 200);

var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.zoom = infProject.settings.camera.zoom;
cameraTop.updateMatrixWorld();
cameraTop.updateProjectionMatrix();




var camera3D = new THREE.PerspectiveCamera( 65, w_w / w_h, 0.01, 1000 );  
camera3D.rotation.order = 'YZX';		
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
camera3D.userData.camera.click = { pos : new THREE.Vector3() }; 






var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2







var cube = new THREE.Mesh( fname_s_0205(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );






function fname_s_0194() 
{
	requestAnimationFrame( fname_s_0194 );	

	fname_s_077();	
	fname_s_082();
	
	fname_s_069();
}


function fname_s_0195()
{
	camera.updateMatrixWorld();	
	
	composer.render();
}




window.addEventListener( 'resize', fname_s_0196, false );
function fname_s_0196() 
{ 
	var w_w = container.clientWidth;
	var w_h = container.clientHeight;
	var aspect = w_w / w_h;
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
	
	renderer.setSize(w_w, w_h);
	
	fname_s_0195();
}









var resolutionD_w = container.clientWidth;
var resolutionD_h = container.clientHeight;

var kof_rd = 1;

var countId = 2;
var camera = cameraTop;
var obj_point = [];
var room = [];
var ceiling = [];
var arrWallFront = [];

var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;
infProject.settings.active = { pg: 'pivot' };
infProject.settings.door = { width: 1, height: 2.2 };
infProject.settings.wind = { width: 1, height: 1, h1: 1.0 };
infProject.camera = { d3: { theta: 0, phi: 75, targetPos: new THREE.Vector3() } };
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.grid = { obj: fname_s_011(infProject.settings.grid), active: false, link: false, show: true };
infProject.scene.block = { key : { scroll : false } };		
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : fname_s_0209() }
infProject.geometry.cone = [fname_s_0210({r1: 0.003, r2: 0.03, h: 0.25}), fname_s_0210({r1: 0.001, r2: 0.04, h: 0.1})];
infProject.geometry.labelWall = fname_s_0203(0.25 * 2, 0.125 * 2);
infProject.geometry.labelFloor = fname_s_0203(1.0 * kof_rd, 0.25 * kof_rd);
infProject.geometry.labelWD = fname_s_0204(0.25 * kof_rd, 0.125 * kof_rd);
infProject.scene.substrate = { ruler: [], floor: [], active: null };
infProject.scene.substrate.ruler = fname_s_0297(); 
infProject.scene.size = { wd_1: {} };	
infProject.scene.size.wd_1.line = fname_s_0170({count : 6, color : 0x616161});	
infProject.scene.size.wd_1.label = fname_s_0171({ count: 6, text: 0, size: 50, ratio: {x:256*2, y:256}, border: 'border line', geometry: infProject.geometry.labelWD, opacity : 0.5 });

infProject.tools = { pivot: fname_s_0242(), gizmo: fname_s_0258(), cutWall: [], point: fname_s_0211(), axis: fname_s_0207(), controllWD: fname_s_085() } 

infProject.catalog = { obj: fname_s_0265(), texture: fname_s_0266() }; 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 

infProject.ui = {}
infProject.ui.list_wf = [];
infProject.ui.right_menu = {active: ''};







var planeMath = fname_s_0202();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  


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




{
	var composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, cameraTop );
	var outlinePass = new THREE.OutlinePass( new THREE.Vector2( w_w, w_h ), scene, cameraTop );	
	
	composer.setSize( w_w, w_h );
	composer.addPass( renderPass );
	composer.addPass( outlinePass );


	if(infProject.settings.shader.saoPass)
	{
		var saoPass = new THREE.SAOPass(scene, camera, true, true);	
		
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
		fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( w_w * window.devicePixelRatio );
		fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( w_h * window.devicePixelRatio );	
		fxaaPass.enabled = false;
		
		composer.addPass( fxaaPass ); 	
	}	
	

	outlinePass.visibleEdgeColor.set( '#25db00' );
	outlinePass.hiddenEdgeColor.set( '#25db00' );
	outlinePass.edgeStrength = Number( 5 );		
	outlinePass.edgeThickness = Number( 0.01 );	

	outlinePass.selectedObjects = [];


	function fname_s_0197( obj, cdm )
	{	
		if(!cdm) cdm = {};
		
		var arr = [obj];
		if(cdm.arrO) { var arr = cdm.arrO; }	
		
		outlinePass.selectedObjects = arr;  
	}

	function fname_s_0198()
	{
		outlinePass.selectedObjects = [];
	}	
}




{
	fname_s_0201();
	fname_s_0300({ pos: {y: 0.01} }); 	
	fname_s_070({radious: 10, theta: 90, phi: 35});		
	fname_s_0276();			
	fname_s_0277();		
	fname_s_0278();
	fname_s_0282({name: 'button_wrap_object'});	
	
	
	fname_s_0286({});

	
}






  
function fname_s_0199(cdm)
{
	if(!cdm) cdm = {};
	
	function fname_s_0200() 
	{ 	
		var block = $('[nameId="panel_catalog_1"]')[0];
		
		this.block = block;
		
		this.circleMin = block.querySelector('.bl_fd31'); 
		this.handle = block.querySelector('[nameId="sun_intensity_handle"]');
		this.text = block.querySelector('[nameId="sun_intensity_div"]');   
		this.value = (cdm.value !== undefined) ? cdm.value : 0.5;
		
		this.init();
	}


	fname_s_0200.prototype.init = function () 
	{	
		var self = this;
		
		$(self.handle).on("mousedown touchstart", function (event) { self.startDrag(event); });
		
		self.update();
	};


	fname_s_0200.prototype.startDrag = function (event) 
	{
		var self = this;
		
		$(self.block).on("mousemove touchmove", function (event) { self.drag(event); });
		$(self.block).on("mouseup touchend", function (event) { self.stopDrag(event); });
		
		$(window).on("mousemove touchmove", function (event) { self.drag(event); });
		$(window).on("mouseup touchend", function (event) { self.stopDrag(event); });	
	};


	fname_s_0200.prototype.stopDrag = function () 
	{
		var self = this;
		
		$(window).off("mousemove mouseup");
		$(self.block).off("mousemove mouseup");	
		
		self.update();
	};


	fname_s_0200.prototype.drag = function (event) 
	{        
		var self = this;  
		var circleMin = $(self.circleMin); 
		
		var pageX = event.pageX;
		var pageY = event.pageY;
		var touches = event.originalEvent.touches;
		
		
		if (touches && touches.length === 1) 
		{
			pageX = touches[0].pageX;
			pageY = touches[0].pageY;
		}

		var deltaX = pageX - circleMin.offset().left;

		var width = 200;	
		
		if(deltaX < 0) { deltaX = 0; }
		else if(width < deltaX) { deltaX = circleMin.width(); }
		
		  
		self.value = deltaX / width;
		
		this.update();
	};


	fname_s_0200.prototype.update = function () 
	{
		var self = this;
		var circleMin = $(self.circleMin);
		var $handle = $(self.handle);
		var $text = $(self.text);
		
		var width = 200;	
		
		var left = (self.value * width) - $handle.width() / 2;
		var top = circleMin.height() / 2 - $handle.height() / 2;
		
		
			
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
						fname_s_0195();
					}
				}
			}
		}
		
	};

	new fname_s_0200();
}


function fname_s_0201()
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
		
		fname_s_0195();
	});		
	
}



function fname_s_0202()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}



function fname_s_0203(x, y)
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



function fname_s_0204(x, y)
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



function fname_s_0205(x, y, z, cdm)
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




function fname_s_0206(x, y, z, pr_offsetZ)
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



function fname_s_0207() 
{
	var axis = [];
	
	var geometry = fname_s_0205(0.5, 0.02, 0.02);		
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


function fname_s_0208( vertices )
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




function fname_s_0209()
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
		
	}

	return circle;
}



function fname_s_0210(cdm)
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
	
	return fname_s_0208(v);
}


function fname_s_0211()
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
	
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.tool_point.v2 = v2;		
	}	
	
	
	return obj;
}




function fname_s_0212( obj )
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




function fname_s_0213( pos, id )
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


  



function fname_s_0214( cdm ) 
{
	var point1 = cdm.p[0];
	var point2 = cdm.p[1];
	var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : infProject.settings.height; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	
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
	
	
	var geometry = fname_s_0206(d, height, width, offsetZ);	
	var wall = new THREE.Mesh( geometry, materials ); 
 	infProject.scene.array.wall[infProject.scene.array.wall.length] = wall;
	
	wall.label = [];
	wall.label[0] = fname_s_0171({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : infProject.geometry.labelWall, opacity : 0.5 })[0];	
	wall.label[0].visible = false;
	
	wall.label[1] = fname_s_0171({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : infProject.geometry.labelWall, opacity : 0.5 })[0]; 
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
	
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	
	wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	
	wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	
	wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
	

	wall.castShadow = true;	
	wall.receiveShadow = true;
	
	fname_s_0220( wall );
	
	
	
	
	
	if(cdm.material)
	{  
		for ( var i = 0; i < cdm.material.length; i++ )
		{			
			fname_s_0216({obj: wall, material: cdm.material[i]});
		}	
	}
	
	
	
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


 

function fname_s_0215( event, obj, t ) 
{
	mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
	mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj ); }
	
	return intersects;
}





function fname_s_0216(cdm)
{
	
	
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
				fname_s_0288({obj: cdm.obj});
			}
		}
		
		if(cdm.obj.userData.tag == "room" || cdm.obj.userData.tag == "ceiling")
		{
			cdm.obj.userData.material.img = img;
			
			if(cdm.ui)
			{
				fname_s_0289({obj: cdm.obj});
			}
		}		
		
		fname_s_0195();
	});			
}






function fname_s_0217( event )
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

	var intersects = fname_s_0215( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(camera == cameraTop)
	{ 
		if(clickO.button == 'create_wall')
		{
			clickO.obj = null; 
			clickO.last_obj = null;
			
			var point = fname_s_0213( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			clickO.move = point;				
		}
		else if(clickO.button == 'create_wd_2')
		{
			fname_s_048({type:'door', lotid: 4});
		}
		else if(clickO.button == 'create_wd_3')
		{
			fname_s_048({type:'window', lotid: 1});
		}			
		else if(clickO.button == 'add_lotid')
		{
			fname_s_0268({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == camera3D)
	{
		if(clickO.button == 'add_lotid')
		{
			fname_s_0268({lotid: clickO.options, cursor: true});
		}		
	}
	else if(camera == cameraWall)
	{
		if(clickO.button == 'create_wd_3')
		{
			fname_s_048({type:'window'});
		}
	}
	
	clickO.buttonAct = clickO.button;
	clickO.button = null;

	
}	
	

function fname_s_0218(cdm)
{
	if(clickO.move)
	{
		fname_s_0219();
		fname_s_054();
	}

	
	if(cdm)
	{		
		fname_s_0219();	
		
		if(cdm.button == '2D')
		{  			
			fname_s_063(cameraTop);
		}
		else if(cdm.button == '3D')
		{
			fname_s_063(camera3D);
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
			fname_s_013(); 
		}
		else if(cdm.button == 'grid_move_1')
		{
			fname_s_014(); 
		}
		else if(cdm.button == 'grid_link_1')
		{
			fname_s_018(); 
		}		
	}

}	




function fname_s_0219()
{
	clickO.obj = null;
	clickO.rayhit = null;
	
	fname_s_060();		
}




function fname_s_0220( obj )
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






function fname_s_0221(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function fname_s_0222(dir1, dir_local)
{	
	var qt = fname_s_0223(dir1);			
	return dir_local.applyQuaternion( qt );
}


function fname_s_0223(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}

 

 
 


function fname_s_0224() 
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
		
		return;
	}
}



function fname_s_0225() 
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
		
		return null;
	}
}



var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); 
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); 
	} 
	else 
	{
		location.replace(uri);
	}
} 
  
 
	
	
 
function fname_s_0226()
{
	 
}




function fname_s_0227( cdm, id )
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



fname_s_0194();
fname_s_0195();



document.body.addEventListener('contextmenu', function(event) { event.preventDefault() });
document.body.addEventListener( 'mousedown', fname_s_055, false );
document.body.addEventListener( 'mousemove', fname_s_058, false );
document.body.addEventListener( 'mouseup', fname_s_059, false );


document.body.addEventListener( 'touchstart', fname_s_055, false );
document.body.addEventListener( 'touchmove', fname_s_058, false );
document.body.addEventListener( 'touchend', fname_s_059, false );

document.addEventListener('DOMMouseScroll', fname_s_076, false);
document.addEventListener('fname_s_076', fname_s_076, false);	


document.body.addEventListener("keydown", function (e) 
{ 
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { fname_s_0165({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { fname_s_0127(clickO.last_obj); }
			if(infProject.activeInput == 'size-wd-height') { fname_s_0127(clickO.last_obj); }
			if(infProject.activeInput == 'rp_wd_h1') { fname_s_0127(clickO.last_obj); }
			if(infProject.activeInput == 'size-grid-tube-xy-1')
			{
				fname_s_012({size : $('[nameid="size-grid-tube-xy-1"]').val()});
			}
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				fname_s_0168({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'}); 
			}
			else if(infProject.activeInput == 'dp_inf_1_proj')
			{
				fname_s_0230();
			}			
		}		
		 
		return; 
	}


	if(e.keyCode == 46) { fname_s_0129(); }
	
	if(clickO.keys[18] && e.keyCode == 90) { fname_s_0188({json: true}); }		
	if(clickO.keys[18] && e.keyCode == 72) { fname_s_0182(); }		
	if(clickO.keys[18] && e.keyCode == 77) { fname_s_0230(); }				
	if(clickO.keys[18] && e.keyCode == 84) { fname_s_0187({json: true}); }			
	if(clickO.keys[18] && e.keyCode == 86) {  }
	if(clickO.keys[18] && e.keyCode == 86) {  }  		
	if(clickO.keys[18] && e.keyCode == 66) 	
	{ 
		if(infProject.settings.shader.saoPass)
		{
			saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
			
			fname_s_0195();			
		}
	}  
	
	if(e.keyCode == 66) { fname_s_0274(); } 	
	
	if(e.keyCode == 89) { fname_s_0187({txt: true}); } 			
	if(e.keyCode == 86) { fname_s_0181(); fname_s_0321(); } 
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



function fname_s_0228(cdm)
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


	fname_s_0195();
}



function fname_s_0229(cdm)
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
	
	fname_s_0195();
}



function fname_s_0230()
{
	var visible = $('[nameid="dp_inf_1"]').is(":visible");
	
	$('[nameid="dp_inf_1"]').toggle();
	
	if(visible)
	{
		var num = Number($('[nameid="dp_inf_1_proj"]').val());
		
		fname_s_0188({id: num});
		
		
	}
}




function fname_s_0231(cdm)
{	
	var value = cdm.value; 
	
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!fname_s_019(value)) return null; 
	
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
		if(cdm.unit == 0.01) { value /= 100; } 
		else if(cdm.unit == 0.001) { value /= 1000; } 
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}








function fname_s_0232(cdm) 
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
		fname_s_0233(lineAB, mathPlane);
		fname_s_0233(lineBC, mathPlane);
		fname_s_0233(lineCA, mathPlane);
	});
	
	
	function fname_s_0233(line, plane) 
	{
		pointOfIntersection = plane.intersectLine(line, new THREE.Vector3());
		if (pointOfIntersection) 
		{ 
			pointsOfIntersection.vertices.push(pointOfIntersection.clone());
			arrP[arrP.length] = new THREE.Vector2(pointOfIntersection.x, pointOfIntersection.z);
		};
	}
	
	
	
	if(1==2)
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


var planeGeom = new THREE.PlaneGeometry(100, 100);

var material = new THREE.MeshBasicMaterial({ color: "pink", transparent: true, opacity: 0.5, side: THREE.DoubleSide });
material.visible = false;
var plane2 = new THREE.Mesh(planeGeom, material);
plane2.position.y = 4;
scene.add(plane2);
	
	
	
	

var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 	
		 

	 
	
	
	
	
	
	
	
	
	
	if(1==2)	
	{
		var loader = new THREE.GLTFLoader();
		loader.load( infProject.path+'import/80105983_krovat_dafna9.glb', function ( obj ) 						
		{ 
			
			
			var obj = obj.scene;
			
			fname_s_0275({obj: obj});
		});			
	}	
	
});






















$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll fname_s_076 mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll fname_s_076 mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { fname_s_0218(); });
$('[data-action="left_panel_1"]').mousedown(function () { fname_s_0218(); });


$('[nameId="butt_main_menu"]').mousedown(function () { $('[nameId="background_main_menu"]').css({"display":"block"}); });
$('[nameId="button_load_1"]').mousedown(function () { fname_s_0234({value: 'button_load_1'}); });
$('[nameId="button_save_1"]').mousedown(function () { fname_s_0234({value: 'button_save_1'}); });


$('[nameId="camera_button"]').change(function() { fname_s_0218({button: $( this ).val()}); });




function fname_s_0234(cdm)
{
	$('[nameId="menu_content_1_h1"]').hide();
	$('[wwm_1="button_load_1"]').hide();
	$('[wwm_1="button_save_1"]').hide();
	
	$('[wwm_1="'+cdm.value+'"]').show();	
}


$('[nameId="button_wrap_img"]').mousedown(function () { fname_s_0282({el: this}); });
$('[nameId="button_wrap_catalog"]').mousedown(function () { fname_s_0282({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { fname_s_0282({el: this}); });
$('[nameId="button_wrap_object"]').mousedown(function () { fname_s_0282({el: this}); });
$('[nameId="button_wrap_plan"]').mousedown(function () { fname_s_0282({el: this}); });




	

$('[nameId="showHideWall_1"]').on('mousedown', function(e) { fname_s_068(); });

	
$('[nameId="select_pivot"]').mousedown(function () { fname_s_0254({mode:'pivot'}); });
$('[nameId="select_gizmo"]').mousedown(function () { fname_s_0254({mode:'gizmo'}); });

$('[nameId="obj_rotate_reset"]').mousedown(function () { fname_s_0257(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { fname_s_0256(); });
$('[nameId="button_delete_obj"]').mousedown(function () { fname_s_0252(clickO.last_obj); });


$('[data-action="wall"]').mousedown(function () { fname_s_0218({button:'point_1'}); });
$('[data-action="create_wd_2"]').mousedown(function () { fname_s_0218({button:'create_wd_2'}); });
$('[data-action="create_wd_3"]').mousedown(function () { fname_s_0218({button:'create_wd_3'}); });
$('[data-action="grid_show_1"]').mousedown(function () { fname_s_0218({button:'grid_show_1'}); });
$('[data-action="grid_move_1"]').mousedown(function () { fname_s_0218({button:'grid_move_1'}); });
$('[data-action="grid_link_1"]').mousedown(function () { fname_s_0218({button:'grid_link_1'}); });
$('[add_lotid]').mousedown(function () { fname_s_0218({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[data-action="screenshot"]').mousedown(function () { fname_s_0224(); return false; }); 				





$('[data-action="deleteObj"]').mousedown(function () { fname_s_0129(); return false; });
$('[data-action="fname_s_040"]').mousedown(function () { fname_s_040(); return false; });



$('input').on('focus', function () { fname_s_0235({el: $(this), act: 'down'}); });
$('input').on('change', function () { fname_s_0235({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function fname_s_0235(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		
	}
	
	if(cdm.act == 'up')
	{
		fname_s_0236();
	}
		
}


function fname_s_0236(cdm)
{
	if(infProject.activeInput == 'rp_floor_height')
	{
		fname_s_0169({ height: $('[nameId="rp_floor_height"]').val(), input: true, globalHeight: true });
	}
	else if(infProject.activeInput == 'rp_wall_width_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		fname_s_0287({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	



$('[nameId="rp_button_apply"]').mousedown(function () 
{  
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	if(obj.userData.tag == 'wall')
	{
		var width = $('[nameid="size_wall_width_1"]').val();
		
		fname_s_0168({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'});		
	}
	else if(obj.userData.tag == 'window')
	{
		fname_s_0127(clickO.last_obj);
	}
	else if(obj.userData.tag == 'door')
	{
		fname_s_0127(clickO.last_obj);
	}	
});



$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	clickO.click.o = clickO.last_obj;
	fname_s_0279({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	clickO.click.o = clickO.last_obj;
	fname_s_0279({type: 2});
});

$('[nameId="rp_button_room_texture_1"]').mousedown(function () 
{ 
	clickO.click.o = clickO.last_obj; 
	fname_s_0280({type: 2}); 
});

$('[nameId="rp_button_room_texture_2"]').mousedown(function () 
{ 
	clickO.click.o = fname_s_0144({obj: clickO.last_obj}).ceiling;
	fname_s_0280({type: 2}); 	
});


$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	fname_s_0279({type: 1});
});

$('[nameId="but_back_catalog_texture_2"]').mousedown(function () 
{ 
	fname_s_0280({type: 1});
});

$('[add_texture]').mousedown(function () 
{ 
	fname_s_0216({obj: clickO.click.o, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true} ); 
}); 




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	fname_s_0218(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { fname_s_0229({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { fname_s_0228({visible: this.checked}); });



$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	
	

$('[nameId="button_check_reg_1"]').mousedown(function () { fname_s_0237({el: this}); });
$('[nameId="button_check_reg_2"]').mousedown(function () { fname_s_0237({el: this}); });	


function fname_s_0237(cdm)
{
	var inf_block = $('[nameId="info_reg_1"]');
	var inf_str_1 = $('[nameId="info_reg_1_1"]');
	var inf_str_2 = $('[nameId="info_reg_1_2"]');
	
	inf_block.hide();
	inf_str_1.hide();
	inf_str_2.hide();		

	if(cdm.el.attributes.nameId.value == "button_check_reg_1") 
	{
		$('[nameId="act_reg_1"]').text('Войти');
		$('[nameId="act_reg_1"]').attr("b_type", "reg_1"); 
	}
	if(cdm.el.attributes.nameId.value == "button_check_reg_2") 
	{
		$('[nameId="act_reg_1"]').text('Зарегистрироваться');
		$('[nameId="act_reg_1"]').attr("b_type", "reg_2");
	}	
}


	

$('[nameId="act_reg_1"]').mousedown(function () { fname_s_0238(); });


function fname_s_0238()
{
		var pattern_1 = /^[a-z0-9@_\-\.]{4,20}$/i;
	var pattern_2 = /^[a-z0-9]{4,20}$/i;
	var mail = $('[nameId="input_reg_mail"]');
	var pass = $('[nameId="input_reg_pass"]');
	
	var inf_block = $('[nameId="info_reg_1"]');
	var inf_str_1 = $('[nameId="info_reg_1_1"]');
	var inf_str_2 = $('[nameId="info_reg_1_2"]');
	
	inf_block.hide();
	inf_str_1.hide();
	inf_str_2.hide();
	
	var flag_1 = false;
	var flag_2 = false;
	
	mail.val(mail.val().trim());		pass.val(pass.val().trim());		
		if(mail.val() != '')
	{
		if(pattern_1.test(mail.val()))
		{
			flag_1 = true;
		}
		else
		{
			inf_str_1.show();
			inf_str_1.text('Не верно указанна почта');			
		}
	}
	else
	{		
		inf_str_1.show();
		inf_str_1.text('Укажите e-mail');
	}
	
	
		if(pass.val() != '')
	{
		if(pattern_2.test(pass.val()))
		{
			flag_2 = true;
		}
		else
		{
			inf_str_2.show();
			inf_str_2.html('Не верно указан пароль<br>(Только цифры и латинские буквы от 4 до 20 знаков)');			
		}
	}		
	else
	{		
		inf_str_2.show();
		inf_str_2.text('Укажите пароль');
	}
	
	
		if(flag_1 && flag_2)
	{ 
		inf_block.hide();
		
				var type = $('[nameId="act_reg_1"]').attr("b_type");
		
		$.ajax
		({
			type: "POST",					
			url: infProject.path+'components/regUser.php',
			data: {"type": type, "mail": mail.val(), "pass": pass.val()},
			dataType: 'json',
			success: function(data)
			{  
				if(type=='reg_1')					{
					if(data.success)
					{
						infProject.user.id = data.info.id;
						infProject.user.mail = data.info.mail;
						infProject.user.pass = data.info.pass;

						$('[nameId="reg_content_1"]').show();
						$('[nameId="reg_content_2"]').hide();

						fname_s_0290({id: infProject.user.id});
					}
					else
					{
						if(data.err.desc)
						{
							
							inf_str_1.html(data.err.desc);
							
							inf_block.show();
							inf_str_1.show();
							inf_str_1.show();
							inf_str_2.hide();													
						}
					}
				}
				else if(type=='reg_2')					{
					if(data.success)
					{
												inf_str_1.html("Вы успешно зарегистрировались");						
						
						inf_block.show();
						inf_str_1.show();
						inf_str_1.show();
						inf_str_2.hide();												
					}
					else
					{						
						if(data.err.desc)
						{
							
							inf_str_1.html(data.err.desc);
							
							inf_block.show();
							inf_str_1.show();
							inf_str_1.show();
							inf_str_2.hide();													
						}						
					}
				}				
			}
		});		
	}
	else		{  
		inf_block.show();
	}
};






$('[nameId="button_show_panel_catalog"]').mousedown(function () { fname_s_0239({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { fname_s_0239({show: false}); });


function fname_s_0239(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}


$('#load_substrate_1').change(fname_s_0240);	
$('[nameId="assign_size_substrate"]').mousedown(function () { fname_s_0317(); });
$('[nameId="button_delete_substrate"]').mousedown(function () { fname_s_0320(); }); 

$('[nameId="input_rotate_substrate_45"]').mousedown(function () { fname_s_0318({angle: 45}); });
$('[nameId="input_rotate_substrate_90"]').mousedown(function () { fname_s_0318({angle: 90}); });


$('[nameId="input_transparency_substrate"]').on("input", function() { fname_s_0319({value: $(this).val()}); }); 


function fname_s_0240(e) 
{
	if (this.files[0]) 
	{		
		if (this.files[0].type == "image/png" || this.files[0].type == "image/jpeg")
		{
			var reader = new FileReader();
			reader.onload = function (e) 
			{
				$('#substrate_img').attr('src', e.target.result);						
				
				fname_s_0308({image: e.target.result});					
			}				

			reader.readAsDataURL(this.files[0]);  					
		}				
	}
}	 








$('#load_obj_1').change(fname_s_0241);

function fname_s_0241(e) 
{
	if (this.files[0]) 
	{		
		var reader = new FileReader();
		reader.onload = function (e) 
		{						
			fname_s_0273({data: e.target.result});
		}				

		reader.readAsArrayBuffer(this.files[0]);  									
	}
}


$('[nameId="butt_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"block"}); });

$('[nameId="button_close_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"none"}); });

$('[nameId="butt_load_obj_2"]').mousedown(function () { fname_s_0274(); });


});












function fname_s_0242()
{
	var pivot = new THREE.Object3D();
	pivot.userData.pivot = {};
	pivot.userData.pivot.active = { axis: '', startPos: new THREE.Vector3(), dir: new THREE.Vector3(), qt: new THREE.Quaternion() };
	pivot.userData.pivot.obj = null;
	
	var param = [];
	param[0] = {axis: 'x', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, 0, 0), color: 'rgb(247, 72, 72)', opacity: 0};
	param[1] = {axis: 'y', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(17, 255, 0)', opacity: 0};
	param[2] = {axis: 'z', size_1: new THREE.Vector3(0.6, 0.1, 0.1), size_2: new THREE.Vector3(0.6, 0.2, 0.2), rot: new THREE.Vector3(0, Math.PI/2, 0), color: 'rgb(72, 116, 247)', opacity: 0};
	param[3] = {axis: 'xz', size_1: new THREE.Vector3(0.3, 0.001, 0.3), pos: new THREE.Vector3(0.01, 0.0, -0.16), color: 'rgb(194, 194, 194)', opacity: 0.4};
	param[4] = {axis: 'center', size_1: new THREE.Vector3(0.03, 0.03, 0.03), pos: new THREE.Vector3(-0.015, 0.0, 0.0), color: 'rgb(102, 102, 102)', opacity: 1};
	
	
	for ( var i = 0; i < param.length; i++ )
	{
		var geometry = fname_s_0243(param[i].size_1.x, param[i].size_1.y, param[i].size_1.z);
		
		var obj = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: param[i].color, transparent: true, opacity: param[i].opacity, depthTest: false }) );
		obj.userData.tag = 'pivot';
		obj.userData.axis = param[i].axis;	
		obj.renderOrder = 2;
		
		if(param[i].pos) obj.position.set( param[i].pos.x, param[i].pos.y, param[i].pos.z );
		if(param[i].rot) obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );
		
		pivot.add( obj );
		
		if(param[i].size_2)
		{
			var axis = new THREE.Mesh( fname_s_0243(0.6, 0.02, 0.02), new THREE.MeshPhongMaterial({ color: param[i].color, depthTest: false, transparent: true, lightMap: lightMap_1 }) );	
			axis.renderOrder = 2;
			
			obj.add( axis );					
		}
	}	
		
	pivot.add( fname_s_0244({axis: 'z', pos: new THREE.Vector3(0,0,-0.6), rot: new THREE.Vector3(-Math.PI/2,0,0), color: 0x0000ff}) );
	pivot.add( fname_s_0244({axis: 'x', pos: new THREE.Vector3(0.6,0,0), rot: new THREE.Vector3(0,0,-Math.PI/2), color: 0xff0000}) );
	pivot.add( fname_s_0244({axis: 'y', pos: new THREE.Vector3(0,0.6,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00}) );
	
	scene.add( pivot );

	
	pivot.visible = false;
	
	return pivot;
}



function fname_s_0243(x, y, z)
{
	var geometry = new THREE.Geometry();
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(0,-y,z),
				new THREE.Vector3(0,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(0,y,-z),
				new THREE.Vector3(0,-y,-z),
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
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}



function fname_s_0244(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
		v[n].y = 0.25;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.25;
		n++;		
	}	

	
	var obj = new THREE.Mesh( fname_s_0208(v), new THREE.MeshPhongMaterial( { color : cdm.color, depthTest: false, transparent: true, lightMap: lightMap_1 } ) ); 
	obj.userData.tag = 'pivot';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);
	
	scene.add( obj );
	
	return obj;
}



function fname_s_0245( intersect )
{
	var obj = clickO.move = intersect.object;  
	
	var pivot = infProject.tools.pivot;
	
	var pos = pivot.position.clone();
	
	pivot.userData.pivot.active.startPos = pos;
	
	clickO.offset = new THREE.Vector3().subVectors( pos, intersect.point );
	
	var axis = obj.userData.axis;
	pivot.userData.pivot.active.axis = axis;	
		
	
	if(axis == 'x')
	{ 
		var dir = new THREE.Vector3();
		var dir = pivot.getWorldDirection(dir); 		
		pivot.userData.pivot.active.dir = new THREE.Vector3(-dir.z, 0, dir.x).normalize();	
		pivot.userData.pivot.active.qt = fname_s_0223( pivot.userData.pivot.active.dir ); 	
	}
	else if(axis == 'z')
	{ 
		var dir = new THREE.Vector3();
		pivot.userData.pivot.active.dir = pivot.getWorldDirection(dir); 
		pivot.userData.pivot.active.qt = fname_s_0223( pivot.userData.pivot.active.dir ); 	
	}
	else if(axis == 'y')
	{ 
		
		
		pivot.updateMatrixWorld();
		var dir = pivot.getWorldDirection(new THREE.Vector3());	   		
		var dir = new THREE.Vector3(-dir.z, 0, dir.x).normalize().cross( dir )
		
		pivot.userData.pivot.active.dir = dir;  
		pivot.userData.pivot.active.qt = fname_s_0223( pivot.userData.pivot.active.dir );	
	}	
	
	
	if(axis == 'xz' || axis == 'center')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
	}		 
	else
	{
		planeMath.quaternion.copy( pivot.userData.pivot.active.qt ); 
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));			
	}
	
	planeMath.position.copy( intersect.point );
} 





function fname_s_0246( event )
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var pivot = infProject.tools.pivot;
	var obj = pivot.userData.pivot.obj;
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );

	if(pivot.userData.pivot.active.axis == 'xz')
	{
		
	}		
	else
	{
		var subV = new THREE.Vector3().subVectors( pos, pivot.userData.pivot.active.startPos );
		var locD = fname_s_0221(subV, pivot.userData.pivot.active.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( pivot.userData.pivot.active.dir, locD.z );
		pos = new THREE.Vector3().addVectors( pivot.userData.pivot.active.startPos, v1 );			
	}
	
	 
	
	
	var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
	pivot.position.add( pos2 );
	
	
	obj.position.add( pos2 ); 
}




function fname_s_0247()
{
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var pVis = false;
	var gVis = false;

	
	if(pivot.visible) { pVis = true; }
	if(gizmo.visible) { gVis = true; }	
	if(!pVis && !gVis) { return; }
	
	var obj = null;
	
	if(pVis) obj = pivot.userData.pivot.obj;
	if(gVis) obj = gizmo.userData.gizmo.obj;
	if(!obj) return;
	
	if(camera == cameraTop)
	{		
		var scale = 1/camera.zoom+0.5;	
		
		if(pVis) pivot.scale.set( scale,scale,scale );
		if(gVis) gizmo.scale.set( scale,scale,scale );
	}
	else
	{
		var dist = camera.position.distanceTo(obj.position); 					
		var scale = dist/6;	
		
		if(pVis) pivot.scale.set( scale,scale,scale );
		if(gVis) gizmo.scale.set( scale,scale,scale );		
	}
}






function fname_s_0248( obj, intersect )
{	
	var obj = clickO.move = intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0249( event )
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );	
}




function fname_s_0250(obj)
{
	if(clickO.actMove)
	{		
		
	}	
}






function fname_s_0251( obj )
{
	
	obj.updateMatrixWorld();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
	
	
	
	if(1==2)	
	{
		var qt = new THREE.Quaternion();
	}
	else		
	{					
		var qt = obj.quaternion.clone();	 		
	}		
	
	
	
	if(infProject.settings.active.pg == 'pivot')
	{
		var pivot = infProject.tools.pivot;	
		pivot.visible = true;	
		pivot.userData.pivot.obj = obj;
		pivot.position.copy(pos);
		pivot.quaternion.copy(qt);
		
		if(camera == cameraTop)
		{
			pivot.children[1].visible = false;
			pivot.children[7].visible = false;
		}
		else
		{
			pivot.children[1].visible = true;
			pivot.children[7].visible = true;
		}
	}
	
	if(infProject.settings.active.pg == 'gizmo')
	{
		var gizmo = infProject.tools.gizmo;
					
		gizmo.position.copy( pos );
		
		gizmo.visible = true;
		gizmo.userData.gizmo.obj = obj;
		
		if(camera == cameraTop)
		{
			gizmo.children[1].visible = false;
			gizmo.children[2].visible = false;
			
			
		}
		else
		{
			gizmo.children[1].visible = true;
			gizmo.children[2].visible = true;			
		}

		gizmo.quaternion.copy( qt );
		
		fname_s_0264(obj);
		
		fname_s_0259(obj); 		
	}		
	
	fname_s_0247();
	
	fname_s_0283({obj: obj});	
}





	


function fname_s_0252(obj)
{ 
	if(obj.userData.tag != 'obj') return;
	
	clickO = resetPop.clickO(); 
	
	fname_s_0253(obj);
	
	var arr = [];
	
	arr[0] = obj;
	
	for(var i = 0; i < arr.length; i++)
	{	
		fname_s_0136({arr : infProject.scene.array.obj, o : arr[i]});
		fname_s_0281({uuid: arr[i].uuid, type: 'delete'});
		fname_s_0184(arr[i]);
		scene.remove(arr[i]); 
	}
	
	fname_s_0198();
}




function fname_s_0253(obj)
{
	if(!obj) return;
	if(!obj.userData.tag) return;	
	
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
				
	
	if(clickO.rayhit)
	{
		if(pivot.userData.pivot.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'pivot') return;
		
		if(gizmo.userData.gizmo.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'gizmo') return;
	}	
	
	
	
	pivot.visible = false;
	gizmo.visible = false;
	
	pivot.userData.pivot.obj = null;
	gizmo.userData.gizmo.obj = null;

	
	
	clickO.last_obj = null;
	
	fname_s_0283(); 	
	
	fname_s_0198();
}



 




function fname_s_0254(cdm)
{
	var obj = fname_s_0255();
	
	if(!obj) return;			
	
	infProject.settings.active.pg = cdm.mode;
	
	infProject.tools.pivot.visible = false;
	infProject.tools.gizmo.visible = false;
	
	if(infProject.settings.active.pg == 'pivot'){ infProject.tools.pivot.visible = true; }	
	if(infProject.settings.active.pg == 'gizmo'){ infProject.tools.gizmo.visible = true; }		

	infProject.tools.pivot.userData.pivot.obj = null;
	infProject.tools.gizmo.userData.gizmo.obj = null;

	fname_s_0251( obj ); 
}



function fname_s_0255(cdm)
{
	var obj = null;
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;	
	
	if(infProject.settings.active.pg == 'pivot'){ obj = pivot.userData.pivot.obj; }	
	if(infProject.settings.active.pg == 'gizmo'){ obj = gizmo.userData.gizmo.obj; }
	
	return obj;	
}






function fname_s_0256(cdm) 
{
	var obj = fname_s_0255();
	
	if(!obj) return;	
		
	var arr = [obj];		
	var arr2 = [];
	
	for(var i = 0; i < arr.length; i++)
	{ 
		var clone = arr2[arr2.length] = arr[i].clone();

		clone.userData.id = countId; countId++;
		
		infProject.scene.array.obj[infProject.scene.array.obj.length] = clone; 
		scene.add( clone );	

		fname_s_0281({o: clone, type: 'add'});	
	}	
	 
	
	fname_s_0253(obj);
	
	fname_s_0251( arr2[0] );
}




function fname_s_0257(cdm)
{
	var obj = fname_s_0255();
	
	if(!obj) return;


	var obj_1 = obj;		
	var diff_2 = obj_1.quaternion.clone().inverse();					
	var arr_2 = [obj_1];
	
	
	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].quaternion.premultiply(diff_2);		
		arr_2[i].updateMatrixWorld();		
	}
	
	
	var centerObj = obj_1.position.clone();
	

	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].position.sub(centerObj);
		arr_2[i].position.applyQuaternion(diff_2); 	
		arr_2[i].position.add(centerObj);
	}
	

	
	if(infProject.settings.active.pg == 'pivot'){ var tools = infProject.tools.pivot; }	
	if(infProject.settings.active.pg == 'gizmo'){ var tools = infProject.tools.gizmo; }	
}






 


function fname_s_0258()
{
	var count = 68; 
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle)*0.5;
		circle[i].z = Math.cos(angle)*0.5;
		
	}	

	
	var pipeSpline = new THREE.CatmullRomCurve3(circle);
	pipeSpline.curveType = 'catmullrom';
	pipeSpline.tension = 0;
	
	var geometry_1 = new THREE.TubeBufferGeometry( pipeSpline, circle.length, 0.03, 12, true );	
	var geometry_2 = new THREE.TubeBufferGeometry( pipeSpline, circle.length, 0.01, 12, true );
	
	
	var gizmo = new THREE.Object3D();
	gizmo.userData.gizmo = {};
	gizmo.userData.gizmo.obj = null;
	gizmo.userData.gizmo.active = { axis: '', startPos: new THREE.Vector3(), rotY: 0 };

	
	var param = [];
	param[0] = {axis: 'x', rot: new THREE.Vector3(0, 0, 0), color: 'rgb(17, 255, 0)'};
	param[1] = {axis: 'y', rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(247, 72, 72)'};
	param[2] = {axis: 'z', rot: new THREE.Vector3(Math.PI/2, 0, 0), color: 'rgb(72, 116, 247)'};	
	
	for ( var i = 0; i < param.length; i++ )
	{
		var material = new THREE.MeshBasicMaterial({ color: param[i].color, depthTest: false, transparent: true, opacity: 1.0 });
		material.visible = false;
		
		var obj = new THREE.Mesh( geometry_1, material );
		obj.userData.tag = 'gizmo'; 
		obj.userData.axis = param[i].axis;		
		obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );	
		
	
		var obj2 = new THREE.Mesh( geometry_2, new THREE.MeshPhongMaterial({ color: param[i].color, depthTest: false, transparent: true, clippingPlanes : [ new THREE.Plane() ], lightMap: lightMap_1 }) );
		obj2.renderOrder = 3;
		
		obj2.material.clippingPlanes[0].copy(new THREE.Plane());
		obj.add( obj2 );
		
		
		gizmo.add( obj );
	}
	
	scene.add( gizmo );

	
	gizmo.visible = false;
	
	
	var geometry = new THREE.SphereGeometry( 0.98*0.5, 32, 32 );
	var material = new THREE.MeshPhongMaterial( {color: 0x000000, depthTest: false, transparent: true, opacity: 0.1} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.renderOrder = 3;
	gizmo.add( sphere );
	
	return gizmo;
}






function fname_s_0259( objPop ) 
{
	var plane = new THREE.Plane();	
	
	if(camera == cameraTop)
	{
		plane = new THREE.Plane(new THREE.Vector3(0,1,0), 100);
		infProject.tools.gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);		
	}
	else
	{
		var group = new THREE.Group();
		group.position.copy(infProject.tools.gizmo.position);		
		group.lookAt(camera.position);
		group.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);
		group.updateMatrixWorld();
		
		
		
		
		
		
		plane.applyMatrix4(group.matrixWorld);	
		
		infProject.tools.gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);
		infProject.tools.gizmo.children[1].children[0].material.clippingPlanes[0].copy(plane);
		infProject.tools.gizmo.children[2].children[0].material.clippingPlanes[0].copy(plane);	
		

		
	}

}






function fname_s_0260( intersect )
{			
	var gizmo = infProject.tools.gizmo;
	
	clickO.move = intersect.object; 	

	var obj = gizmo.userData.gizmo.obj;			
	var axis = intersect.object.userData.axis;
	gizmo.userData.gizmo.active.axis = axis;
	
	
	
	obj.updateMatrixWorld();
	gizmo.userData.gizmo.active.startPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			

	
	if(axis == 'y')
	{
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = -Math.PI/2;
	}	
	else if(axis == 'z')
	{	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI;
	}
	else if(axis == 'x')
	{
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	planeMath.position.copy( gizmo.position );		
	
	if(camera == cameraTop)
	{
		planeMath.rotation.set(Math.PI/2, 0, 0);
	}
	else
	{
		fname_s_0261(obj, dr, rotY, false);
	}
	
	
	function fname_s_0261(obj, dr, rotY, global)
	{
		if(global)	
		{
			planeMath.quaternion.copy( new THREE.Quaternion().setFromAxisAngle( dr, rotY ) );
		}
		else		
		{
			var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );							
			var q2 = obj.getWorldQuaternion(new THREE.Quaternion()).clone().multiply( quaternion );			
			planeMath.quaternion.copy( q2 );																		
		}
	}

	
	planeMath.updateMatrixWorld();
	var dir = planeMath.worldToLocal( intersect.point.clone() );	
	gizmo.userData.gizmo.active.rotY = Math.atan2(dir.x, dir.y);	
}




function fname_s_0262( event )
{	
	var intersects = fname_s_0215( event, planeMath, 'one' );	 	 
	if(intersects.length == 0) return;
	
	
	var gizmo = infProject.tools.gizmo;
	
	var obj = gizmo.userData.gizmo.obj;  
	var axis = gizmo.userData.gizmo.active.axis;
	
	if(axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
	else if(axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
	else if(axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
	
	
	
	var dir = planeMath.worldToLocal( intersects[ 0 ].point.clone() );	
	var rotY = Math.atan2(dir.x, dir.y);
	
	
	
	if(camera == cameraTop) 
	{ 
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - gizmo.userData.gizmo.active.rotY);		 
	}
	else 
	{ 		
		fname_s_0263({obj: [obj], dr: dr, rotY: rotY, centerO: obj});		 
	}		
	
	
	function fname_s_0263(cdm)
	{
		var centerO = cdm.centerO;
		var arr = cdm.obj;
		var dr = cdm.dr;
		var rotY = cdm.rotY;		
		
		centerO.updateMatrixWorld();		
		var v1 = centerO.localToWorld( dr.clone() );
		var v2 = centerO.getWorldPosition(new THREE.Vector3());
		var dir = new THREE.Vector3().subVectors(v1, v2).normalize();	

		for(var i = 0; i < arr.length; i++)
		{
			arr[i].position.sub(gizmo.userData.gizmo.active.startPos);
			arr[i].position.applyAxisAngle(dir, rotY - gizmo.userData.gizmo.active.rotY); 
			arr[i].position.add(gizmo.userData.gizmo.active.startPos);				
			
			arr[i].rotateOnWorldAxis(dir, rotY - gizmo.userData.gizmo.active.rotY);								
		}		
	}
	
			
	
	gizmo.userData.gizmo.active.rotY = rotY; 
	
	
	if(camera != cameraTop) 
	{ 
		gizmo.rotation.copy( obj.rotation );		 
	}
	
	
	fname_s_0264(obj);
}





function fname_s_0264(obj) 
{				
	$('[nameId="object_rotate_X"]').val( Math.round( THREE.Math.radToDeg(obj.rotation.x) ) );
	$('[nameId="object_rotate_Y"]').val( Math.round( THREE.Math.radToDeg(obj.rotation.y) ) );
	$('[nameId="object_rotate_Z"]').val( Math.round( THREE.Math.radToDeg(obj.rotation.z) ) );	
}





function fname_s_0265()
{
	var arr = [];		
	
	arr[0] =
	{
		lotid : 1,
		url : infProject.path+'import/wm_wind_1.fbx', 
		name : 'окно',
		planeMath : 1.5,
		material : true,
		stopUI: true,
	}
	
	arr[1] =
	{	
		lotid : 2,
		url : infProject.path+'import/furn_1.fbx', 
		name : 'диван',
		planeMath : 0.1,
	}	
	
	arr[2] =
	{
		lotid : 3,
		url : infProject.path+'import/wm_wind_2.fbx', 
		name : 'окно',
		planeMath : 1.5,
		material : true,
		stopUI: true,
	}
	
	arr[3] =
	{
		lotid : 4,
		url : infProject.path+'import/vm_door_1.fbx', 
		name : 'дверь',
		planeMath : 1.0,
		material : true,
		stopUI: true,
	}

	arr[4] =
	{
		lotid : 5,
		url : infProject.path+'import/vm_furn_2.fbx', 
		name : 'кухня',
		planeMath : 0.1,
	}	
	
	arr[5] =
	{
		lotid : 6,
		url : infProject.path+'import/vm_furn_3.fbx', 
		name : 'шкаф',
		planeMath : 0.1,
	}	

	arr[6] =
	{
		lotid : 7,
		url : infProject.path+'import/vm_furn_4.fbx', 
		name : 'кухня +',
		planeMath : 0.0,
	}

	arr[7] =
	{
		lotid : 8,
		url : infProject.path+'import/vm_light_point_1.fbx', 
		name : 'светильник',
		type: 'light point',
		planeMath : infProject.settings.height - 0.05,
	}

	arr[8] =
	{
		lotid : 9,
		url : infProject.path+'import/vm_furn_5.fbx', 
		name : 'унитаз',
		planeMath : 0.0,
	}	
	
	arr[9] =
	{
		lotid : 10,
		url : infProject.path+'import/vm_furn_6.fbx', 
		name : 'комод',
		planeMath : 0.0,
	}		
	
	for(var i = 0; i < arr.length; i++)
	{
			}
	
	
	return arr;
}



function fname_s_0266()
{
	var arr = [];	 	
	
	arr[0] =
	{
		url : infProject.path+'img/load/floor_1.jpg', 
	}
	
	arr[1] =
	{
		url : infProject.path+'img/load/w1.jpg', 
	}

	arr[2] =
	{
		url : infProject.path+'img/load/kirpich.jpg', 
	}

	arr[3] =
	{
		url : infProject.path+'img/load/beton.jpg', 
	}	

	arr[4] =
	{
		url : infProject.path+'img/load/w2.jpg', 
	}

	arr[5] =
	{
		url : infProject.path+'img/load/f1.jpg', 
	}

	arr[6] =
	{
		url : infProject.path+'img/load/f2.jpeg', 
	}

	arr[7] =
	{
		url : infProject.path+'img/load/f3.jpg', 
	}	
	
	return arr;
}


function fname_s_0267(cdm)
{
	var lotid = cdm.lotid;
	
	
	for(var i = 0; i < infProject.catalog.obj.length; i++)
	{
		if(lotid == infProject.catalog.obj[i].lotid)
		{  
			return infProject.catalog.obj[i];
		}
	}
	
	return null;
}



function fname_s_0268(cdm)
{ 
			
	
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;
	
	var inf = fname_s_0267({lotid: lotid});

	if(!inf) return;		
	var obj = fname_s_0269({lotid: lotid});
	
	if(cdm.loadFromFile){ obj = null; }
	
	if(obj)
	{ 
		inf.obj = obj.clone();
		
		if(obj) { fname_s_0271(inf, cdm); }
	}
	else
	{
	
		var loader = new THREE.FBXLoader();
		loader.load( inf.url, function ( object ) 						
		{ 
						
			var obj = object.children[0];
			
			var obj = fname_s_0270({lotid: lotid, obj: obj});
			
			if(cdm.loadFromFile)				{
				fname_s_0192({lotid: lotid, furn: cdm.furn});
			}
			else								{
				inf.obj = obj;
				
				fname_s_0271(inf, cdm);							
			}
		});
	
	}
	
	
}





function fname_s_0269(cdm)
{
	var lotid = cdm.lotid;									var arrObj = infProject.scene.array.base;			
	for(var i = 0; i < arrObj.length; i++)
	{
		if(arrObj[i].lotid == lotid)
		{
			return arrObj[i].obj;
		}

	}
	
	return null;
}



function fname_s_0270(cdm)
{
	var lotid = cdm.lotid;									var obj = cdm.obj;
	var base = infProject.scene.array.base;				
	for(var i = 0; i < base.length; i++)
	{
		if(base[i].lotid == lotid)
		{  
			return obj;
		}
	}

	
	var geometries = [];
	
		obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.updateMatrix();
			child.updateMatrixWorld();
			child.parent.updateMatrixWorld();							
			
			var geometry = child.geometry.clone();
			geometry.applyMatrix4(child.parent.matrixWorld);
			geometries.push(geometry);						
	
			child.castShadow = true;	
			child.receiveShadow = true;				
		}
	});	
	
	
	var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([obj.geometry]); 
	var mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([obj.children[0].geometry]);
	
	
	
			
		
	base[base.length] = {lotid: lotid, obj: obj.clone()};

	return obj;
}




function fname_s_0271(inf, cdm)
{
		if(cdm.wd)
	{  
		fname_s_052(inf, cdm);
		return;
	}
	
	var obj = inf.obj;
	
	if(cdm.pos){ obj.position.copy(cdm.pos); }
	else if(inf.planeMath)
	{ 
		obj.position.y = inf.planeMath;
		planeMath.position.y = inf.planeMath; 
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld(); 
	}
	
		if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
	
	if(cdm.id){ obj.userData.id = cdm.id; }
	else { obj.userData.id = countId; countId++; }
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = cdm.lotid;
	obj.userData.obj3D.nameRus = inf.name;
	obj.userData.obj3D.type = '';
	obj.userData.obj3D.helper = null;
	

	if(inf.type)
	{
		if(inf.type == 'light point')
		{
			var intensity = 1;
			if(cdm.light)
			{
				if(cdm.light.intensity) { intensity = cdm.light.intensity; }
			}
			fname_s_0272({obj: obj, intensity: intensity}); 
		}
	}		
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );
	 
	fname_s_0281({o: obj, type: 'add'});		
	if(cdm.cursor) { clickO.move = obj; } 
	
	fname_s_0195();

}


function fname_s_0272(cdm)
{
	var obj = cdm.obj;
	obj.userData.obj3D.type = 'light point';
	
	
	var light = new THREE.PointLight( 0xffffff, cdm.intensity, 10 );
	
	light.castShadow = true;            	scene.add( light );
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.castShadow = false;	
			child.receiveShadow = false;				
		}
	});	
	
	light.decay = 2;

		light.shadow.mapSize.width = 1048;  	light.shadow.mapSize.height = 1048; 	light.shadow.camera.near = 0.01;       	light.shadow.camera.far = 10;      	
	light.position.set(0, -0.01, 0);

	if(infProject.settings.light.type == 'global')
	{
		light.visible = false;
	}
	
	
	obj.add( light );

	infProject.scene.light.lamp[infProject.scene.light.lamp.length] = light;
	
	
	if(1==2)
	{
		var spotLight = new THREE.SpotLight( 0xffffff );	

		spotLight.castShadow = true;

		spotLight.angle = Math.PI / 2 - 0.1;
		spotLight.penumbra = 0.05;
		spotLight.decay = 2;
		spotLight.distance = 10;	

		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 4048;
		spotLight.shadow.mapSize.height = 4048;
		spotLight.shadow.camera.near = 0.01;
		spotLight.shadow.camera.far = 10;


		
		if(1==2)
		{
			scene.add( spotLight );
			scene.add( spotLight.target );
			
			spotLight.position.copy(obj.position);
			spotLight.target.position.set(obj.position.x, -1, obj.position.z);		
		}
		else
		{
			spotLight.position.set(0, -0.05, 0);
			spotLight.target.position.set(0, -1, 0);		
			
			obj.add( spotLight );
			obj.add( spotLight.target );	
		}
		
		
		
		if(1==1)
		{
			spotLightCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
			scene.add( spotLightCameraHelper );	

			spotLightHelper = new THREE.SpotLightHelper( spotLight );
			scene.add( spotLightHelper );		

			obj.userData.obj3D.helper = [spotLightCameraHelper];
		}
		
	}

}




function fname_s_0273(cdm)
{

	if(1==1)		{
		var loader = new THREE.GLTFLoader();
		loader.parse( cdm.data, '', function ( obj ) 						
		{ 
						fname_s_0275({obj: obj.scene});
		});
		
	}
	else		{
		var loader = new THREE.FBXLoader();
		var obj = loader.parse( cdm.data );		
		fname_s_0275({obj: obj});			
	}


}


function fname_s_0274()
{	
	var url = $('[nameId="input_link_obj_1"]').val(); 
	var url = url.trim();
	
				
	if(1==1)		{
		var loader = new THREE.GLTFLoader();
		loader.load( url, function ( obj ) 						
		{ 
						fname_s_0275({obj: obj.scene});
		});			
	}
	else		{
		var loader = new THREE.FBXLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			fname_s_0275({obj: obj});
		});			
	}
}


var contourPoint = [];
var modelGlb = null;
var modelGlbJson = null;

function fname_s_0275(cdm)
{
	$('[nameId="window_main_load_obj"]').css({"display":"none"});
	fname_s_0181();
	
	contourPoint = [];
	modelGlb = null;
	
	var obj = cdm.obj;
	
	var obj = obj.children[0];		
	obj.position.y = 1;	

	planeMath.position.y = 1; 
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.updateMatrixWorld(); 	
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = 0;
	obj.userData.obj3D.nameRus = 'неизвестный объект';
	obj.userData.obj3D.type = '';
 
	
	
	var geometries = [];
	
		obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			
			geometries.push(child.geometry);						
	
			child.castShadow = true;	
			child.receiveShadow = true;				
		}
	});		
	

	obj.material.visible = false;	
	
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );
	

	
	if(1==1)
	{
		var options = 
		{
			trs: true,
			onlyVisible: false,
			truncateDrawRange: true,
			binary: true,
			forceIndices: false,
			forcePowerOfTwoTextures: false,
			maxTextureSize: Number( 20000 ) 
		};
	
		var exporter = new THREE.GLTFExporter();

				exporter.parse( [obj], function ( gltf ) 
		{
			
			var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link );			
			
			if ( gltf instanceof ArrayBuffer ) 
			{ 
				 
								
				modelGlb = new Blob( [ gltf ], { type: 'application/octet-stream' } );
			}
			else
			{
				
				var gltf = JSON.stringify( gltf, null, 2 );
				
								
				modelGlb = gltf;
			}

			link.click();			
			
		}, options );
		
	}
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();
	
	var posCenter = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	var minX = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, 0) ).x;
	var minY = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) ).y;
	var minZ = obj.localToWorld( new THREE.Vector3(0, 0, obj.geometry.boundingBox.min.z) ).z;
	
	var maxX = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, 0) ).x;
	var maxY = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.max.y, 0) ).y;
	var maxZ = obj.localToWorld( new THREE.Vector3(0, 0, obj.geometry.boundingBox.max.z) ).z;	
	
	
	
	
	
	
	var arrP = [];
	
	for(var i = 0; i < obj.geometry.attributes.position.array.length; i+=3)
	{
		var x = obj.geometry.attributes.position.array[i];
		var y = obj.geometry.attributes.position.array[i+1];
		var z = obj.geometry.attributes.position.array[i+2];		
		
		arrP[arrP.length] = obj.localToWorld( new THREE.Vector3(x, y, z) );	
		
			}
	
			
	
		if(1==1)
	{
		var minX = 999999;
		var minY = 999999;
		var minZ = 999999;
		
		var maxX = -999999;
		var maxY = -999999;
		var maxZ = -999999;		
		
		for ( var i = 0; i < arrP.length; i++ )
		{
			if(arrP[i].x < minX) { minX = arrP[i].x; }
			if(arrP[i].x > maxX) { maxX = arrP[i].x; }
			
			if(arrP[i].y < minY) { minY = arrP[i].y; }
			if(arrP[i].y > maxY) { maxY = arrP[i].y; }
			
			if(arrP[i].z < minZ) { minZ = arrP[i].z; }
			if(arrP[i].z > maxZ) { maxZ = arrP[i].z; }
		}

				if(1==2)
		{
			minX -= posCenter.x;
			minY -= posCenter.y;
			minZ -= posCenter.z;
			
			maxX -= posCenter.x;
			maxY -= posCenter.y;
			maxZ -= posCenter.z;				
		}
		
		
					
	}
	
	
	
	if(1==1)
	{
		var geometry = new THREE.Geometry().fromBufferGeometry( obj.geometry.clone() );
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		var objX = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 }));
		objX.material.visible = false;
		
		objX.position.copy(obj.position);
		objX.rotation.copy(obj.rotation);
		scene.add(objX);
		
		infProject.scene.array.obj[infProject.scene.array.obj.length] = objX;

		objX.updateMatrixWorld();
		plane2.position.z = maxZ;
		
		var pMin = [];
		var pMax = [];
		
		while(maxZ > minZ) 
		{
			var pp = fname_s_0232({obj: objX, plane: plane2});
			
			var minX_2 = {val: 999999, num: 0};
			var maxX_2 = {val: -999999, num: 0};	
			
			for ( var i = 0; i < pp.length; i++ )
			{
				if(pp[i].x < minX_2.val) { minX_2.val = pp[i].x; minX_2.num = i; }
				if(pp[i].x > maxX_2.val) { maxX_2.val = pp[i].x; maxX_2.num = i; }
			}			
			
			pMin[pMin.length] = pp[minX_2.num];
			pMax[pMax.length] = pp[maxX_2.num];
			
			maxZ -= 0.01;
			plane2.position.z = maxZ;
		}
		
		var point_room = [];
		
		for ( var i = 0; i < pMax.length; i++ )
		{
			point_room[point_room.length] = pMax[i];
		}
		
		for ( var i = pMin.length - 1; i >= 0; i-- )
		{
			point_room[point_room.length] = pMin[i];
		}		
		
		contourPoint = point_room;
		
		
	}		
	
		if(1==2)
	{
		if(1==2)
		{
			var point_room = [];
			point_room[0] = new THREE.Vector2( -1, 1 );	
			point_room[1] = new THREE.Vector2( 1, 1 );	
			point_room[2] = new THREE.Vector2( 1, -1 );	
			point_room[3] = new THREE.Vector2( -1, -1 );			
		}
		
			 
		
		var shape = new THREE.Shape( point_room );
		var geometry = new THREE.ShapeGeometry( shape );		

		var material = new THREE.MeshPhongMaterial( { color : 0xe3e3e5 } );
		
		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.1 } );
		geometry.rotateX(-Math.PI / 2);
		var floor = new THREE.Mesh( geometry, material );	
		scene.add(floor);
		
		floor.position.x = -3;
		floor.position.y = 2;
		
		floor.geometry = new THREE.BufferGeometry().fromGeometry(floor.geometry);
		
		
		infProject.scene.array.obj[infProject.scene.array.obj.length] = floor;
	}
	
	
	
	cameraTop.position.x = obj.position.x;
	cameraTop.position.z = obj.position.z;
	
	
	var pos2 = new THREE.Vector3().subVectors( obj.position, infProject.camera.d3.targetPos );
	camera3D.position.x += pos2.x;
	camera3D.position.z += pos2.z;

	infProject.camera.d3.targetPos.x = obj.position.x;
	infProject.camera.d3.targetPos.z = obj.position.z;
	
	fname_s_0195();	
}













function fname_s_0276(cdm)
{
	
	for(var i = 0; i < infProject.catalog.obj.length; i++)
	{
		var o = infProject.catalog.obj[i];
		
		if(o.stopUI) continue;
		
		var str = 
		'<div class="right_panel_1_1_list_item" add_lotid="'+o.lotid+'">\
			<div class="right_panel_1_1_list_item_text">'
			+o.name+
			'</div>\
		</div>';
		
		$('[list_ui="catalog"]').append(str);
	}
	
}




function fname_s_0277(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_1"]').append(str);
	}	
}

function fname_s_0278(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_2"]').append(str);
	}	
}


function fname_s_0279(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_1"]').hide(); 
		$('[nameId="rp_block_wall_texture_1"]').show(); 		
	}
	else
	{
		$('[nameId="rp_catalog_texture_1"]').show(); 
		$('[nameId="rp_block_wall_texture_1"]').hide(); 		
	}
}


function fname_s_0280(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_2"]').hide(); 
		$('[nameId="rp_block_room_texture_1"]').show();  		
	}
	else
	{
		$('[nameId="rp_catalog_texture_2"]').show(); 
		$('[nameId="rp_block_room_texture_1"]').hide(); 		
	}
}



function fname_s_0281(cdm)
{
	if(cdm.type == 'add')
	{
		var obj = cdm.o;
		
		var tag = obj.userData.tag; 
		
		if(tag == 'obj')
		{   
			var str = 
			'<div class="right_panel_1_1_list_item" uuid="'+obj.uuid+'">\
			<div class="right_panel_1_1_list_item_text">'+obj.userData.obj3D.nameRus+'</div>\
			</div>';			
		}
		else
		{
			return;
		}
		
		$('[list_ui="wf"]').prepend(str);
		
		var q = $('[list_ui="wf"]')[0].children[0];
		q.uuid = obj.uuid;
		
		infProject.ui.list_wf[infProject.ui.list_wf.length] = q;	
	}
	
	if(cdm.type == 'delete')
	{
		for(var i = 0; i < infProject.ui.list_wf.length; i++)
		{
			if(infProject.ui.list_wf[i].uuid == cdm.uuid) { infProject.ui.list_wf[i].remove(); break; }
		}				
	}	
}



function fname_s_0282(cdm)
{
	$('[nameId="wrap_img"]').hide();
	$('[nameId="wrap_catalog"]').hide();
	$('[nameId="wrap_list_obj"]').hide();
	$('[nameId="wrap_object"]').hide();
	$('[nameId="wrap_plan"]').hide();
	
	infProject.scene.substrate.active = null;
	fname_s_0305({visible: false});
	
	var name = '';
	
	
	if(cdm.el) { name = cdm.el.attributes.nameId.value; }
	else if(cdm.name) { name = cdm.name; }
	else if(cdm.current) { name = infProject.ui.right_menu.active; }
	
	
	if(name == "button_wrap_img") 
	{
		$('[nameId="wrap_img"]').show();
		fname_s_0219();
		infProject.scene.substrate.active = infProject.scene.substrate.floor[0].plane;
		fname_s_0305({visible: true});
	}	
	if(name == "button_wrap_catalog") 
	{
		$('[nameId="wrap_catalog"]').show();
	}
	if(name == "button_wrap_list_obj") 
	{
		$('[nameId="wrap_list_obj"]').show();
	}
	if(name == "button_wrap_object") 
	{
		$('[nameId="wrap_object"]').show(); 
	}
	if(name == "button_wrap_plan") 
	{
		$('[nameId="wrap_plan"]').show();
	}

	infProject.ui.right_menu.active = name;
}



function fname_s_0283(cdm) 
{
	$('[nameId="wrap_object_1"]').hide();
	
	$('[nameId="rp_bl_light"]').hide();
	$('[nameId="bl_object_3d"]').hide();
	$('[nameId="rp_menu_wall"]').hide();
	$('[nameId="rp_menu_point"]').hide();
	$('[nameId="rp_item_wd_h1"]').hide();
	$('[nameId="rp_menu_wd"]').hide();
	$('[nameId="rp_menu_room"]').hide();
	
	if(!cdm) { cdm = {}; }  
	
	var obj = cdm.obj;
	
	if(!obj) return;
	
	if(obj.userData.tag == 'point')
	{
		$('[nameId="rp_menu_point"]').show();
	}	
	else if(obj.userData.tag == 'wall')
	{
		$('[nameId="rp_menu_wall"]').show();
		$('[nameId="size_wall_width_1"]').val(obj.userData.wall.width);
		
		fname_s_0279({type: 1});
		fname_s_0288({obj: obj});
		
		fname_s_0172({label : obj.label[1], text : "A", sizeText : 85, color : 'rgba(0,0,0,1)', str: true});
		fname_s_0172({label : obj.label[0], text : "B", sizeText : 85, color : 'rgba(0,0,0,1)', str: true});
	}
	else if(obj.userData.tag == 'door')
	{
		$('[nameId="rp_menu_wd"]').show();
	}
	else if(obj.userData.tag == 'window')
	{
		$('[nameId="rp_item_wd_h1"]').show();
		$('[nameId="rp_menu_wd"]').show();
	}	
	else if(obj.userData.tag == 'obj')
	{
		if(obj.userData.obj3D.type == "light point")
		{
			$('[nameId="rp_bl_light"]').show();
			fname_s_0199({value: obj.children[1].intensity});			
		}
		    
		$('[nameId="bl_object_3d"]').show();
	}	
	else if(obj.userData.tag == 'room')
	{
		$('[nameId="rp_menu_room"]').show();
		
		fname_s_0280({type: 1});
		fname_s_0289({obj: obj});
	}		

	$('[nameId="wrap_object_1"]').show(); 	
	
}




function fname_s_0284(cdm)
{
	if(!cdm) { cdm = {}; }	
	if(!cdm.obj) return;
	
	var obj = cdm.obj;
	
	$('[nameId="rp_obj_name"]').val(obj.userData.obj3D.nameRus);
}




function fname_s_0285(cdm)
{
	var obj = cdm.obj;
	var nameId = cdm.nameId;
	var uuid = cdm.uuid;
	var nameRus = cdm.nameRus;
	
	
	var str = 
	'<div class="right_panel_1_1_list_item" uuid="'+uuid+'" group_item_obj="">\
	<div class="right_panel_1_1_list_item_text">'+nameRus+'</div>\
	</div>';	
	
	$('[nameId="'+nameId+'"]').append(str); 
	var el = $($('[nameId="'+nameId+'"]')[0].children[$('[nameId="'+nameId+'"]')[0].children.length - 1]);			
}




function fname_s_0286(cdm)
{
	
	$('[nameId="rp_wall_width_1"]').val(infProject.settings.wall.width);
	
	$('[nameId="rp_door_length_1"]').val(infProject.settings.door.width);
	$('[nameId="rp_door_height_1"]').val(infProject.settings.door.height);
	
	$('[nameId="rp_wind_length_1"]').val(infProject.settings.wind.width);
	$('[nameId="rp_wind_height_1"]').val(infProject.settings.wind.height);
	$('[nameId="rp_wind_above_floor_1"]').val(infProject.settings.wind.h1);
	
	$('[nameId="rp_floor_height"]').val(infProject.settings.height);
}



function fname_s_0287(cdm) 
{
	var el = cdm.el;
	var value = el.val();
	
	var inf = null;
	if(cdm.el[0] == $('[nameId="rp_wall_width_1"]')[0]) { var inf = { json: infProject.settings.wall, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_length_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_height_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'height' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_length_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_height_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'height' }; }	
	else if(cdm.el[0] == $('[nameId="rp_wind_above_floor_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'h1' }; }	
	else { return; }	
	
	var res = fname_s_0231({ value: value, unit: 1, limit: {min: 0.01, max: 5} });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num; 
}




function fname_s_0288(cdm) 
{
	$('[nameId="wall_texture_1img"]').attr('src', cdm.obj.userData.material[1].img);  
	$('[nameId="wall_texture_2img"]').attr('src', cdm.obj.userData.material[2].img);
}




function fname_s_0289(cdm) 
{
	var res = fname_s_0144({obj: cdm.obj});
	
	$('[nameId="wall_texture_1img"]').attr('src', res.floor.userData.material.img);  
	if(res.ceiling.userData.material) { $('[nameId="wall_texture_2img"]').attr('src', res.ceiling.userData.material.img); }
}




function fname_s_0290(cdm)
{  
	$.ajax
	({
		type: "POST",					
		url: infProject.path+'components/loadListProject.php',
		data: {"id": cdm.id },
		dataType: 'json',
		success: function(data)
		{  
			var html_load = '';
			var html_save = '';
			
			for(var i = 0; i < 5; i++)
			{
				if(data[i]) continue;
				
				data[i] = {id: 0, name: 'Пустой проект'}
			}
			
			for(var i = 0; i < data.length; i++)
			{				
				if(data[i].preview) 
				{
					html_save += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="save_pr_1"><img src="'+data[i].preview+'"></div>';
					html_load += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="load_pr_1"><img src="'+data[i].preview+'"></div>';
				}
				else
				{
					html_save += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="save_pr_1">'+data[i].name+'</div>';
					html_load += '<div class="window_main_menu_content_block_1" projectId="'+data[i].id+'" nameId="load_pr_1">'+data[i].name+'</div>';					
				}
			}
			
			$('[nameId="wm_list_save"]').html(html_save);
			$('[nameId="wm_list_load"]').html(html_load); 
	
			
			$('[nameId="save_pr_1"]').on('mousedown', function(){ fname_s_0291(this); });
			$('[nameId="load_pr_1"]').on('mousedown', function(){ fname_s_0292(this); });
		}
	});	
}


function fname_s_0291(el)
{
	fname_s_0187({id: el.attributes.projectid.value, upUI: true}); 
	
	$('[nameId="background_main_menu"]').hide();
}




function fname_s_0292(el)
{
	fname_s_0188({id: el.attributes.projectid.value}); 
	
	$('[nameId="background_main_menu"]').hide();
}




var wallVisible = [];


function fname_s_0293()
{
	wallVisible = [];
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < wall.length; i++ )
	{	
		var room = fname_s_0162( wall[i] );
		if(room.length == 1) 
		{ 	
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2] == wall[i]) { side = room[0].s[i2]; break; } }
			
			if(side == 0) { var n1 = 0; var n2 = 1; }
			else { var n1 = 1; var n2 = 0; }
			
			var x1 = wall[i].userData.wall.p[n2].position.z - wall[i].userData.wall.p[n1].position.z;
			var z1 = wall[i].userData.wall.p[n1].position.x - wall[i].userData.wall.p[n2].position.x;	
			var dir = new THREE.Vector3(x1, 0, z1).normalize();									
			wallVisible[wallVisible.length] = { wall : wall[i], normal : dir };  
		}
	}	
}



function fname_s_0294()
{ 
	var camPos = camera.getWorldDirection(new THREE.Vector3());
	
	camPos = new THREE.Vector3(camPos.x, 0, camPos.z).normalize();
	
	for ( var i = 0; i < wallVisible.length; i++ )
	{
		var wall = wallVisible[ i ].wall;		
		
		var res = camPos.dot( wallVisible[ i ].normal.clone() );
		
						
		if ( res > 0.5 )  
		{ 	
			wall.renderOrder = Math.abs(res);
			fname_s_0296({obj: wall, value: 1 - Math.abs(res)});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = false;				
			}
		}
		else
		{
			wall.renderOrder = 0;
			fname_s_0296({obj: wall, value: 1});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = true;
			}
		}
	}
}


function fname_s_0295()
{		
	for ( var i = 0; i < wallVisible.length; i++ ) 
	{ 
		var wall = wallVisible[i].wall;

		wall.renderOrder = 0;
		fname_s_0296({obj: wall, value: 1});
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
		{
			wall.userData.wall.arrO[i2].visible = true;
		}		
	}
}


function fname_s_0296(cdm)
{
	var obj = cdm.obj;
	
	if(!Array.isArray(obj.material)) { var arrM = [obj.material]; }
	else { var arrM = obj.material; }
	
	for( var i = 0; i < arrM.length; i++ ) 
	{
				if(cdm.value)
		{
			var value = (arrM[i].userData.opacity < cdm.value) ? arrM[i].userData.opacity : cdm.value;
			
			arrM[i].opacity = value;
		}
		
				if(cdm.default)
		{
			arrM[i].opacity = arrM[i].userData.opacity;
		}		
	}
	
}











function fname_s_0297()
{	
	var ruler = [];
	
	var material = new THREE.MeshPhongMaterial( { color : 0x00ff00, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	ruler[0] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[0].rotation.set(-Math.PI/2,0,0);
	ruler[0].userData.tag = "substrate_tool";
	ruler[0].userData.subtool = {};
	ruler[0].userData.subtool.num = 1;
	ruler[0].userData.subtool.line = null;
	ruler[0].visible = false;
	scene.add( ruler[0] );
	ruler[0].position.y = 0.01;	

	
	ruler[1] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[1].rotation.set(-Math.PI/2,0,Math.PI);
	ruler[1].userData.tag = "substrate_tool";
	ruler[1].userData.subtool = {};
	ruler[1].userData.subtool.num = 2;
	ruler[1].userData.subtool.line = null;
	ruler[1].visible = false;
	scene.add( ruler[1] );
	ruler[1].position.y = 0.01;
	ruler[1].position.x = 1;	


	
	var line = new THREE.Mesh( fname_s_0205(1, 0.01, 0.01), new THREE.MeshPhongMaterial( { color : 0x00ff00, lightMap : lightMap_1 } ) );
	var v = line.geometry.vertices; 
	v[0].y = v[3].y = v[4].y = v[7].y = -0.005;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.005;			
	line.geometry.verticesNeedUpdate = true;	
	line.visible = false;
	scene.add( line );	
	
	ruler[0].userData.subtool.line = line;
	ruler[1].userData.subtool.line = line;
	 	 
	
	fname_s_0298({ruler: ruler});

	return ruler;
}




function fname_s_0298(cdm)
{
	var ruler = cdm.ruler;
	var line = ruler[0].userData.subtool.line;
	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	
	var v = line.geometry.vertices;
	v[3].x = v[2].x = v[5].x = v[4].x = dist;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	line.geometry.verticesNeedUpdate = true; 
	line.geometry.elementsNeedUpdate = true;
	line.geometry.computeBoundingBox();
	line.geometry.computeBoundingSphere();	
	
	line.position.copy(ruler[0].position);
	
	
	var dir = new THREE.Vector3().subVectors( ruler[0].position, ruler[1].position ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	line.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	ruler[0].rotation.set(-Math.PI/2, 0, angleDeg + Math.PI);
	ruler[1].rotation.set(-Math.PI/2, 0, angleDeg);
	
	$('[nameId="input_size_substrate"]').val( Math.round(dist*100)/100 );
}



function fname_s_0299()
{
	var plane = infProject.scene.substrate.active;
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.set(plane.position.x + 0.5, plane.position.y + 0.01, plane.position.z);
	ruler[1].position.set(plane.position.x - 0.5, plane.position.y + 0.01, plane.position.z);

	fname_s_0298({ruler: ruler});	
}



function fname_s_0300(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var obj = new THREE.Mesh( fname_s_0205(5, 0.005, 5), new THREE.MeshPhongMaterial( { color : 0xcccccc, transparent: true, opacity: 1, lightMap : lightMap_1 } ) );
	obj.position.y = 0.01;
	obj.rotation.y = 0.0;
	obj.userData.tag = "substrate";
	obj.userData.substrate = { p: [], active: false, img: false };
	obj.visible = false;
	fname_s_0307({obj: obj, img: 'img/UV_Grid_Sm.jpg'}); 
	scene.add( obj );	
	
	if(cdm.pos)
	{
		if(cdm.pos.x) obj.position.x = cdm.pos.x;
		if(cdm.pos.y) obj.position.y = cdm.pos.y;
		if(cdm.pos.z) obj.position.z = cdm.pos.z;
	}
		
	var p = fname_s_0301({plane: obj});
	
	p[0].userData.subpoint = {plane: obj, x: p[1], z: p[3], p2: p[2], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[1].userData.subpoint = {plane: obj, x: p[0], z: p[2], p2: p[3], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[2].userData.subpoint = {plane: obj, x: p[3], z: p[1], p2: p[0], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[3].userData.subpoint = {plane: obj, x: p[2], z: p[0], p2: p[1], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	
	obj.userData.substrate.p = p;
	
	var n = infProject.scene.substrate.floor.length;
	infProject.scene.substrate.floor[n] = {plane: obj, point: p};
	infProject.scene.substrate.active = null;  
}





function fname_s_0301(cdm)
{	
	var plane = cdm.plane;
	
	function fname_s_0302()
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
			
		}

		return circle;
	}
	
	var circle = fname_s_0302();
	
	var n = 0;
	var v = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.01;
		n++;		
	}	

	var arr = [];
	var geometry = fname_s_0208(v);
	var material = new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry, material ); 
		obj.userData.tag = "substrate_point";
		obj.position.set(0, plane.position.y, 0);
		obj.userData.subpoint = {};
		
		obj.visible = false;	
		scene.add( obj );		
		
		arr[i] = obj;
	}		
	
	return arr;
}




function fname_s_0303(cdm)
{
	var plane = cdm.plane;
	var point = plane.userData.substrate.p;
	
	plane.geometry.computeBoundingBox();
	var pos1 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	var pos2 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos3 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos4 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	
	plane.updateMatrixWorld();			
	var pos1 = plane.localToWorld( pos1 );
	var pos2 = plane.localToWorld( pos2 );
	var pos3 = plane.localToWorld( pos3 );
	var pos4 = plane.localToWorld( pos4 );
	
	point[0].position.copy(pos1);
	point[1].position.copy(pos2);
	point[2].position.copy(pos3);
	point[3].position.copy(pos4);
	
	point[0].rotation.copy(plane.rotation);
	point[1].rotation.copy(plane.rotation);
	point[2].rotation.copy(plane.rotation);
	point[3].rotation.copy(plane.rotation);	
	
	
	for (var i = 0; i < point.length; i++)
	{
		var dir = new THREE.Vector3().subVectors( point[i].userData.subpoint.p2.position, point[i].position ).normalize(); 
		var qt = fname_s_0223( dir.clone() );
		
		point[i].userData.subpoint.dir = dir;
		point[i].userData.subpoint.qt = qt;
	}		
}






function fname_s_0304(cdm)
{
	if(!infProject.scene.substrate.active) return;
	 	
	var plane = infProject.scene.substrate.active;
	var point = plane.userData.substrate.p;	


	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}			
	
	for (var i = 0; i < point.length; i++)
	{
		
	}
	
	plane.visible = visible;
	
	fname_s_0305({visible: visible});
	
	fname_s_0195();
}



function fname_s_0305(cdm)
{
	var visible = cdm.visible;
	var plane = infProject.scene.substrate.active;
	var ruler = infProject.scene.substrate.ruler;
	
	if(visible)	
	{
		if(!plane.userData.substrate.img) { visible = false; }	
	}
	
	ruler[0].visible = visible;
	ruler[1].visible = visible;
	ruler[0].userData.subtool.line.visible = visible;	
}




function fname_s_0306(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0231({ value: cdm.value, unit: 1 });
	 
	if(!value) 
	{
		$('[nameId="rp_height_plane"]').val( plane.position.y );
		
		return;
	}	
	
	plane.position.y = value.num;	

	$('[nameId="rp_height_plane"]').val( value.num );
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.y = plane.position.y + 0.01;
	ruler[1].position.y = plane.position.y + 0.01;

	fname_s_0298({ruler: ruler});
	fname_s_0303({plane: plane});
	
	fname_s_0195();	
}




function fname_s_0307(cdm)
{
	
	
	var obj = cdm.obj;
	var img = cdm.img;
	
	if(cdm.pos)
	{
		obj.position.x = cdm.pos.x;
		obj.position.z = cdm.pos.z;
	}
	
	new THREE.TextureLoader().load(infProject.path+'/'+img, function ( image )  
	{
		var material = obj.material;
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		var ratioImg = texture.image.width/texture.image.height;
		
		if(cdm.scale)
		{
			fname_s_0316({obj: obj, size: {x: cdm.scale/2 * ratioImg, z: cdm.scale/2}});
		}
		else
		{
			fname_s_0316({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		}		
				
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
		
		fname_s_0303({plane: obj});
		
		fname_s_0212( obj );		
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		fname_s_0195();
	});			
}



function fname_s_0308(cdm)
{
	
	
	var image = new Image();
	image.src = cdm.image;
	
	var obj = infProject.scene.substrate.floor[0].plane;	
	if(!obj) return;
	
	infProject.scene.substrate.active = obj;
	
	image.onload = function() 
	{
		obj.userData.substrate.img = true;
		var material = obj.material;
		var texture = new THREE.Texture();
		texture.image = image;
		
		material.color = new THREE.Color( 0xffffff );
					
		texture.wrapS = THREE.MirroredRepeat;
		texture.wrapT = THREE.MirroredRepeat;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();		
		
		var ratioImg = texture.image.width/texture.image.height;

		fname_s_0316({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
				
		
		if(camera == cameraTop)
		{
			fname_s_0299();			
		}

		fname_s_0303({plane: obj});	
		
		fname_s_0212( obj );
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;		
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		fname_s_0319({value: 100});
		
		fname_s_0304({visible: true});
		
		fname_s_0195();
	};
		
}



function fname_s_0212( obj )
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





function fname_s_0310(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0311( event ) 
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		fname_s_0298({ruler: infProject.scene.substrate.ruler});	
	}
}




function fname_s_0312(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0313( event ) 
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		for (var i = 0; i < obj.userData.substrate.p.length; i++)
		{
			obj.userData.substrate.p[i].position.add( pos2 );
		}

		infProject.scene.substrate.ruler[0].position.add( pos2 );
		infProject.scene.substrate.ruler[1].position.add( pos2 );
		infProject.scene.substrate.ruler[0].userData.subtool.line.position.add( pos2 );		
	}
}





function fname_s_0314(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );

	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0315( event ) 
{	
	var intersects = fname_s_0215( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	
	if(1==1)
	{
		var ps = obj.userData.subpoint.p2.position;
		var dir = obj.userData.subpoint.dir;
		var qt = obj.userData.subpoint.qt;  
		
		var v1 = fname_s_0221( new THREE.Vector3().subVectors( ps, pos ), qt ); 
		if(v1.z < 0.5) { v1.z = 0.5; }   
		var v1 = new THREE.Vector3().addScaledVector( dir, -v1.z );
		pos = new THREE.Vector3().addVectors( ps, v1 );		
	}
	
	
	if(1 == 1)
	{
		obj.updateMatrixWorld();
		var posLoc = obj.worldToLocal( pos.clone() );	
		var posX = obj.localToWorld( new THREE.Vector3(posLoc.x, 0, 0) );
		var posX = new THREE.Vector3().subVectors( posX, obj.position );
		
		var posZ = obj.localToWorld( new THREE.Vector3(0, 0, posLoc.z) );
		var posZ = new THREE.Vector3().subVectors( posZ, obj.position );	

		obj.userData.subpoint.x.position.add( posX );
		obj.userData.subpoint.z.position.add( posZ );
	}		
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );

	
	
	if(1 == 1)
	{
		var plane = obj.userData.subpoint.plane;		
		var point = plane.userData.substrate.p;
		
		plane.updateMatrixWorld();			
		var ps1 = plane.worldToLocal( point[0].position.clone() );
		var ps2 = plane.worldToLocal( point[1].position.clone() );
		var ps3 = plane.worldToLocal( point[2].position.clone() );
		var ps4 = plane.worldToLocal( point[3].position.clone() );
		
		var x = new THREE.Vector3().subVectors( ps3, ps1 ).x;
		var z = new THREE.Vector3().subVectors( ps2, ps1 ).z;
		
		fname_s_0316({obj: plane, size: {x: x/2, z: z/2}});
		
		plane.position.add( pos2.clone().divideScalar( 2 ) );
	}
}






function fname_s_0316(cdm)
{
	var obj = cdm.obj; 
	var size = cdm.size;
	
	var v = obj.geometry.vertices; 		
	v[0].x = v[1].x = v[6].x = v[7].x = -size.x;
	v[3].x = v[2].x = v[5].x = v[4].x = size.x;

	v[0].y = v[3].y = v[4].y = v[7].y = -0.0025;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.0025;
	
	v[0].z = v[1].z = v[2].z = v[3].z = size.z;
	v[4].z = v[5].z = v[6].z = v[7].z = -size.z;		

	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;

	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
}





function fname_s_0317()
{
	var size = $('[nameId="input_size_substrate"]').val();
	var value = fname_s_0231({ value: size, unit: 1, abs: true, limit: {min: 0.01, max: 1000} });
	
	if(!value) 
	{
		$('[nameid="input_size_substrate"]').val(1);
		
		return;
	}	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	var ratio = value.num/dist;  
	
	
	
	plane.geometry.computeBoundingBox();	
	var x = (Math.abs(plane.geometry.boundingBox.max.x) + Math.abs(plane.geometry.boundingBox.min.x));
	var z = (Math.abs(plane.geometry.boundingBox.max.z) + Math.abs(plane.geometry.boundingBox.min.z));

	x /= 2;
	z /= 2;
	
	fname_s_0316({obj: plane, size: {x: x*ratio, z: z*ratio}});
		
	
	if(1==1)
	{	
		var v1 = plane.worldToLocal( ruler[0].position.clone() );
		var v2 = plane.worldToLocal( ruler[1].position.clone() );		
		
		var v1 = new THREE.Vector3().addScaledVector( v1, ratio );
		var v2 = new THREE.Vector3().addScaledVector( v2, ratio );
		
		var v1 = plane.localToWorld( v1.clone() ); 
		var v2 = plane.localToWorld( v2.clone() ); 
		
		ruler[0].position.x = v1.x;
		ruler[0].position.z = v1.z; 	
		ruler[1].position.x = v2.x;
		ruler[1].position.z = v2.z;	

		fname_s_0298({ruler: ruler});
	}
	
	$('[nameId="input_size_substrate"]').val( value.num );
	
	fname_s_0303({plane: plane});
	
	fname_s_0195();
}




function fname_s_0318(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0231({ value: cdm.angle, unit: 1 });
	 
	if(!value) 
	{
		var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));
		$('[nameId="input_rotate_substrate"]').val( rot );
		
		return;
	}	
	
	if(cdm.set)
	{
		plane.rotation.y = THREE.Math.degToRad(value.num * -1);
	}
	else
	{
		plane.rotation.y -= THREE.Math.degToRad(value.num);
	}	
	
	
	var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));

	$('[nameId="input_rotate_substrate"]').val( rot );
	
	fname_s_0303({plane: plane});
	
	fname_s_0195();
}





function fname_s_0319(cdm)
{
	var value = cdm.value;
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	plane.material.opacity = value/100;
	plane.material.needsUpdate = true; 					
	
	$('[nameId="input_transparency_substrate"]').val(value);
	
	fname_s_0195();	
}




function fname_s_0320(cdm)
{
	if(!cdm) cdm = {}; 
	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;		
	
	fname_s_0304({visible: false});	
	
	
	plane.userData.substrate.img = false;
	
	$('#substrate_img').attr('src', 'img/f0.png');
	$('[nameid="input_size_substrate"]').val(1);
}








function fname_s_0321()
{
	$.ajax
	({
		url: infProject.path+'auto_building/room2.json',
		type: 'POST',
		dataType: 'json',
		success: function(json)
		{ 
			fname_s_0322({json: json});
		},
	});	
}



function fname_s_0322(cdm)
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
				if(fname_s_034(pos, point[i3].pos, {kof: 0.1}))
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
	

	var geometry = fname_s_0205(0.2, 0.2, 0.2);
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
	
	
	
	
	
	
	for( var i = 0; i < arr.length; i++ )
	{
		for( var i2 = 0; i2 < arr[i].w.length; i2++ )
		{
			if(!arr[i].w[i2]) continue;
			
			var point1 = fname_s_0227( 'point', arr[i].w[i2].p[0].id );
			var point2 = fname_s_0227( 'point', arr[i].w[i2].p[1].id );	
			
			if(point1 == null) { point1 = fname_s_0213( arr[i].w[i2].p[0].pos, arr[i].w[i2].p[0].id ); }
			if(point2 == null) { point2 = fname_s_0213( arr[i].w[i2].p[1].pos, arr[i].w[i2].p[1].id ); }	

			var obj = fname_s_0214({p: [point1, point2], width: 0.01}); 
		}
	}
	
	for ( var i = 0; i < obj_point.length; i++ ) { fname_s_0104(obj_point[i]); }
	
	fname_s_07(infProject.scene.array.wall);	
	fname_s_0145();	
	
	fname_s_080();
	
	fname_s_0323();
	
	fname_s_0195();
}



function fname_s_0323()
{
	var floor = infProject.scene.array.floor;
	var inf = [];
	
	for ( var i = 0; i < floor.length; i++ )
	{
		for ( var i2 = 0; i2 < floor[i].userData.room.w.length; i2++ )
		{
			var wall = floor[i].userData.room.w[i2];
			var side = floor[i].userData.room.s[i2];
			
			var line = fname_s_0324({wall: wall, side: side});
			
			for ( var i3 = 0; i3 < floor.length; i3++ )
			{
				if(floor[i] == floor[i3]) continue;
				
				var cross = [];
				
				for ( var i4 = 0; i4 < floor[i3].userData.room.w.length; i4++ )
				{
					var res = fname_s_0325({dir: line, w2: floor[i3].userData.room.w[i4]});
					
					if(res) { cross[cross.length] = res; }
				}
				
				inf[inf.length] = {wall: wall, cross: []};
			}
		}
	}
	
	
	function fname_s_0324(cdm)
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
	
	
	
	function fname_s_0325(cdm)
	{
		var dir = cdm.dir;
		var w2 = cdm.w2;
		
		var p0 = dir.p1;
		var p1 = dir.p2;
		var p2 = w2.userData.wall.p[0].position;
		var p3 = w2.userData.wall.p[1].position;
		
		if( !fname_s_026(p0, p1, p2, p3) ) { return null; }		
		
		var pos = fname_s_0326(p0, p1, p2, p3);
		
		if(pos && 1==2)
		{ 
			var material = new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 1, depthTest: false }); 
			var cube = new THREE.Mesh( fname_s_0205(0.2, 0.2, 0.2), material );
			cube.position.set(pos.x, 1, pos.z);
			scene.add( cube ); 				
		}
		
		return pos;
	}


	
	function fname_s_0326(a1, a2, b1, b2)
	{
		var t1 = fname_s_024(a1.x, a1.z, a2.x, a2.z);
		var t2 = fname_s_024(b1.x, b1.z, b2.x, b2.z);

		var point = new THREE.Vector3();
		var f1 = fname_s_025(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001){ return null; } 
		
		point.x = fname_s_025(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = fname_s_025(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
		
		return point;
	}	
	
}






