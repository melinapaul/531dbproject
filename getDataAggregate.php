<?php
header('Access-Control-Allow-Origin: *');  

$servername = "localhost";
$username = "root";
$password = "root";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";
$sql = "SELECT day, COUNT( * ) as count FROM project.crime GROUP BY day";
$day = getRows($conn->query($sql)); 

$sql = "SELECT time_of_day, COUNT( * ) as count FROM project.crime GROUP BY time_of_day";
$time = getRows($conn->query($sql));

$sql = "SELECT gender, COUNT( * ) as count FROM project.crime GROUP BY gender";
$gender = getRows($conn->query($sql));

$sql = "SELECT offence, COUNT( * ) as count FROM project.crime GROUP BY offence";
$offence = getRows($conn->query($sql));

$sql = "SELECT city, COUNT( * ) as count FROM project.crime GROUP BY city";
$city = getRows($conn->query($sql));

$sql = "SELECT city, offence, COUNT( * ) as count FROM project.crime GROUP BY city, offence";
$result_city = $conn->query($sql);

$rows = array();
if (mysqli_num_rows($result_city) > 0) {
  while($row = mysqli_fetch_assoc($result_city)) {
	if(!array_key_exists($row['city'], $rows)) $rows[$row['city']] = array();
		array_push($rows[$row['city']], array("offence" => $row['offence'], "count" => $row['count']));
    }
  } else {
}
	
$result = array("day" => $day, "time" => $time,"gender" => $gender,"offence" => $offence, "city" => $city, "offence_by_city" => $rows);

echo json_encode($result);

$conn->close();

function getRows($result) {
	$rows = array();
	if (mysqli_num_rows($result) > 0) {
	    // output data of each row
	    while($row = mysqli_fetch_assoc($result)) {
		array_push($rows, $row);
	    }
	} else {
	}	
	return $rows;
}

?>

