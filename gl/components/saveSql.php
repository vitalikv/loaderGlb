<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");


$id = trim($_POST['id']);
$user_id = trim($_POST['user_id']);
$name = 'Проект ('.date("G:i").' '.date("d-m-Y").')';
$json = $_POST['json'];  
//$date = date("Y-m-d-G-i");



$id = addslashes($id);
if(!preg_match("/^[0-9]+$/i", $id)) { exit; }

$user_id = addslashes($user_id);
if(!preg_match("/^[0-9]+$/i", $user_id)) { exit; }


$inf = array();
$inf['user_id'] = $user_id;
//$inf['mail'] = $mail;
	

if($id == 0)
{
	$sql = "INSERT INTO project (user_id, name, json) VALUES (:user_id, :name, :json)";

	$r = $db->prepare($sql);
	$r->bindValue(':user_id', $user_id);
	$r->bindValue(':name', $name);
	$r->bindValue(':json', $json);
	$r->execute();


	$count = $r->rowCount();

	if($count==1)
	{ 
		$inf['success'] = true;
		$inf['id'] = $db->lastInsertId(); 	
	}
	else
	{  
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'неверная почта или пароль';
	}
}
else
{
	$sql = "UPDATE project SET json = :json, name = :name WHERE id = :id";
	$r = $db->prepare($sql);
	$r->bindValue(':id', $id);
	$r->bindValue(':name', $name);
	$r->bindValue(':json', $json);
	$r->execute();
}

echo json_encode( $inf );

?>





