





<div class="right_panel_1" data-action ='right_panel_1' ui_1="" style="z-index: 1;">


	<div class="flex_column_1 right_panel_1_1" nameId="panel_catalog_1">
		<div class="flex_1 bottom_line_1">
			<div class="flex_1 relative_1 right_panel_1_item">
				<div class="right_panel_1_item_block" nameId="button_wrap_img">
					<div class="right_panel_1_item_block_text">
						план 
					</div>	
				</div>				
				<div class="right_panel_1_item_block" nameId="button_wrap_plan">
					<div class="right_panel_1_item_block_text">
						дом
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_object">
					<div class="right_panel_1_item_block_text">
						объект
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_catalog">
					<div class="right_panel_1_item_block_text">
						каталог
					</div>	
				</div>
				<div class="right_panel_1_item_block" nameId="button_wrap_list_obj" style="display: none;">
					<div class="right_panel_1_item_block_text">
						список
					</div>	
				</div>			
			</div>
			<div class="button_catalog_close" nameId="button_catalog_close">
				+
			</div>
		</div>
	
	
		
		<div class="flex_column_1" nameId="wrap_img" style="display: none;">
			<div class="right_panel_1_1_h">План</div>	
	
				<div class="substrate" nameId="substrate">

					<input name="file" type="file" accept="image/x-png,image/jpeg" id="load_substrate_1" class="input_load_substrate">
					<label for="load_substrate_1" class="button1 button_gradient_1" nameId="load_img_1">		
						загрузить план
					</label>

					<div class="prew_substrate">
						<img src="img/f0.png" id="substrate_img" alt=""/>
					</div>
					
					<div style="display: none;">
						<div class="substrate_block">
							прозрачность
						</div>	
						<input type="range" nameId="input_transparency_substrate" min="1" max="100" value="100">
					</div>	
					
					<div class="block_1" style="display: none;">
						<div class="substrate_block">
							вращение
						</div>
						
						
						
						<div class="flex_1">
							<input type="text" nameId="input_rotate_substrate" value=0>
							<div class="button1 button_gradient_1" nameId="input_rotate_substrate_45">
								45
							</div>

							<div class="button1 button_gradient_1" nameId="input_rotate_substrate_90">
								90
							</div>	
						</div>
					</div>	
					
					<div class="pr_plane_text_1">
						реальная длина
					</div>
					<input type="text" nameId="input_size_substrate" value=0>	

					<div class="button1 button_gradient_1" nameId="assign_size_substrate">
						применить
					</div>			

					<div class="button1 button_gradient_1" nameId="button_delete_substrate">
						удалить
					</div>

					<div class="button1 button_gradient_1" nameId="button_auto_building" style="margin-top: 60px;">
						автопостроение
					</div>						
				</div>	
	
	
		</div>
		
		<div class="flex_column_1" nameId="wrap_plan" style="display: none;">
			<div class="right_panel_1_1_h">Дом</div>
			
			
			<div class="flex_column_1 rp_item_plane">			
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							толщина
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wall_width_1" value="0">
					</div>
				</div>				
				
				<div>
					<div data-action ='wall' class="button1 button_gradient_1">Стена</div>
				</div>
			</div>				
			
			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							длина
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_length_1" value="0">
					</div>
				</div>
				
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_height_1" value="0">
					</div>
				</div>				
				
				<div>
					<div data-action ='create_wd_2' class="button1 button_gradient_1">Дверь</div>
				</div>
			</div>

			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							длина
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_length_1" value="0">
					</div>
				</div>
				
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_height_1" value="0">
					</div>
				</div>	

				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							над полом
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_above_floor_1" value="0">
					</div>
				</div>					
				
				<div>
					<div data-action ='create_wd_3' class="button1 button_gradient_1">Окно</div>
				</div>
			</div>			
					
		
			<div class="flex_1 rp_item_plane">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						высота этажа
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_floor_height" value="0">
				</div>
			</div>			
		</div>
		
		
		<div nameId="wrap_object">
		
			<div class="right_panel_1_1_h">Объект</div>
			<div class="flex_column_1" nameId="wrap_object_1" style="display: none;">
				
				
				<div class="rp_obj_name">
					<input type="text" nameId="rp_obj_name" value="Название">					
				</div>
				
				
				<div nameId="rp_menu_point" style="display: none;"> 
					<div class="flex_column_1">															
						<div>
							<div class="button1 button_gradient_1" data-action="deleteObj">Удалить</div>
						</div>						
					</div>	
				</div>				
				
				
				<div nameId="rp_menu_wall" style="display: none;"> 
					<div class="flex_column_1">			
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									толщина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size_wall_width_1" value="0">
							</div>
						</div>				
						
						<div>
							<div class="button1 button_gradient_1" nameId="rp_button_apply">Применить</div>
						</div>						
					</div>

					<div class="flex_column_1">
						<div class="right_panel_1_1_h">
							Текстура
						</div>
						<div class="flex_1 texture_wall" nameId="rp_block_wall_texture_1">
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_wall_texture_1">
								<div class="texture_wall_2_text">A</div>							
								<img src="<?=$path?>img/load/kirpich.jpg" nameId="wall_texture_1img">	
							</div>
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_wall_texture_2">
								<div class="texture_wall_2_text">B</div>
								<img src="<?=$path?>img/load/kirpich.jpg" nameId="wall_texture_2img">	
							</div>							
						</div>
					</div>

					<div style="display: none;" nameId="rp_catalog_texture_1">
						<div class="button1 button_gradient_1" style="margin-top: 20px;" nameId="but_back_catalog_texture_1">Закрыть</div>
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" list_ui="catalog_texture_1">
								
							</div>				 							
						</div>						
					</div>
					
					<div>
						<div class="button1 button_gradient_1" style="margin-top: 20px;" data-action="deleteObj">Удалить</div>
					</div>			 	
					
				</div>
				
				
				
				<div nameId="rp_menu_room" style="display: none;"> 
					<div class="flex_column_1">
						<div class="right_panel_1_1_h">
							Текстура
						</div>
						<div class="flex_1 texture_wall" nameId="rp_block_room_texture_1">
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_room_texture_1">
								<div class="texture_wall_2_text">Пол</div>							
								<img src="<?=$path?>img/load/kirpich.jpg" nameId="wall_texture_1img">	
							</div>
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_room_texture_2">
								<div class="texture_wall_2_text">Потолок</div>
								<img src="#" nameId="wall_texture_2img">	
							</div>							
						</div>
					</div>

					<div style="display: none;" nameId="rp_catalog_texture_2">
						<div class="button1 button_gradient_1" style="margin-top: 20px;" nameId="but_back_catalog_texture_2">Закрыть</div>
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" list_ui="catalog_texture_2">
								
							</div>				 							
						</div>
					</div>
				</div>					
				

				<div class="flex_column_1" nameId="rp_menu_wd" style="display: none;">
					<div class="flex_1">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								длина
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-length" value="0">
						</div>
					</div>
					
					<div class="flex_1">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								высота
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-height" value="0">
						</div>
					</div>	

					<div class="flex_1" nameId="rp_item_wd_h1" style="display: none;">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								над полом
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wd_h1" value="0">
						</div>
					</div>					
					
					<div>
						<div class="button1 button_gradient_1" nameId="rp_button_apply">Применить</div>
					</div>
					
					<div>
						<div class="button1 button_gradient_1" data-action="deleteObj">Удалить</div>
					</div>
				</div>				
				
				
	
				<div nameId="bl_object_3d" style="display: none;">  
				
					<div class="bl_fd30" nameId="rp_bl_light" style="display: none;">
						<div class="bl_light_t1">
							Интенсивность света: <span class="bl_light_t2" nameId="sun_intensity_div">0.0</span>
						</div>
					
						<div class="bl_fd31">
							<div class="bl_circle_handle" nameId="sun_intensity_handle"></div>
						</div>	 	
					</div>
				
				
					<div class="flex_1 w_1">						
						<div class="button1 button_gradient_1" nameId="select_pivot">
							<img src="<?=$path?>img/move_1.png">	
						</div>	
						<div class="button1 button_gradient_1" nameId="select_gizmo">
							<img src="<?=$path?>img/rotate_1.png">		
						</div>							
					</div>

					<div class="flex_1 input_rotate">
						<input type="text" nameId="object_rotate_X" value="0">
						<input type="text" nameId="object_rotate_Y" value="0">
						<input type="text" nameId="object_rotate_Z" value="0">
					</div>
				
					<div class="button1 button_gradient_1" nameId="obj_rotate_reset" style="display: none;">
						reset	
					</div>
					
					<div class="button1 button_gradient_1" nameId="button_copy_obj" style="display: none;">
						копировать	
					</div>								

					<div class="button1 button_gradient_1" nameId="button_delete_obj">
						удалить	
					</div>									
					
				</div> 
			</div>	
		</div>

		
		<div class="flex_column_1" nameId="wrap_list_obj" style="display: none;">
			<div class="right_panel_1_1_h">Список материалов</div>
			
			<div class="right_panel_1_1_list" list_ui="wf">
				
				<?if(1 == 2){?>
				<div class="right_panel_1_1_list_item">
					<div class="right_panel_1_1_list_item_color"></div>
					<div class="right_panel_1_1_list_item_text">
						труба 20
					</div>	
					<div class="right_panel_1_1_list_item_text">
						3.2м
					</div>				
				</div>
				<?}?>
				
			</div>
		</div>
		
		
		<div class="flex_column_1" nameId="wrap_catalog" style="display: none;">
			<div class="right_panel_1_1_h">Каталог</div>
			
			<div class="right_panel_1_1_list" list_ui="catalog">
				
			</div>
		</div>
		
	</div>
	
	
	<div class="button_show_panel_catalog" nameId="button_show_panel_catalog" style="display: none;">
		<div class="button_show_panel_catalog_1">		
		</div>	
	</div>

	
</div>
