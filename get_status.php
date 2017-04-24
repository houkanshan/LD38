<?php
include "base.php";

$ip = $_SERVER['REMOTE_ADDR'];

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    // a comment
    // b deathTime
    // c is_dead
    // d life
    // e can_extend
    $status = array(
        "a" => get_last_comment(),
        "b" => get_death_time(),
        "c" => is_dead(),
        "d" => get_life(),
        "e" => can_extend_life($ip),
    );
} catch (Exception $e) {
    write_log(var_dump($e));
    header(':', true, 500);
}

echo json_encode($status);
?>
