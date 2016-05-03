<?php
require 'vendor/autoload.php';
header('Access-Control-Allow-Origin: *');  

$ml = new Aws\MachineLearning\MachineLearningClient([
    'version' => 'latest',
    'region'  => 'us-east-1'
]);

$gender = htmlspecialchars($_GET["gender"]);
$day = htmlspecialchars($_GET["day"]);
$time = htmlspecialchars($_GET["time"]);
$offence = htmlspecialchars($_GET["offence"]);

$result = $ml->predict(array(
    // MLModelId is required
    'MLModelId' => 'ml-qCh9devFjx4',
    // Record is required
    'Record' => array(
        // Associative array of custom 'VariableName' key names
        'gender' => $gender,
	'day' => $day,
	'time_of_day' => $time,
	'Offence' => $offence
    ),
    // PredictEndpoint is required
    'PredictEndpoint' => 'https://realtime.machinelearning.us-east-1.amazonaws.com',
));

echo json_encode($result['Prediction']);
//var_dump($result['Prediction']);

//print_r (phpinfo());

?>
