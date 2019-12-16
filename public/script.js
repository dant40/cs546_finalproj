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
});