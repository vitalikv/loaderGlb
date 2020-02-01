



// добавляем объекты в каталог UI 
function addObjInCatalogUI_1(cdm)
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



// добавляем текстыры в каталог UI 
function addTextureInCatalogUI_1(cdm)
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

function addTextureInCatalogUI_2(cdm)
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

// показываем/скрываем кнопки/список текстур для стен
function showHideMenuTexture_1(cdm)
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

// показываем/скрываем кнопки/список текстур для пола/потолка
function showHideMenuTexture_2(cdm)
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


// добавляем/обновляем/удаляем в список материалов новый объект, который добавляем в сцену UI
function updateListTubeUI_1(cdm)
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


// переключаем вкладки правой панели 
function changeRightMenuUI_1(cdm)
{
	$('[nameId="wrap_img"]').hide();
	$('[nameId="wrap_catalog"]').hide();
	$('[nameId="wrap_list_obj"]').hide();
	$('[nameId="wrap_object"]').hide();
	$('[nameId="wrap_plan"]').hide();
	
	infProject.scene.substrate.active = null;
	showHideSubstrateRuler({visible: false});
	
	var name = '';
	//var name_2 = infProject.ui.right_menu.active;
	
	if(cdm.el) { name = cdm.el.attributes.nameId.value; }
	else if(cdm.name) { name = cdm.name; }
	else if(cdm.current) { name = infProject.ui.right_menu.active; }
	
	
	if(name == "button_wrap_img") 
	{
		$('[nameId="wrap_img"]').show();
		deActiveSelected();
		infProject.scene.substrate.active = infProject.scene.substrate.floor[0].plane;
		showHideSubstrateRuler({visible: true});
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


// кликнули на obj, wd (показываем нужное меню и заполняем input)
function activeObjRightPanelUI_1(cdm) 
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
		
		showHideMenuTexture_1({type: 1});
		changeTextureWall_UI_1({obj: obj});
		
		upLabelCameraWall({label : obj.label[1], text : "A", sizeText : 85, color : 'rgba(0,0,0,1)', str: true});
		upLabelCameraWall({label : obj.label[0], text : "B", sizeText : 85, color : 'rgba(0,0,0,1)', str: true});
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
			sliderSunIntensity({value: obj.children[1].intensity});			
		}
		    
		$('[nameId="bl_object_3d"]').show();
	}	
	else if(obj.userData.tag == 'room')
	{
		$('[nameId="rp_menu_room"]').show();
		
		showHideMenuTexture_2({type: 1});
		changeTextureRoom_UI_1({obj: obj});
	}		

	$('[nameId="wrap_object_1"]').show(); 	
	
}



// при выделении объекта меняем боковое меню
function clickObjUI(cdm)
{
	if(!cdm) { cdm = {}; }	
	if(!cdm.obj) return;
	
	var obj = cdm.obj;
	
	$('[nameId="rp_obj_name"]').val(obj.userData.obj3D.nameRus);
}




function createTextUI_1(cdm)
{
	var obj = cdm.obj;
	var nameId = cdm.nameId;
	var uuid = cdm.uuid;
	var nameRus = cdm.nameRus;
	
	// добавляем в список группу	
	var str = 
	'<div class="right_panel_1_1_list_item" uuid="'+uuid+'" group_item_obj="">\
	<div class="right_panel_1_1_list_item_text">'+nameRus+'</div>\
	</div>';	
	
	$('[nameId="'+nameId+'"]').append(str); 
	var el = $($('[nameId="'+nameId+'"]')[0].children[$('[nameId="'+nameId+'"]')[0].children.length - 1]);			
}



// устанавливаем значения в input для вкладки план (окно/дверь/толщина стены/высота этажа)
function startRightPlaneInput(cdm)
{
	
	$('[nameId="rp_wall_width_1"]').val(infProject.settings.wall.width);
	
	$('[nameId="rp_door_length_1"]').val(infProject.settings.door.width);
	$('[nameId="rp_door_height_1"]').val(infProject.settings.door.height);
	
	$('[nameId="rp_wind_length_1"]').val(infProject.settings.wind.width);
	$('[nameId="rp_wind_height_1"]').val(infProject.settings.wind.height);
	$('[nameId="rp_wind_above_floor_1"]').val(infProject.settings.wind.h1);
	
	$('[nameId="rp_floor_height"]').val(infProject.settings.height);
}


// после изменения input для плана (окно/дверь/толщина стены/высота этажа)
function upRightPlaneInput_1(cdm) 
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
	
	var res = checkNumberInput({ value: value, unit: 1, limit: {min: 0.01, max: 5} });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num; 
}



// показываем текстыру у стены в правой панели
function changeTextureWall_UI_1(cdm) 
{
	$('[nameId="wall_texture_1img"]').attr('src', cdm.obj.userData.material[1].img);  
	$('[nameId="wall_texture_2img"]').attr('src', cdm.obj.userData.material[2].img);
}



// показываем текстыру у пола/потолка в правой панели
function changeTextureRoom_UI_1(cdm) 
{
	var res = findNumberInArrRoom_2({obj: cdm.obj});
	
	$('[nameId="wall_texture_1img"]').attr('src', res.floor.userData.material.img);  
	if(res.ceiling.userData.material) { $('[nameId="wall_texture_2img"]').attr('src', res.ceiling.userData.material.img); }
}



// получаем с сервера список проектов принадлежащих пользователю
function getListProject(cdm)
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
	
			
			$('[nameId="save_pr_1"]').on('mousedown', function(){ clickButtonSaveProjectUI(this); });
			$('[nameId="load_pr_1"]').on('mousedown', function(){ clickButtonLoadProjectUI(this); });
		}
	});	
}

// кликнули на кнопку сохранить проекта
function clickButtonSaveProjectUI(el)
{
	saveFile({id: el.attributes.projectid.value, upUI: true}); 
	
	$('[nameId="background_main_menu"]').hide();
}



// кликнули на кнопку загрузки проекта
function clickButtonLoadProjectUI(el)
{
	loadFile({id: el.attributes.projectid.value}); 
	
	$('[nameId="background_main_menu"]').hide();
}


