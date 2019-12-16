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

    $('.trigger').click( (e) => {
        let id = e.currentTarget.id.toString();
        let mongoid = id.slice(7, id.length);
        let modalId = "modal" + mongoid;
        let x = $("#" + modalId);
        if (!x.is(':visible')) {
            x.show();
        } else {
            x.hide();
        }
    });

    $('.close-button').click( (e) => {
        let id = e.currentTarget.id.toString();
        let mongoid = id.slice(5, id.length);
        let modalId = "modal" + mongoid;
        let x = $("#" + modalId);
        if (!x.is(':visible')) {
            x.show();
        } else {
            x.hide();
        }
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