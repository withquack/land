export function handleVideoPlayback() {
  const video = document.getElementById("minecraft-goose");

  if (video) {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        video.play();
      } else {
        video.pause();
      }
    });
  }
}
