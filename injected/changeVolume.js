// Get or set volume depending on message content.
window.addEventListener("message", (event) => {
    if (event.data.command == "tvc_get_volume") {
        window.postMessage({ command: "tvc_get_volume_reply", data: getVideoPlayer()?.getVolume() }, "*");
    }
    else if (event.data.command == "tvc_set_volume") {
		console.log(getVideoPlayer());
        getVideoPlayer()?.setVolume(event.data.data);
    }
});

// https://github.com/cleanlock/VideoAdBlockForTwitch/blob/6464358b3991f8111ee594e15189bd56d0851e0e/chrome/remove_video_ads.js#L723
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

function getReactRootNode() {
	var reactRootNode = null;
	var rootNode = document.querySelector('#root');
	if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot && rootNode._reactRootContainer._internalRoot.current) {
		reactRootNode = rootNode._reactRootContainer._internalRoot.current;
	}
	return reactRootNode;
}

function getVideoPlayer() { 
	var videoPlayer = null;
	videoPlayer = findReactNode(getReactRootNode(), node => node.setPlayerActive && node.props && node.props.mediaPlayerInstance);
	videoPlayer = videoPlayer && videoPlayer.props && videoPlayer.props.mediaPlayerInstance ? videoPlayer.props.mediaPlayerInstance : null;
	return videoPlayer;
}



// // https://github.com/night/betterttv/blob/ebce0514e060da76063089bfbd6681b7bd93f111/src/utils/twitch.js#L77
// function getReactInstance(element) {
// 	for (const key in element) {
// 	  if (key.startsWith('__reactInternalInstance$')) {
// 		return element[key];
// 	  }
// 	}
  
// 	return null;
// }
// //https://github.com/SevenTV/Extension/blob/5f8f2477f1da02b5861de5ae336075d1819d1ad2/src/Sites/twitch.tv/Util/Twitch.ts#L19
// function findReactChildren(node, predicate, maxDepth = 15, depth = 0) {
// 	let success = false;
// 	try { success = predicate(node); } catch {}
// 	if (success) return node;
// 	if (!node || depth > maxDepth) return null;

// 	const { child, sibling } = node;
// 	if (child || sibling) {
// 		return findReactChildren(child, predicate, maxDepth, depth + 1) || findReactChildren(sibling, predicate, maxDepth, depth + 1);
// 	}

// 	return null;
// }
// // https://github.com/SevenTV/Extension/blob/5f8f2477f1da02b5861de5ae336075d1819d1ad2/src/Sites/twitch.tv/twitch.tsx#L176
// const mainLayout = document.querySelector('main.twilight-main, #root.sunlight-root > div:nth-of-type(3), #root[data-a-page-loaded-name="PopoutChatPage"] > div, #root[data-a-page-loaded-name="ModerationViewChannelPage"] > div:nth-of-type(1)');
// const mainLayoutReactInstance = getReactInstance(mainLayout);
// const router = findReactChildren(mainLayoutReactInstance,
// 	n => n.stateNode?.props?.history?.listen,
// 	100
// );
const router = findReactNode(getReactRootNode(), n => n.stateNode?.props?.history?.listen)
router.memoizedProps.history.listen((route, action) => {
	if(action !== "PUSH"){
		return;
	}
	
	const channelName = route.pathname.replace("/", "").toLowerCase();

	window.postMessage({ command: "tcv_set_volume", data: 1 }, "*");
});