/*
 * Adapted from https://gist.github.com/schovi/3aaa04e820a1abe18c7e9d491634b8d7#file-volume-js
 */

// To use this, open console (developer tools), change the volume you want, paste it there and run

// 1 = 100% ...
// twitchVolume(2)

// function twitchVolume(volume) {
//   if (!window.twitchVolumeGainNode) {
//     const video = document.querySelector('video')
//     // create an audio context and hook up the video element as the source
//     const audioCtx = new AudioContext();
//     const source = audioCtx.createMediaElementSource(video);

//     // create a gain node
//     const gainNode = audioCtx.createGain();
//     source.connect(gainNode);

//     // connect the gain node to an output destination
//     gainNode.connect(audioCtx.destination);    
    
//     window.twitchVolumeGainNode = gainNode
//   }
  
//   window.twitchVolumeGainNode.gain.value = volume
// }

const vol = 1;

var changeVolume = document.createElement('script');
changeVolume.src = chrome.runtime.getURL('injected/changeVolume.js');
changeVolume.onload = function() {
    this.remove();
    
    window.postMessage({ command: "tvc_set_volume", data: vol }, "*"); 
    console.log("sent set volume msg");

    window.postMessage({ command: "tvc_get_volume"}, "*"); 
    console.log("sent get volume msg");
}; 
(document.head || document.documentElement).appendChild(changeVolume);

