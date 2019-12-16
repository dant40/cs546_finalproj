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

    $('.toggle').click( (e) => {
        let id = e.currentTarget.id.toString();
        let mongoid = id.slice(6, id.length);
        let x = $('#commentsContainer' + mongoid);
        let y = $("#" + id);
    	if (!x.is(':visible')) {
    		x.show();
    		y.html('Hide Comments');
    	} else {
    		x.hide();
    		y.html('Show Comments');
    	}
    });
});