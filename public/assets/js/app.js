let database = firebase.database();


$("#kill-switch").on("click", function() {
	database.ref("queue/").remove();
	database.ref("chat/").remove();
	database.ref("game/").remove();
})


$(() => {
	let title = $(".title");
	let Player = { name: "", choice: "" }
	let Opponent = { name: "", chioce: "" }

	function startGame() {
		database.ref("chat/").remove();
		$("#message-box").removeClass("hide");

		$(".play-area").empty();
		$(".title").text("Rock, Paper, Scissors");

		$("#player-name").text(Player.name);
		$("#opponent-name").text(Opponent.name);
	}

	function referanceHandler(key) {
		database.ref(key).on("value", function(snapshot) {
			let data = snapshot.val();


			if (!data) {
				data = [];
			}

			switch (key) {
				case "queue/":
					if (data.length >= 2) {
						// pair them in a game
						database.ref("game/").set(data);
						database.ref("queue/").remove();
						startGame();
					}

					$("#name-form").off("submit").on("submit", function(e) {
						e.preventDefault();

						if($("#name-input").val().trim()){
							let input = $("#name-input").val().trim();
							$("#name-input").val("");
							Player.name = input;

							data.push(input);
							database.ref("queue/").set(data);
						}
					})
					break;
				case "game/":
					data.forEach((value) => {
						if (!(value === Player.name)) {
							Opponent.name = value.name;
						}
					})
					break;
				case "chat/":
					$("#messages").empty();
					data.forEach((value) => {
						$("#messages").prepend(
							$("<p>").text(": " + value.message).prepend(
								$("<span>").text(value.name).addClass(
									(Player.name === value.name) ? "redText" : "")));
					})

					$("#message-form").off("submit").on("submit", function(e) {
						e.preventDefault();

						let message = $("#message-input").val().trim();
						$("#message-input").val("");

						data.push({ message: message, name: Player.name });
						database.ref("chat/").set(data);
					})

					break;
			}

		})

	}
	referanceHandler("chat/");
	referanceHandler("queue/");
	referanceHandler("game/");
});