$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { clickInterface(); });
$('[data-action="left_panel_1"]').mousedown(function () { clickInterface(); });


// переключаем разделы
$('[nameId="butt_main_menu"]').mousedown(function () { $('[nameId="background_main_menu"]').css({"display":"block"}); });
$('[nameId="button_load_1"]').mousedown(function () { changeMainMenuUI({value: 'button_load_1'}); });
$('[nameId="button_save_1"]').mousedown(function () { changeMainMenuUI({value: 'button_save_1'}); });


$('[nameId="camera_button"]').change(function() { clickInterface({button: $( this ).val()}); });




// переключаем кнопки в главном меню (сохрание/загрузка)
// прячем все, кроме выбранного раздела
function changeMainMenuUI(cdm)
{
	$('[nameId="menu_content_1_h1"]').hide();
	$('[wwm_1="button_load_1"]').hide();
	$('[wwm_1="button_save_1"]').hide();
	
	$('[wwm_1="'+cdm.value+'"]').show();	
}


$('[nameId="button_wrap_img"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_catalog"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_object"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_plan"]').mousedown(function () { changeRightMenuUI_1({el: this}); });




	

$('[nameId="showHideWall_1"]').on('mousedown', function(e) { showHideWallHeight_1(); });

	
$('[nameId="select_pivot"]').mousedown(function () { switchPivotGizmo({mode:'pivot'}); });
$('[nameId="select_gizmo"]').mousedown(function () { switchPivotGizmo({mode:'gizmo'}); });

$('[nameId="obj_rotate_reset"]').mousedown(function () { objRotateReset(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { copyObj(); });
$('[nameId="button_delete_obj"]').mousedown(function () { deleteObjectPop(clickO.last_obj); });


$('[data-action="wall"]').mousedown(function () { clickInterface({button:'point_1'}); });
$('[data-action="create_wd_2"]').mousedown(function () { clickInterface({button:'create_wd_2'}); });
$('[data-action="create_wd_3"]').mousedown(function () { clickInterface({button:'create_wd_3'}); });
$('[data-action="grid_show_1"]').mousedown(function () { clickInterface({button:'grid_show_1'}); });
$('[data-action="grid_move_1"]').mousedown(function () { clickInterface({button:'grid_move_1'}); });
$('[data-action="grid_link_1"]').mousedown(function () { clickInterface({button:'grid_link_1'}); });
$('[add_lotid]').mousedown(function () { clickInterface({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[data-action="screenshot"]').mousedown(function () { saveAsImage(); return false; }); 				





$('[data-action="deleteObj"]').mousedown(function () { detectDeleteObj(); return false; });
$('[data-action="addPointCenterWall"]').mousedown(function () { addPointCenterWall(); return false; });



$('input').on('focus', function () { actionInputUI({el: $(this), act: 'down'}); });
$('input').on('change', function () { actionInputUI({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function actionInputUI(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		console.log(cdm.act, infProject.activeInput);
	}
	
	if(cdm.act == 'up')
	{
		actionChangeInputUI();
	}
		
}


function actionChangeInputUI(cdm)
{
	if(infProject.activeInput == 'rp_floor_height')
	{
		changeAllHeightWall_1({ height: $('[nameId="rp_floor_height"]').val(), input: true, globalHeight: true });
	}
	else if(infProject.activeInput == 'rp_wall_width_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	



// нажали кнопку применить
$('[nameId="rp_button_apply"]').mousedown(function () 
{  
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	if(obj.userData.tag == 'wall')
	{
		var width = $('[nameid="size_wall_width_1"]').val();
		
		inputWidthOneWall({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'});		
	}
	else if(obj.userData.tag == 'window')
	{
		inputWidthHeightWD(clickO.last_obj);
	}
	else if(obj.userData.tag == 'door')
	{
		inputWidthHeightWD(clickO.last_obj);
	}	
});



// texture UI
$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	clickO.click.o = clickO.last_obj;
	showHideMenuTexture_1({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	clickO.click.o = clickO.last_obj;
	showHideMenuTexture_1({type: 2});
});

$('[nameId="rp_button_room_texture_1"]').mousedown(function () 
{ 
	clickO.click.o = clickO.last_obj; 
	showHideMenuTexture_2({type: 2}); 
});

$('[nameId="rp_button_room_texture_2"]').mousedown(function () 
{ 
	clickO.click.o = findNumberInArrRoom_2({obj: clickO.last_obj}).ceiling;
	showHideMenuTexture_2({type: 2}); 	
});


$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	showHideMenuTexture_1({type: 1});
});

$('[nameId="but_back_catalog_texture_2"]').mousedown(function () 
{ 
	showHideMenuTexture_2({type: 1});
});

$('[add_texture]').mousedown(function () 
{ 
	setTexture({obj: clickO.click.o, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true} ); 
}); 
// texture UI




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	clickInterface(); 
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


//  window_main_sett --->
$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { switchLight({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { switchFxaaPass({visible: this.checked}); });
//  <--- window_main_sett


//  modal_wind_3 --->

$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	
	

$('[nameId="button_check_reg_1"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });
$('[nameId="button_check_reg_2"]').mousedown(function () { changeMainMenuRegistMenuUI({el: this}); });	


// переключаем в главном меню в форме регистрация кнопки: вход/регистрация
function changeMainMenuRegistMenuUI(cdm)
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


	

$('[nameId="act_reg_1"]').mousedown(function () { checkRegDataIU(); });


// вход/регистрация пользователя (проверка правильности ввода данных почта/пароль)
function checkRegDataIU()
{
	//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
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
	
	mail.val(mail.val().trim());	// удаляем пробелы  
	pass.val(pass.val().trim());	// удаляем пробелы 
	
	// проверка почты
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
	
	
	// проверка пароля
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
	
	
	// данные введены верно
	if(flag_1 && flag_2)
	{ 
		inf_block.hide();
		
		//console.log();
		var type = $('[nameId="act_reg_1"]').attr("b_type");
		
		$.ajax
		({
			type: "POST",					
			url: infProject.path+'components/regUser.php',
			data: {"type": type, "mail": mail.val(), "pass": pass.val()},
			dataType: 'json',
			success: function(data)
			{  
				if(type=='reg_1')	// авторизация пользователя
				{
					if(data.success)
					{
						infProject.user.id = data.info.id;
						infProject.user.mail = data.info.mail;
						infProject.user.pass = data.info.pass;

						$('[nameId="reg_content_1"]').show();
						$('[nameId="reg_content_2"]').hide();

						getListProject({id: infProject.user.id});
					}
					else
					{
						if(data.err.desc)
						{
							console.log(data.err.desc);
							inf_str_1.html(data.err.desc);
							
							inf_block.show();
							inf_str_1.show();
							inf_str_1.show();
							inf_str_2.hide();													
						}
					}
				}
				else if(type=='reg_2')	// регистрация нового пользователя
				{
					if(data.success)
					{
						//inf_str_1.html("на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)");
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
							console.log(data.err.desc);
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
	else	// данные введены НЕ верно
	{  
		inf_block.show();
	}
};

//  <--- modal_wind_3 




//  right_panel --->

$('[nameId="button_show_panel_catalog"]').mousedown(function () { showHideCatalogMenuUI({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { showHideCatalogMenuUI({show: false}); });


// скрываем/показываем правое меню UI
function showHideCatalogMenuUI(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}


//  substrate
$('#load_substrate_1').change(readURL);	
$('[nameId="assign_size_substrate"]').mousedown(function () { assignSizeSubstrate(); });
$('[nameId="button_delete_substrate"]').mousedown(function () { deleteSubstrate(); }); 

$('[nameId="input_rotate_substrate_45"]').mousedown(function () { setRotateSubstrate({angle: 45}); });
$('[nameId="input_rotate_substrate_90"]').mousedown(function () { setRotateSubstrate({angle: 90}); });


$('[nameId="input_transparency_substrate"]').on("input", function() { setTransparencySubstrate({value: $(this).val()}); }); 


// загрузка img  с компьютера
function readURL(e) 
{
	if (this.files[0]) 
	{		
		if (this.files[0].type == "image/png" || this.files[0].type == "image/jpeg")
		{
			var reader = new FileReader();
			reader.onload = function (e) 
			{
				$('#substrate_img').attr('src', e.target.result);						
				
				setImgCompSubstrate({image: e.target.result});					
			}				

			reader.readAsDataURL(this.files[0]);  					
		}				
	}
}	 
//  substrate



//  <--- right_panel




// загрузка obj --->

$('#load_obj_1').change(readURL_2);

function readURL_2(e) 
{
	if (this.files[0]) 
	{		
		var reader = new FileReader();
		reader.onload = function (e) 
		{						
			loadInputFile({data: e.target.result});
		}				

		reader.readAsArrayBuffer(this.files[0]);  									
	}
}


$('[nameId="butt_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"block"}); });

$('[nameId="button_close_main_load_obj"]').mousedown(function () { $('[nameId="window_main_load_obj"]').css({"display":"none"}); });

$('[nameId="butt_load_obj_2"]').mousedown(function () { loadUrlFile(); });
// <--- загрузка obj


});







