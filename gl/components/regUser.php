<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd_1.php");



$type = trim($_POST['type']);
$mail = trim($_POST['mail']); 
$pass = trim($_POST['pass']); 
$date = date("Y-m-d-G-i");



// проверка mail на правильность
//if(!filter_var($mail, FILTER_VALIDATE_EMAIL)) { exit; }
if(!preg_match("/^[a-z0-9@_\-\.]{4,20}$/i", $mail)) { exit; }

// проверка pass на правильность
if(!preg_match("/^[a-z0-9]{4,20}$/i", $pass)) { exit; }



// вход нового пользователя
if($type == 'reg_1')
{
	$sql = "SELECT * FROM user WHERE mail = :mail AND pass = :pass LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->bindValue(':pass', $pass, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);


	
	$inf = array();
	$inf['pass'] = $pass;
	$inf['mail'] = $mail;
	
	if($res)
	{ 		
		$inf['success'] = true;
		$inf['info'] = $res;			
	}
	else
	{ 
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'неверная почта или пароль';
	}

	echo json_encode( $inf );
}


// регистрация нового пользователя
if($type == 'reg_2')
{
	$sql = "SELECT * FROM user WHERE mail = :mail LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':mail', $mail, PDO::PARAM_STR);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);	
	
	
	$inf = array();
	$inf['pass'] = $pass;
	$inf['mail'] = $mail;
	$inf['date'] = $date;
	
	if($res)	// такой mail, уже есть в базе
	{
		$inf['success'] = false;
		$inf['err']['code'] = 1;
		$inf['err']['desc'] = 'такой mail, уже есть в базе';
	}
	else		// mail в базе нет, можно записывть нового пользователя  
	{
		$sql = "INSERT INTO user (pass, mail, date) VALUES ( :pass, :mail, :date)";

		$r = $db->prepare($sql);
		$r->bindValue(':pass', $pass);
		$r->bindValue(':mail', $mail);
		$r->bindValue(':date', $date);
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
			$inf['err']['code'] = 2;
		}		
	}
	

	echo json_encode( $inf );
}





?>





