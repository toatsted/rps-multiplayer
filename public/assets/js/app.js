let database = firebase.database();


$("#killSwitch").on("click", function(){
	database.ref("queue/").remove();
	database.ref("game/").remove();
})




$(() => {
	let title = $("#title");

	function startGame(){
		$(".area").empty();
	}

	// when the queue attribute changes
	database.ref("queue/").on("value", function(snapshot) {
		let data = snapshot.val();

		// if there isnt a queue, make one
		if(!data){
			data = [];
		}

		// if theres 2 people in the queue
		if(data.length >= 2){
			// pair them in a game
			database.ref("game/").set(data);
			database.ref("queue/").remove();
			startGame();
		}

		// when you submit form
		$("form").off("submit").on("submit", function(e) {
			e.preventDefault();

			// take nickname
			let input = $("#name-input").val().trim();
			$("#name-input").val("");

			// put nickname into data and set data to queue attr
			data.push(input);
			database.ref("queue/").set(data);
			console.log(data);
		})
	})

});