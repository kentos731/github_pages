let video;
let poseNet;
let poses = [];
let count_value = 0;
let should_count = true; // フラグ
let count_disp = document.getElementById("disp_count");  
let reset_btn = document.getElementById("btn_reset");


function setup() {
  console.log('セットアップ');
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('');
}

function count() {

  count_value += 1;
  console.log(count_value);
  count_disp.innerHTML = count_value;
}

function draw() {
    if (poses.length > 0) {
      let pose = poses[0].pose;
      let keypoint = pose.keypoints[0];
      // console.log('部位名：' + keypoint.part);
        for (let i = 0; i < poses.length; i++) {
            // poseが持つ情報を出力
            let pose = poses[i].pose;
            // console.log('全体の精度' + pose.score);
            // console.log('nose' + pose.nose.x);
            // console.log('nose' + pose.nose.y);
            if (pose.score >= 0.6){
              // console.log("ok");
              if (pose.nose.y >= 250.0 && should_count) {
                console.log(pose.nose.y);
                count_value += 1;
                should_count = false;
                console.log(count_value);
                console.log(should_count);
                count_disp.innerHTML = count_value;
              } else if (pose.nose.y <= 240.0) {
                // ↑姿勢が元に戻った判定（数値は適当）。
                // もしここを > 250.0 にすると姿勢が250.0前後で震えたとき何度もカウントしてしまう。
                should_count = true;
              }
              if(count_value == 10 ){
                document.getElementById('disp_count').style.color="#FF0000";
              }
            }

        }

        for (let i = 0; i < poses.length; i++) {
            let skeleton = poses[i].skeleton;

        }

        // イメージをp5.jsのキャンバスに描画する。<= createCanvas(640, 360)で作成したキャンバス
        // image(img, x, y, [width], [height])
        // https://p5js.org/reference/#/p5/image
        image(video, 0, 0, width, height);
        drawSkeleton();
        drawKeypoints();
        // p5.jsがdraw()内のコードの連続的な実行を行うのを停める
        // https://p5js.org/reference/#/p5/noLoop
        // noLoop(); // posesの推定時はループを停める
    }

// image(video, 0, 0, width, height);
// We can call both functions to draw all keypoints and the skeletons
fill(255, 0, 0);
//線を引く
//stroke('red');
//line(0, 250, 600, 250);

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(color(0, 0, 255));
        stroke(20);
        // noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];

      stroke('rgb(0,255,0)');
      strokeWeight(5);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
reset_btn.onclick = function (){
  count_value = 0; count_disp.innerHTML = count_value;
}

function ring() {
  document.getElementById("Open foot").play();
}
