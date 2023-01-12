// Get or set volume depending on message content.
window.addEventListener("message", (event) => {
    if (event.data.command == "tvc_get_volume") {
        window.postMessage({ command: "tvc_get_volume_reply", data: getVideoPlayer()?.getVolume() }, "*");
    }
    else if (event.data.command == "tvc_set_volume") {
        getVideoPlayer()?.setVolume(event.data.data);
    }
});


// https://github.com/cleanlock/VideoAdBlockForTwitch/blob/6464358b3991f8111ee594e15189bd56d0851e0e/firefox/content.js#L755
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

function getVideoPlayer(){
	var reactRootNode = null;
	var rootNode = document.querySelector('#root');
	if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot && rootNode._reactRootContainer._internalRoot.current) {
		reactRootNode = rootNode._reactRootContainer._internalRoot.current;
	}
	videoPlayer = findReactNode(reactRootNode, node => node.setPlayerActive && node.props && node.props.mediaPlayerInstance);
	videoPlayer = videoPlayer && videoPlayer.props && videoPlayer.props.mediaPlayerInstance ? videoPlayer.props.mediaPlayerInstance : null;
	return videoPlayer;
}

