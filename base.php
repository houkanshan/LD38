<?php

define("FILE_LOG", "data/log.txt");
define("FILE_LIFE", "data/life.txt");
define("FILE_DEATH_TIME", "data/death_time.txt");
define("FILE_BRITH_TIME", "data/brith_time.txt");
define("FILE_GLOBAL_ID", "data/global_id.txt");
define("DIR_USERS", "data/users/");
define("FILE_COMMENTS", "data/comments.txt");
define("USER_COOLING_TIME", 60*60*1.5); // 1.5 hour.

define("INITIAL_LIFE_TIME", 24 * 16); // 240 hour
define("HALF_LIFE_TIME", 12); // 24 hour
define("DEAD_LIFE", 1 / pow(2, INITIAL_LIFE_TIME/HALF_LIFE_TIME));
define("LIFE_EXTEND_EACH_TIME", 1 / INITIAL_LIFE_TIME);

date_default_timezone_set('UTC');

function safe_get_contents($filename) {
  $res = file_get_contents($filename);
  if (!$res) {
    raise_e("Get $filename error: $res");
  } else {
    return $res;
  }
}

function read_last_line($f) {
  $line = '';
  $cursor = -1;
  fseek($f, $cursor, SEEK_END);
  $char = fgetc($f);
  while ($char === "\n" || $char === "\r") {
    fseek($f, $cursor--, SEEK_END);
    $char = fgetc($f);
  }
  while ($char !== false && $char !== "\n" && $char !== "\r") {
    $line = $char . $line;
    fseek($f, $cursor--, SEEK_END);
    $char = fgetc($f);
  }

  return $line;
}

function get_last_comment() {
  $comments_file = @fopen(FILE_COMMENTS, "r");
  if ($comments_file) {
    $comment = read_last_line($comments_file);
    fclose($comments_file);
    return $comment;
  }
}

function create_user_file($ip, $id) {
  file_put_contents(DIR_USERS.$ip.'.txt', $id.PHP_EOL , FILE_APPEND | LOCK_EX);
}

function register_user($ip) {
  $handle = fopen(FILE_GLOBAL_ID, "r+");
  if (!flock($handle, LOCK_EX)) { exit(); }

  $id = intval(trim(fgets($handle)));
  // echo "old id:".$id."\n";
  $id += 1;
  // echo "new id:".$id."\n";
  fseek($handle, 0);
  fwrite($handle, $id);
  clearstatcache();
  flush($handle);
  flock($handle, LOCK_UN);
  create_user_file($ip, $id);
  return $id;
}

function get_or_create_user_info($ip) {
  $file_user = DIR_USERS.$ip.".txt";
  $handle = @fopen($file_user, "r");

  clearstatcache();
  if (file_exists($file_user)) {
    # User existed
    $user_info = safe_get_contents($file_user);
    $user_info = explode(",", trim($user_info), 2);
    fclose($handle);
    return $user_info;
  } else {
    # User not existed
    return [register_user($ip), null];
  }
}

function get_id_by_ip($ip) {
  $user_info = get_or_create_user_info($ip);
  return $user_info[0];
}

function update_user_active_time($ip, $id, $time) {
  $file_user = DIR_USERS.$ip.".txt";
  return file_put_contents($file_user, "$id,$time", LOCK_EX);
}

function can_extend_life($ip) {
  if (is_dead()) { return false; }

  $user_info = get_or_create_user_info($ip);
  $last_active_time = $user_info[1];

  if ($last_active_time) {
    if ($curr_time - $last_active_time < USER_COOLING_TIME) {
      // echo "still hot, won't upate.";
      return false;
    }
  }
  return true;
}

function try_extend_life($ip) {
  if (!can_extend_life($ip)) { return false; }
  // echo "cool, update.";

  $user_info = get_or_create_user_info($ip);
  $user_id = $user_info[0];
  $curr_time = time();

  // echo "userid: $user_id.\n";
  // echo "last_active_time: $last_active_time.\n";
  // echo "current_time:$curr_time.\n";

  update_user_active_time($ip, $user_id, $curr_time);
  // $time_to_extend = 60 * 60 + rand(-600, 600);
  // return update_death_time(get_death_time() + $time_to_extend);
  return update_life(min(1, get_life() + LIFE_EXTEND_EACH_TIME), $curr_time);
}

function set_brith_time($time) {
  file_put_contents(FILE_BRITH_TIME, $time.PHP_EOL, LOCK_EX);
  return $time;
}

function get_brith_time() {
  clearstatcache();
  if (!file_exists(FILE_BRITH_TIME)) {
    $now_time = time();
    return set_brith_time($now_time);
  } else {
    return intval(trim(safe_get_contents(FILE_BRITH_TIME)));
  }
}

function get_life() {
  clearstatcache();
  if (!file_exists(FILE_LIFE)) {
    return update_life(1, time());
  } else {
    $life_info = get_last_life_info();
    $last_time = $life_info[1];
    $last_life = $life_info[0];
    if (!$life_info) {
      write_log("no life info but continued: ".json_encode($life_info));
    }
    if ($life_info && !$last_life) {
      write_log("has life info but no last_life: ".json_encode($life_info).", $last_life");
    }
    $curr_time = time();
    $duration_hour = ($curr_time - $last_time) / 60.0 / 60.0 / HALF_LIFE_TIME;
    $new_life = $last_life / pow(2, $duration_hour); // half life
    if ($new_life === 0) {
      write_log("0 in counting new life.");
    }
    // echo $last_life;
    // echo "\n";
    // echo $duration;
    // echo "\n";
    // echo $new_life;
    return update_life($new_life, $curr_time);
  }
}

function get_last_life_info() {
  $life_info = explode(',', trim(safe_get_contents(FILE_LIFE)), 2);
  return array(
    floatval($life_info[0]),
    intval($life_info[1]),
  );
}

function update_life($life, $time) {
  $res = file_put_contents(FILE_LIFE, $life.','.$time.PHP_EOL, LOCK_EX);
  if (!$res) {
    write_log("maybe file writing error: $res");
  }
  return $life;
}

function get_death_time() {
  if (!is_dead() || !file_exists(FILE_DEATH_TIME)) {
    $last_life_info = get_last_life_info();
    $last_life = $last_life_info[0];
    $last_time = $last_life_info[1];
    $death_time = $last_time + log($last_life / DEAD_LIFE, 2) * 60 * 60 * HALF_LIFE_TIME;
    file_put_contents(FILE_DEATH_TIME, $death_time, LOCK_EX);
    return $death_time;
  } else {
    return intval(trim(safe_get_contents(FILE_DEATH_TIME)));
  }
}


function is_dead() {
  // $death_time = get_death_time();
  // return time() > $death_time;
  return get_life() < DEAD_LIFE;
}

function write_log($log) {
   file_put_contents(FILE_LOG, $log."\n",  FILE_APPEND | LOCK_EX);
}
function raise_e($log) {
  write_log($log);
  throw new Exception($log);
}

?>
