let database = firebase.database();


$("#killSwitch").on("click", function(){
	database.ref("queue/").remove();
	database.ref("game/").remove();
	database.ref("chat/").remove();
})


$(() => {
	let title = $("#title");

	let pTag;

	let Player = {
		name: ""
	}

	let Opponent = {
		name: ""
	}

	function startGame(){
		$("#message-box").removeClass("hide");

		$(".playArea").empty();
		$("#title").text("Supreme");
		
		$("#playerName").text(Player.name);
		$("#opponentName").text(Opponent.name);
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
						Player.name = input;

						data.push(input);
						database.ref("queue/").set(data);
						console.log(data);
					})
				break;
				case "game/":
					data.forEach((value) => {
						console.log(value);
						console.log(Player.name);
						if(!(value === Player.name)){
							Opponent.name = value;
							console.log(value);
						}
					})
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

						pTag = "<p><span class='redText'>" + Player.name + ": </span>" + message + "</p>";

						data.push(pTag);
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