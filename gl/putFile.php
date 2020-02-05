<? 




$list = 'meshBSP.js 	
calculationArea.js
createGrid.js
crossWall.js
addPoint.js
addWD.js
mouseClick.js
changeCamera.js
moveCamera.js
clickChangeWD.js
clickMovePoint.js
clickMoveWall.js
clickMoveWD.js
deleteObj.js
floor.js
detectZone.js
inputWall.js
label.js  	
clickActiveObj.js    
saveLoad.js
script.js
eventClick.js
clickMovePivot.js
clickObj.js
clickMoveGizmo.js
loadObj.js
uiInterface.js
hideWall.js
substrate.js
autoBuilding.js
';

$arrF = array();
$arr = explode(".js", $list);
$file2 = '';

for ($i = 0; $i < count($arr); $i++)
{
	$arr[$i] = trim($arr[$i]).'.js';
}


// Открываем файл, флаг W означает - файл открыт на запись
$newFile = fopen('t/test.js', 'w');


// Записываем в файл $text
for ($i = 0; $i < count($arr)-1; $i++)
{
	echo $arr[$i].'<br>';
	$file = file_get_contents($arr[$i]);
	
	$file = preg_replace("|console.log\((.*)\);|i","",$file);
	$file2 .= $file;
	//getFunct($file);
	
	{
		preg_match_all('|function\s*(\w+)\s*\((.*)\)|Usi', $file, $arr2); 
		
		for ($i2 = 0; $i2 < count($arr2[1]); $i2++)
		{
			$arrF[] = $arr2[1][$i2];
		}

		//getFunct($arr2[1]);
	}
	
	fwrite($newFile, $file);	
}

// Закрывает открытый файл
fclose($newFile);



//getFunct($arrF);


echo '<br><br>--------<br><br>';


$file2 = preg_replace('#(\/\/(.*?)(\n|$|\r|(\r\n)))|(\/\*(.*?)\*\/)#i','',$file2);	// удаляем комменты




for ($i = 0; $i < count($arrF); $i++)
{
	//preg_match_all('|'.$arrF[$i].'|Usi', $file2, $str);
	//print_r($str[0]);	
	//echo $str[0][0].' '.count($str[0]).'<br>';	
	
	//echo 'fname_s_0'.($i+1).'|'.$arrF[$i].'<br>';
	
	if (preg_match('#\b'.$arrF[$i].'\b#Us', 'loadInputFile')) 
	{
		echo "Вхождение найдено <br> ".$arrF[$i]."<br><br>";
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_input',$file2);
	} 
	else 
	{
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_0'.($i+1),$file2);	// 	\b - границы слова	
	}	
	
}

echo $file2;

$newFile = fopen('t/test.js', 'w');
fwrite($newFile, $file2);
fclose($newFile);



// показываем список названий функций 
function getFunct($text) 
{	
	echo '<br>';
	
	for ($i = 0; $i < count($text); $i++)
	{
		echo $text[$i].'<br>';
	}			
	
	echo '<br>';
}




echo 11;


