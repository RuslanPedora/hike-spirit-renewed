elementMainInage = document.getElementById('mainBgImage');
window.onresize = (event) => {	
	alignImage();
}
function alignImage() {
	if (window.innerWidth / window.innerHeight >= 2560/1600) {
		elementMainInage.style.maxWidth = '100%';
		elementMainInage.style.maxHeight = 'none';
	}
	else {
		elementMainInage.style.maxHeight = '100%';
		elementMainInage.style.maxWidth = 'none';
	}	
}
alignImage();