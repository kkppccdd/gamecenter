google.load("jquery", "1");

asyncTest( "Create room", function() {
  // 
	$.ajax({
		  type: "POST",
		  url: "/rest/room",
		  contentType: "application/json",
		  data: JSON.stringify({kind:"card",name:"test"}),
		  success: function(result){
			  ok(result.kind == "card");
			  ok(result.name=="test");
			  ok(result.id)
		  },
		  dataType: "json"
		});
});