<?php include "base.php"; ?>

<?php
define("VERSION", 26);
$ip = $_SERVER['REMOTE_ADDR'];
$is_dead = is_dead();
$user_id = get_id_by_ip($ip);
$brith_time = get_brith_time();
$life = get_show_life();
$death_time = get_death_time();
$can_extend = can_extend_life($ip);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>This Game Will Die Eventually, and So Will You.</title>
  <link rel="stylesheet" href="dist/css/index.css?v=<?php echo VERSION ?>">
  <link rel="shortcut icon" href="http://serotoninphobia.info/favicon.ico"/>
  <meta name="viewport" content="user-scalable=no, width=540">
</head>
<body data-state="<?php echo $is_dead ? 'dead' : 'title'?>">

<div id="computer">
<div id="screen-wrapper" class="crt-container">
<div id="screen">

  <?php if (!$is_dead) { ?>

  <div id="stage-title" class="stage">
    <div class="progress-overlay"><div class="progress-bar"></div></div>
    <h1 id="title" class="title-text"></h1>
    <a class="btn-start title-text"></a>
  </div>

  <div id="stage-login" class="stage">
    <div id="login-text">Logging in...</div>
  </div>

  <div id="stage-main" class="stage">
    <div id="welcome">
      <p id="welcome-line-1"></p>
      <p id="welcome-line-2"></p>
    </div>
  </div>

  <?php } ?>
  <div id="stage-dead" class="stage">
    <div id="end-title"><?php echo $is_dead ? 'GAME OVER' : '' ?></div>
    <div id="end-word"></div>
  </div>

  <p id="last-comment-wrapper"><span id="last-comment"></span></p>
  <form class="post-form">
    <div class="comment-wrapper">
      <input type="text" name="comment" placeholder="Leave your message here" autocomplete="off" maxlength="143">
    </div>
  </form>
  <div class="preload">
    <img src="dist/pics/title1.png?v=2" alt="">
    <img src="dist/pics/title2.png?v=2" alt="">
  </div>
</div>
</div>
</div>

<?php
// a userId
// b brithTime
// c deathTime
// d life
// e canExtend
?>

<script>
  var Data = {
    a: '<?php echo $user_id ?>'
  , b: <?php echo $brith_time ?>
  , c: <?php echo $death_time ?>
  , d: <?php echo $life ?>
  , e: <?php echo $can_extend ? 'true' : 'false' ?>
  }
</script>

<script src="dist/js/index.js?v=<?php echo VERSION ?>"></script>
</body>
</html>
