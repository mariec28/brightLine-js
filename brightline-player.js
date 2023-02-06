let mainVideo = document.getElementById("full-video");
let showScreen = document.querySelector(".bl-full-screen");
let preview = document.getElementById('vPreview');
let currentIndex = 0

/** read json from url or local json **/
fetch("https://cdn-media.brightline.tv/training/demo.json")
.then(function (response) {
  return response.json()
})
.then(function (data) {
  if(data != undefined){  
    let videos = data["streams"]
    let btnId = 0
    for (let i = 0; i < videos.length; i++) {
      /* validate json items */
      if(videos[i].hasOwnProperty("name") && videos[i].hasOwnProperty("mediaFile")){
        let video = document.createElement("video");
        let videoSrc = videos[i].mediaFile
        let videoName = videos[i].name
        let extensionVideo = getExtensionVideo(videoSrc)
        
        video.src = videoSrc;
        
         /* validate if video can play */
        video.oncanplay = function () {
          createButton(videoName,videoSrc, btnId, extensionVideo)
          if(btnId == 0){
            /* focus first button in list */
            let firstBtn = document.getElementById('btn-0');
            preview.setAttribute("type","video/"+extensionVideo)
            firstBtn.classList.add("bl-btn-video-focus");
            firstBtn.focus();
            firstBtn.blur();
            preview.src = videoSrc
          }
          btnId+=1;
        };
      }
      else{
        console.log("Invalid JSON attributtes")
      }
    }
  }
  else{
    alert("ERROR: 404 Not Found");
  }
})

/**  create list of buttons and structure **/
function createButton(name, url, btnId) {
  let spanBtn = document.createElement('span');
  spanBtn.textContent = name;
  spanBtn.setAttribute('class', 'fa fa-play');

  let btnVideo = document.createElement('button');
  btnVideo.setAttribute('class', 'bl-btn-video');
  btnVideo.setAttribute("id","btn-"+btnId);
  btnVideo.setAttribute("video-url",url);
  btnVideo.setAttribute("video-index",btnId);
  btnVideo.appendChild(spanBtn)
  
  document.getElementById("buttons-list").appendChild(btnVideo)
}

/** main functionality, key eent, play video, back **/
document.addEventListener('keydown', (event) => {
  var code = event.keyCode;
  var allButtons = document.querySelectorAll(".bl-btn-video"); 
  let videoUrl = "";
  let extensionVideo = "";
  let idButton = "";

  if((!mainVideo.paused && code!=8) || allButtons.length == 0) {
    event.preventDefault(); 
    return;
  }

  switch(code){
    case 38:
      if (currentIndex==0){
        currentIndex = allButtons.length-1
        idButton = 'btn-'+(currentIndex);
      }
      else{
        currentIndex-=1
        idButton = 'btn-'+(currentIndex);
      }
      nextPrevButton(idButton)
      break;
    case 40:
      if(currentIndex == allButtons.length-1){
        currentIndex = 0;
        idButton = 'btn-0';
      }
      else{
        currentIndex+= 1;
        idButton = 'btn-'+(currentIndex);
      }
      nextPrevButton(idButton)
      break;
    case 13:
      let prevVideo = document.querySelector(".bl-btn-video-focus");
      videoUrl = prevVideo.getAttribute("video-url");
      extensionVideo = getExtensionVideo(videoUrl);
      mainVideo.src = videoUrl;
      mainVideo.setAttribute("type","video/"+extensionVideo);
      showScreen.style.display = "block";
      mainVideo.play();
      break;
    case 8:
      mainVideo.src= "";
      showScreen.style.display = "none";
      break;
  }

})

/** method to get extension of video url **/
function getExtensionVideo(videoUrl){
  let splitVideo = videoUrl.split(".")
  let extensionVideo = splitVideo[splitVideo.length-1]
  return extensionVideo
}

/** event to return to list of videos **/
mainVideo .onended = function() {
  showScreen.style.display = "none";
};

/** method to move buttons **/
function nextPrevButton(idButton){
  let prevVideo = document.querySelector(".bl-btn-video-focus");
  let videoUrl = "";
  let extensionVideo = "";
  let nextVideo = "";

  nextVideo = document.getElementById(idButton);
  prevVideo.classList.remove("bl-btn-video-focus");
  nextVideo.classList.add("bl-btn-video-focus");
  var x = window.scrollX, y = window.scrollY;
  window.scrollTo(x, y);
  nextVideo.focus();
  nextVideo.blur();
  videoUrl = nextVideo.getAttribute("video-url");
  extensionVideo = getExtensionVideo(videoUrl);
  preview.src = videoUrl;
  preview.setAttribute("type","video/"+extensionVideo);
}