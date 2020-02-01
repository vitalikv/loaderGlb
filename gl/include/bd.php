<? 





$url = $_SERVER['REQUEST_URI'];

$path = "";

$title = '';
$h1 = '';
$description = '';
$interface['wall_1'] = 0;
$interface['wall_2'] = ['top'=>[], 'left'=>[], 'right'=>[], 'bottom'=>[]];
$interface['wd_1'] = 0;
$interface['wd_2'] = 0;
	



$title = 'Test';
$h1 = '----';
$description = '';
$nameId = '';
$interface['wd_1'] = 1;	
$interface['wd_2'] = 1;
$interface['wall_2']['bottom'] = ['width_1' => 1];
$interface['wall_2']['top'] = ['showHideWall_1' => 1];



$infProject = array('url' => $url, 'title' => $title, 'nameId' => $nameId, 'path' => $path, 'load' => [ img => [] ]);

$infProject['activeInput'] = '';
$infProject['activeInput_2'] = null;
$infProject['activeDiv'] = null;

$infProject['user'] = [];
$infProject['user']['id'] = null;
$infProject['user']['mail'] = null;
$infProject['user']['pass'] = null;

$infProject['settings']['project'] = '';
$infProject['settings']['shader'] = [];
$infProject['settings']['light']['type'] = 'global';
//$infProject['settings']['shader']['saoPass'] = true;
$infProject['settings']['shader']['fxaaPass'] = false;		
$infProject['settings']['height'] = 3.2;
$infProject['settings']['floor'] = [ 'o' => false, 'posY' => 0.0, 'height' => 0.01, 'changeY' => false, 'areaPoint' => 'center', 'material' => null, 'label'=> true ];
$infProject['settings']['wall'] = [ 'width' => 0.3, 'label' => '', 'dist' => 'center', 'material' => null, 'block' => null ];
$infProject['settings']['land'] = [ 'o' => false ];
$infProject['settings']['unit'] = [ 'wall' => 1, 'floor' => 1 ];
$infProject['settings']['camera'] = [ 'type' => '2d', 'zoom' => 1, 'limitZoom' => 1 ];
$infProject['settings']['grid'] = [ 'count' => 30, 'size' => 0.5, 'pos' => [ 'y' => -0.1 ] ];

$infProject['scene'] = [ 'tool' => [] ];
$infProject['scene']['load'] = '';


	
$infProject['settings']['project'] = 'test';
$infProject['settings']['floor']['o'] = true;
$infProject['settings']['floor']['areaPoint'] = 'inside';
$infProject['settings']['floor']['label'] = false;
$infProject['settings']['floor']['color'] = 0xf7f2d5;
$infProject['settings']['wall']['label'] = 'double';
$infProject['settings']['wall']['color']['top'] = 0x444444;
$infProject['settings']['wall']['color']['front'] = 0xada186;
$infProject['settings']['grid']['size'] = 1.0;
$infProject['settings']['grid']['count'] = null;
$infProject['settings']['grid']['pos'] = [ 'y' => -0.00 ];
$infProject['settings']['grid']['color'] = 0xcccccc;
$infProject['settings']['interface']['button']['showHideWall_1'] = ['active' => 'Спрятать стены'];




$jsonPhp = json_encode($infProject);



?>