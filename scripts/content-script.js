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
window.addEventListener("message", (message) => {
    if (message.data.command == "tvc_add_volume_listener") {
        const channelName = message.data.data;
        const volumeControls = document.querySelector('.player-controls__left-control-group');
        // const volumeControls = document.querySelector("input[id^='player-volume-']");
        volumeControls?.addEventListener("change", (event) => {
            // event.stopPropagation();

            const channelName = message.data.data;
            const vol = event?.target?.value
            chrome.storage.sync.get({'channelVolumes': {}}).then((result) => {
                result.channelVolumes[channelName] = vol;
                chrome.storage.sync.set(result);
            });
        });
    } else if (message.data.command == "tvc_channel_load_set_volume") {
        chrome.storage.sync.get({'channelVolumes': {}}).then((result) => {
            const channelName = message.data.data
            const vol = parseFloat(result.channelVolumes[channelName]);

            if (channelName && vol) {
                window.postMessage({ command: "tvc_set_volume", data:vol}, "*");
            }
		});
    }
});


const video = document.querySelector('video')
if (video) {
    video.addEventListener('loadedmetadata', () => {
        window.postMessage({ command: "tvc_channel_load"}, "*");
    })
} else {
    console.log("Video not found, not adding channel load listener.");
}


let changeVolume = document.createElement('script');
changeVolume.src = chrome.runtime.getURL('injected/changeVolume.js');
changeVolume.onload = function() {
    this.remove();
}; 
(document.head || document.documentElement).appendChild(changeVolume);

