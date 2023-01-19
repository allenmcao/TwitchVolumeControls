// MAIN EVENT LISTENER
window.addEventListener("message", (event) => {
	// Get Volume
    if (event.data.command == "tvc_get_volume") {
        window.postMessage({ command: "tvc_get_volume_reply", data: getVideoPlayer()?.getVolume() }, "*");
    }
	// Set volume
    else if (event.data.command == "tvc_set_volume") {
        getVideoPlayer()?.setVolume(event.data.data);
    }
	// Handle initial step of channel load by getting channel name through video player.
	else if (event.data.command == "tvc_channel_load") {
		// Get channel name from video player (must be done in injected script to get video player path)
		const channelName = getVideoPlayer()?.core?.state?.path?.split('hls/').pop().split('.')[0];

		// Set the stored channel volume (must be done in content script to access chrome stored sync values)
		window.postMessage({ command: "tvc_channel_load_set_volume", data: channelName }, "*");

		// Add volume listener for this channel (must be done in content script to store chrome sync values)
		window.postMessage({ command: "tvc_add_volume_listener", data: channelName }, "*");
    }
});

// https://github.com/cleanlock/VideoAdBlockForTwitch/blob/6464358b3991f8111ee594e15189bd56d0851e0e/firefox/content.js#L755
function getVideoPlayer(){
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

	let reactRootNode = null;
	const rootNode = document.querySelector('#root');
	if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot && rootNode._reactRootContainer._internalRoot.current) {
		reactRootNode = rootNode._reactRootContainer._internalRoot.current;
	}
	let videoPlayer = findReactNode(reactRootNode, node => node.setPlayerActive && node.props && node.props.mediaPlayerInstance);
	videoPlayer = videoPlayer && videoPlayer.props && videoPlayer.props.mediaPlayerInstance ? videoPlayer.props.mediaPlayerInstance : null;
	return videoPlayer;
}

