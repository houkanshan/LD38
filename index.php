<?php include "base.php"; ?>

<?php
define("VERSION", 7);
$ip = $_SERVER['REMOTE_ADDR'];
$is_dead = is_dead();
$user_id = get_id_by_ip($ip);
$brith_time = get_brith_time();
$life = get_life();
$death_time = get_death_time();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LD38</title>
  <link rel="stylesheet" href="dist/css/index.css?v=<?php echo VERSION ?>">
  <meta name="viewport" content="user-scalable=no, width=540">
</head>
<body data-state="<?php echo $is_dead ? 'dead' : 'title'?>">

<div id="computer">
<div id="screen-wrapper" class="crt-container">
<div id="screen">

  <?php if (!$is_dead) { ?>

  <div id="stage-title" class="stage">
    <div class="progress-overlay"><div class="progress-bar"></div></div>
    <h1 id="title"></h1>
    <a class="btn-start"></a>
  </div>
  <div id="stage-main" class="stage">
    <div id="welcome">
      <p id="welcome-line-1"></p>
      <p id="welcome-line-2"></p>
    </div>
  </div>

  <?php } ?>
  <div id="stage-dead" class="stage">
    <div id="end-title"></div>
    <div id="end-word"></div>
  </div>

  <p id="last-comment-wrapper"><span id="last-comment"></span></p>
  <form class="post-form">
    <div class="comment-wrapper">
      <input type="text" name="comment" placeholder="Leave your comments" autocomplete="off" maxlength="143">
    </div>
  </form>

</div>
</div>
</div>

<script>
  var Data = {
    userId: '<?php echo $user_id ?>'
  , brithTime: <?php echo $brith_time ?>
  , deathTime: <?php echo $death_time ?>
  , life: <?php echo $life ?>
  }
</script>

<script src="dist/js/index.js?v=<?php echo VERSION ?>"></script>
</body>
</html>
