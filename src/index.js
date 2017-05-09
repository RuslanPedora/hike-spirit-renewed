window.onresize = function( event ) {
	element = document.getElementById( 'mainBgImage' );
	if( window.innerWidth / window.innerHeight >= 2560/1600 ) {
		element.style.maxWidth = '100%';
		element.style.maxHeight = 'none';
	}
	else {
		element.style.maxHeight = '100%';
		element.style.maxWidth = 'none';
	}	
}