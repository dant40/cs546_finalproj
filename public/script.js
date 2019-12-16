$(document).ready(function() {
	$("#editBioButton").click( () => {
		$("#bioInfo").attr("readonly", false);
		$("#bioInfo").css("background-color", "#fff");
		$("#submitBioButton").show();
		$("#editBioButton").hide();
	});

	$("#submitBioButton").click( () => {
		$("#bioInfo").attr("readonly", true);
		$("#bioInfo").css("background-color", "#cae8cb");
		$("#submitBioButton").hide();
		$("#editBioButton").show();
	});

    function toggleModal() {
        $('.modal').toggleClass("show-modal");
    }

    $('.trigger').click( () => {
    	toggleModal();
    });

    $('.close-button').click( () => {
    	toggleModal();
    });

    $('#toggle').click( () => {
    	let x = $('#commentsContainer');
    	let y = $('#toggle');
    	if (!x.is(':visible')) {
    		x.show();
    		y.html('Hide Comments');
    	} else {
    		x.hide();
    		y.html('Show Comments');
    	}
    });
});