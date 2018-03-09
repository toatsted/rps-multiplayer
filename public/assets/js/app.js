let database = firebase.database();


$("#killSwitch").on("click", function(){
	database.ref("queue/").remove();
	database.ref("game/").remove();
	database.ref("chat/").remove();
})




$(() => {
	let title = $("#title");

	let Player = {
		name: steve
	}

	function startGame(){
		referanceHandler("game/");
		$("#message-box").removeClass("temp");
		// $(".area").empty();

		// let row = $("<div>").addClass("row");
		// let col = $("<div>").addClass("col-12");
		// let box = $("<div>").addClass("box").attr("id", "message-box")
		// 	.append($("<h2>").text("message"));
		// let area = $("<div>").addClass("area");
		// let form = $("<form>").attr("id", "message-form");
		// let input = $("<input>").attr("autocomplete", "off")
		// 	.attr("type", "text").attr("id", "message-input");
		// let button = $("<button>").attr("id", "submit-button")
		// 	.attr("type", "submit").text("send");
		// let messages = $("<div>").attr("id", "messages");

		// form.append(input);
		// form.append(button);
		// area.append(form);
		// area.append(messages);
		// box.append(area);
		// col.append(box);
		// row.append(col);

		// $(".container").append(row);



	}

	function referanceHandler(key) {
		database.ref(key).on("value", function(snapshot) {
			let data = snapshot.val();

			if(!data){
				data = [];
			}

			switch(key){
				case "queue/":
					if(data.length >= 2){
						// pair them in a game
						database.ref("game/").set(data);
						database.ref("queue/").remove();
						startGame();
					}

					$("#name-form").off("submit").on("submit", function(e) {
						e.preventDefault();

						let input = $("#name-input").val().trim();
						$("#name-input").val("");

						data.push(input);
						database.ref("queue/").set(data);
						console.log(data);
					})
				break;
				case "game/":

				break;
				case "chat/":
					$("#messages").empty();
					data.forEach((value) => {
						$("#messages").prepend(value);
					})

					$("#message-form").off("submit").on("submit", function(e){
						e.preventDefault();

						let message = $("#message-input").val().trim();
						$("#message-input").val("");

						let pTag = "<p><span class='redText'>" + Player.name + ": </span>" + message + "</p>";

						data.push(pTag);
						database.ref("chat/").set(data);
					})

				break;
			}

		})

	}
	referanceHandler("chat/");
	referanceHandler("queue/");
});