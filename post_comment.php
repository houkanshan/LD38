<?php

define("FILE_GLOBAL_ID", "data/global_id.txt");
define("DIR_USERS", "data/users/");
define("FILE_COMMENTS", "data/comments.txt");

function create_user_file($ip, $id) {
  file_put_contents(DIR_USERS.$ip.'.txt', $id.PHP_EOL , FILE_APPEND | LOCK_EX);
}

function register_user($ip) {
  $handle = fopen(FILE_GLOBAL_ID, "w+");
  if(flock($handle, LOCK_EX)) {
    $filesize = filesize(FILE_GLOBAL_ID);
    if ($filesize) {
      $id = (int)fread($handle, $filesize);
      $id += $id;
    } else {
      $id = 1;
    }
    fwrite($handle, $id);
    flush($handle);
    flock($handle, LOCK_UN);
    create_user_file($ip, $id);
    return $id;
  } else {
    exit();
  }
}

function get_id_by_ip($ip) {
  $file_user = DIR_USERS.$ip.".txt";
  $handle = @fopen($file_user, "r");
  if ($handle) {
    # User existed
    $user_info = trim(fgets($handle));
    $id = explode(",", $user_info, 2)[0];
    fclose($handle);
    return $id;
  } else {
    # User not existed
    return register_user($ip);
  }
}

header("Access-Control-Allow-Origin: *");

$ip = $_SERVER['REMOTE_ADDR'];
$id = get_id_by_ip($ip);

$comment = str_replace("\n", " ", $_POST["comment"]);

echo $id."\n";
echo $comment."\n";

if ($id && $comment) {
  file_put_contents(FILE_COMMENTS, $id.",".$comment.PHP_EOL, FILE_APPEND | LOCK_EX);
} else {
  http_response_code(400);
}

?>
