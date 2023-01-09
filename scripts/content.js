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



// const video = document.querySelector('video');
// video.volume = 0.5;

// console.log(video);
// console.log(video.volume);

// const vs = document.querySelector('input[id^="player-volume-slider"]')
// vs
setTimeout(() => {
    var reactRootNode = null;
var rootNode = document.querySelector('#root');
if (rootNode && rootNode._reactRootContainer) console.log("whoo has reactRootContainer");
if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot) console.log("whoo has internalRoot");
if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot && rootNode._reactRootContainer._internalRoot.current) {
    console.log("whoo has internalRoot");
    reactRootNode = rootNode._reactRootContainer._internalRoot.current;
    console.log(rootNode._reactRootContainer._internalRoot.current);
}
console.log("root node" );
console.log(rootNode);
console.log(Object.values(rootNode))
if (reactRootNode) {
    var player = findReactNode(reactRootNode, node => node.setPlayerActive && node.props && node.props.mediaPlayerInstance);
    player = player && player.props && player.props.mediaPlayerInstance ? player.props.mediaPlayerInstance : null;

    console.log(player);
}
if (!reactRootNode) {
    console.log("No react root");
}

// document.querySelector('#root')._reactRootContainer._internalRoot.current;
}, "10000")

function findReactNode(root, constraint) {
    if (root.stateNode && constraint(root.stateNode)) {
        return root.stateNode;
    }
    let node = root.child;
    while (node) {
        const result = findReactNode(node, constraint);
        if (result) {
            return result;
        }
        node = node.sibling;
    }
    return null;
}

