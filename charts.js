var app = angular.module('myApp', []);
	app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {

		$scope.myData = [{
			 "name": "Current",
			 "value": 10
		},
		{
			 "name": "Planned",
			 "value": 20
		},
 		{
			"name": "Test",
			"value": 30
		},
 		{
			"name": "Test_2",
			"value": 40
		},
 		{
			"name": "Test_3",
			"value": 50
		},
 		{
			"name": "Test_4",
			"value": 60
		}];

		$scope.myData_2 = [{
			 "name": "Jan",
			 "value": 300
		},
		{
			 "name": "Feb",
			 "value": 1000
		},
 		{
			"name": "Mar",
			"value": 600
		},
 		{
			"name": "Apr",
			"value": 1400
		},
		{
			"name": "May",
			"value": 800
		},
 		{
			"name": "Jun",
			"value": 950
		}];

    // $http.get('myData.json').then(function(response){
		// 	console.log('fetch succesful');
		// 	// console.log(response.data);
		// 	$scope.existing_options = response.data;
		// },function(error){
		// 	console.log('fetch error');
		// 	console.log(error);
		// });
  }]);


   //camel cased directive name
   //in your HTML, this will be named as v-bars-chart
   app.directive('basicHBarsChart', ['$parse', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           //but we won't need that this time
           var chart = d3.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             // .transition().ease("elastic")
             .transition()
             .duration(750)
             .ease(d3.easeLinear)
             .style("width", function(d) { return d.value + "%"; })
             .text(function(d) { return d.value + "%"; });
           //a little of magic: setting it's width based
           //on the data value (d)
           //and text all with a smooth transition
         }
      };
      return directiveDefinitionObject;
   }]);

	 app.directive('hBarsChart', ['$parse', function ($parse) {
		 var directiveDefinitionObject = {
				 restrict: 'E',
				 replace: false,
				 scope: {data: '=chartData'},
				 link: function (scope, element, attrs) {
					var color = d3.scaleOrdinal(d3.schemePastel1); //d3.schemeCategory10
					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

	        var margin = {top: 0, right: 50, bottom: 30, left: 50},
							full_width = 600 //card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = full_width * (2/3),
	            height = full_height - margin.top - margin.bottom;

					var x = d3.scaleLinear()
	            .range([0, width]);
	        var y = d3.scaleBand()
	            .rangeRound([0, height]) //to flip the category order use [height, 0]
							.padding(0.1);
	        var xAxis = d3.axisBottom(x)
							.ticks(8);
	        var yAxis = d3.axisLeft(y);
					var div = d3.select(element[0]).append("div")
							.classed("graph", true);
					div.append("canvas") //To allow correct dynamic sizing for IE
							.attr("width", full_width)
							.attr("height", full_height);
	        var chart = div.append("svg") //d3.select(element[0]).append("svg")
							.attr("viewBox", "0 0 " + full_width + " " + full_height )
							.attr("preserveAspectRatio", "xMinYMin")
	            // .attr("width", full_width)
	            // .attr("height", full_height)
	            .append("g")
	            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	        y.domain(scope.data.map(function(d) { return d.name; }));
	        x.domain([0, d3.max(scope.data, function(d) { return d.value; })]);
	        chart.append("g")
	            .attr("class", "x axis")
							.attr("font-size", "14")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis);
	        chart.append("g")
	            .attr("class", "y axis")
							.attr("font-size", "14")
	            .call(yAxis);
	        var bar = chart.selectAll(".bar")
	            .data(scope.data);
	        bar.enter().append("rect")
	            .attr("class", "bar")
	            .attr("x", function(d) { return x(2); })
	            .attr("y", function(d) { return y(d.name); })
							.attr("fill", function(d, i) { return d3.interpolateRainbow(i * (1 / scope.data.length)); } ) //return color(i)
							.attr("fill-opacity","0.6")
	            .attr("width", function(d) { return x(d.value); })
	            .attr("height", y.bandwidth());
	        chart.selectAll(".text")
	            .data(scope.data)
	            .enter()
	            .append("text")
	            .attr("class","label")
	            .attr("y", (function(d) { return y(d.name) + (y.bandwidth()/2); })) //to vetically align in the middle of the bar
							.attr("font-size", "12")
							.attr("text-anchor","left")
							// .attr("dy",".4em") //to vetically align in the middle of the bar, this also works in IE
							.attr("alignment-baseline", "middle") //to vetically align in the middle of the bar
	            .attr("x", function(d) { return x(d.value) + 5; })
	            .text(function(d) { return d.value.toFixed(0); });

							element.bind("onresize", function(){
								alert('test');
							})
				 }
			};
			return directiveDefinitionObject;
	 }]);

	 app.directive('vBarsChart', ['$parse', function ($parse) {
		 var directiveDefinitionObject = {
				 restrict: 'E',
				 replace: false,
				 scope: {data: '=chartData'},
				 link: function (scope, element, attrs) {
					var color = d3.scaleOrdinal(d3.schemeCategory10);
					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

	        var margin = {top: 20, right: 30, bottom: 30, left: 40},
							full_width = 600 //card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = full_width * (2/3),
							height = full_height - margin.top - margin.bottom;

	        var x = d3.scaleBand()
	            .rangeRound([0, width])
							.padding(0.1);
	        var y = d3.scaleLinear()
	            .range([height, 0]);
	        var xAxis = d3.axisBottom(x);
	        var yAxis = d3.axisLeft(y)
							.ticks(8);
					var div = d3.select(element[0]).append("div")
							.classed("graph", true);
					div.append("canvas") //To allow correct dynamic sizing for IE
							.attr("width", full_width)
							.attr("height", full_height);
	        var chart = div.append("svg") //d3.select(element[0]).append("svg")
							.attr("viewBox", "0 0 " + full_width + " " + full_height )
							.attr("preserveAspectRatio", "xMinYMin")
	            // .attr("width", full_width)
	            // .attr("height", full_height)
	            .append("g")
	            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	        x.domain(scope.data.map(function(d) { return d.name; }));
	        y.domain([0, d3.max(scope.data, function(d) { return d.value; })]);
	        chart.append("g")
	            .attr("class", "x axis")
							.attr("font-size", "14")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis);
	        chart.append("g")
	            .attr("class", "y axis")
							.attr("font-size", "14")
	            .call(yAxis);
	        var bar = chart.selectAll(".bar")
	            .data(scope.data);
	        bar.enter().append("rect")
	            .attr("class", "bar")
	            .attr("x", function(d) { return x(d.name); })
	            .attr("y", function(d) { return y(d.value); })
							.attr("fill", function(d, i) { return d3.interpolateRainbow(i * (1 / scope.data.length)); } ) //return color(i)
							.attr("fill-opacity","0.6")
	            .attr("height", function(d) { return height - y(d.value); })
	            .attr("width", x.bandwidth());
	        chart.selectAll(".text")
	            .data(scope.data)
	            .enter()
	            .append("text")
	            .attr("class","label")
	            .attr("x", (function(d) { return x(d.name) + (x.bandwidth()/2); })) //to horizontally align in the middle of the bar
							.attr("font-size", "12")
							.attr("text-anchor","middle") //to horizontally align in the middle of the bar
	            .attr("y", function(d) { return y(d.value) - 15; })
	            .attr("dy", ".75em")
	            .text(function(d) { return d.value.toFixed(0); });

				 }
			};
			return directiveDefinitionObject;
	 }]);

	 app.directive('pieChart', ['$parse', function ($parse) {
		 var directiveDefinitionObject = {
				 restrict: 'E',
				 replace: false,
				 scope: {data: '=chartData'},
				 link: function (scope, element, attrs) {

					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

					var margin = {top: 20, right: 30, bottom: 30, left: 40},
							full_width = 600 //card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = full_width * (2/3),
							height = full_height - margin.top - margin.bottom;

					var w = full_width, //300,                       			//width
			 	    h = full_height, //300,                         		//height
			 	    r = Math.min(full_width, full_height) / 2; //100,  	//radius
			 	    // color = d3.scale.category20c(); //V3
			 			color = d3.scaleOrdinal(d3.schemeCategory10);     //builtin range of colors V5

					var div = d3.select(element[0]).append("div")
							.classed("graph", true);
					div.append("canvas") //To allow correct dynamic sizing for IE
							.attr("width", full_width)
							.attr("height", full_height);
					var chart = div.append("svg") //d3.select(element[0]).append("svg")
							.attr("viewBox", "0 0 " + full_width + " " + full_height )
							.attr("preserveAspectRatio", "xMinYMin")
							// .attr("width", full_width)
							// .attr("height", full_height)
							.append("g") //make a group to hold our pie chart
							.attr("transform", "translate(" + full_width/2 + "," + full_height/2 + ")"); //move the center of the pie chart from 0, 0 to radius, radius

					chart.append("g")
							.attr("class", "slices");
					chart.append("g")
							.attr("class", "labels");
					chart.append("g")
							.attr("class", "lines");

			    var arc = d3.arc()              //this will create <path> elements for us using arc data
							.innerRadius(0)
							.outerRadius(r * 0.9);
							// .startAngle(0)
							// .endAngle(Math.PI * 2);

					var outerArc = d3.arc()
							.innerRadius(r * 0.8)
							.outerRadius(r);

			    var pie = d3.pie()           //this will create arc data for us given a list of values
							.value(function(d) { return d.value; })
							(scope.data);    //we must tell it out to access the value of each element in our data array
					console.log(pie);
			    var arcs = chart.select(".slices").selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
			        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			            .append("g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
			            .attr("class", "slice");    //allow us to style things in the slices (like text)

			        arcs.append("path")
			                .attr("fill", function(d, i) { return d3.interpolateRainbow(i * (1 / scope.data.length)); } ) //return color(i) //set the color for each slice to be chosen from the color function defined above
											.attr("stroke", function(d, i) { return d3.interpolateRainbow(i * (1 / scope.data.length)); } )
											.attr("fill-opacity","0.6")
											.attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

					function midAngle(d){
								return d.startAngle + (d.endAngle - d.startAngle)/2;
					}

			    var labels = chart.select(".labels").selectAll("text.label")
											.data(pie)
											.enter()
													.append("text")
													.attr("alignment-baseline", "middle")
													.attr("class","label")                                     //add a label to each slice
			                		.attr("transform", function(d) {                    //set the label's origin to the center of the arc
							                //we have to make sure to set these before calling arc.centroid
							                d.innerRadius = 0;
							                d.outerRadius = r;
															var pos = outerArc.centroid(d);
															pos[0] = r * (midAngle(d) < Math.PI ? 1 : -1);
							                return "translate(" + pos + ")";        //this gives us a pair of coordinates like [50, 50]
			            				})
							            .attr("text-anchor", function(d){return midAngle(d) < Math.PI ? "start":"end";})                          //center the text on it's origin
							            .text(function(d) { return d.data.name; }); //.text(function(d, i) { return data[i].name; });

					var lines = chart.select(".lines").selectAll("polyline.line")
											.data(pie)
											.enter()
													.append("polyline")
													.attr("fill", "none")
													.attr("stroke", "black")
													.attr("points",function(d){
															var pos = outerArc.centroid(d);
															pos[0] = r * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
															return [arc.centroid(d), outerArc.centroid(d), pos];
													})

				 }
			};
			return directiveDefinitionObject;
	 }]);

	 app.directive('lineChart', ['$parse', function ($parse) {
		 var directiveDefinitionObject = {
				 restrict: 'E',
				 replace: false,
				 scope: {data: '=chartData'},
				 link: function (scope, element, attrs) {
					var color = d3.scaleOrdinal(d3.schemeCategory10);
					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

	        var margin = {top: 20, right: 30, bottom: 30, left: 40},
							full_width = 600 //card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = full_width * (2/3),
							height = full_height - margin.top - margin.bottom;

	        var x = d3.scaleBand()
	            .rangeRound([0, width])
							.padding(0.1);
	        var y = d3.scaleLinear()
	            .range([height, 0]);
	        var xAxis = d3.axisBottom(x);
	        var yAxis = d3.axisLeft(y)
							.ticks(8);
					var div = d3.select(element[0]).append("div")
							.classed("graph", true);
					div.append("canvas") //To allow correct dynamic sizing for IE
							.attr("width", full_width)
							.attr("height", full_height);
	        var chart = div.append("svg") //d3.select(element[0]).append("svg")
							.attr("viewBox", "0 0 " + full_width + " " + full_height )
							.attr("preserveAspectRatio", "xMinYMin")
	            // .attr("width", full_width)
	            // .attr("height", full_height)
	            .append("g")
	            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					var yMax = d3.max(scope.data, function(d) { return d.value; })
					console.log(yMax);
	        x.domain(scope.data.map(function(d) { return d.name; }));
	        y.domain([0, yMax]);

	        chart.append("g")
	            .attr("class", "x axis")
							.attr("font-size", "14")
	            .attr("transform", "translate(0," + height + ")")
	            .call(xAxis);
	        chart.append("g")
	            .attr("class", "y axis")
							.attr("font-size", "14")
	            .call(yAxis);
					var line = d3.line()
							.x(function(d,i){return x(d.name) + (x.bandwidth()/2);})
							.y(function(d,i){return y(d.value);})
							.curve(d3.curveCardinal);

	        var path = chart.selectAll(".line")
	            .data(scope.data);
	        path.enter().append("path")
	            .attr("class", "line")
	            .attr("d", line(scope.data))
							.attr("stroke", "black")
							.attr("fill", "none");

					chart.selectAll(".marker")
	            .data(scope.data)
	            .enter()
	            .append("circle")
	            .attr("class","marker")
	            .attr("cx", (function(d) { return x(d.name) + (x.bandwidth()/2); })) //to horizontally align in the middle of the bar
							.attr("fill", "black")
	            .attr("cy", function(d) { return y(d.value);})
	            .attr("r", (x.bandwidth()/4)); // function(d) {return (d.value / yMax) * (x.bandwidth()/4) + (x.bandwidth()/4);});

	        chart.selectAll(".text")
	            .data(scope.data)
	            .enter()
	            .append("text")
	            .attr("class","label")
	            .attr("x", (function(d) { return x(d.name) + (x.bandwidth()/2); })) //to horizontally align in the middle of the bar
							.attr("fill", "white")
							.attr("font-size", "12")
							.attr("text-anchor","middle") //to horizontally align in the middle of the bar
							.attr("alignment-baseline", "hanging") //to vetically align in the middle of the bar
	            .attr("y", function(d) { return y(d.value) - 15; })
	            .attr("dy", ".75em")
	            .text(function(d) { return d.value.toFixed(0); });

				 }
			};
			return directiveDefinitionObject;
	 }]);

	app.directive('areaChart', ['$parse', function ($parse) {
		var directiveDefinitionObject = {
				restrict: 'E',
				replace: false,
				scope: {data: '=chartData'},
				link: function (scope, element, attrs) {
				 var color = d3.scaleOrdinal(d3.schemeCategory10);
				 var card = d3.select(element[0]).node().parentNode;
				 // console.log(card.getBoundingClientRect());

				 var margin = {top: 20, right: 30, bottom: 30, left: 40},
						 full_width = 600 //card.getBoundingClientRect().width
						 width = full_width - margin.left - margin.right,
						 // width = 600 - margin.left - margin.right,
						 // height = 400 - margin.top - margin.bottom;
						 full_height = full_width * (2/3),
						 height = full_height - margin.top - margin.bottom;

				 var x = d3.scaleBand() //FIGURE THIS OUT
						 .range([0, width]);

				 var y = d3.scaleLinear()
						 .range([height, 0]);

				 var xAxis = d3.axisBottom(x);
				 var yAxis = d3.axisLeft(y)
						 .ticks(8);
				 var div = d3.select(element[0]).append("div")
						 .classed("graph", true);
				 div.append("canvas") //To allow correct dynamic sizing for IE
						 .attr("width", full_width)
						 .attr("height", full_height);
				 var chart = div.append("svg") //d3.select(element[0]).append("svg")
						 .attr("viewBox", "0 0 " + full_width + " " + full_height )
						 .attr("preserveAspectRatio", "xMinYMin")
						 // .attr("width", full_width)
						 // .attr("height", full_height)
						 .append("g")
						 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				 var yMax = d3.max(scope.data, function(d) { return d.value; })
				 console.log(yMax);
				 x.domain(scope.data.map(function(d) { return d.name; }));
				 y.domain([0, yMax]);

				 var area = d3.area()
				 		.x(function(d) { return x(d.name); })
				 		.y1(function(d) { return y(d.value); })
						.y0(height);

				console.log(area(scope.data));

 				 var path = chart.append("path")
 						 .attr("class", "area")
 						 .attr("d", area(scope.data)) // line(scope.data))
 						 .attr("fill", "steelblue");

				 xAx = chart.append("g")
						 .attr("class", "x axis")
						 .attr("font-size", "14")
						 .attr("transform", "translate(0," + height + ")")
						 .call(xAxis);

				xAx.selectAll(".tick")
							.data(scope.data)
						 .attr("translate", function(d){"(" + x(d) + ",0)";});
				 chart.append("g")
						 .attr("class", "y axis")
						 .attr("font-size", "14")
						 .call(yAxis);

				 // var line = d3.line()
					// 	 .x(function(d,i){return x(d.name) + (x.bandwidth()/2);})
					// 	 .y(function(d,i){return y(d.value);})
					// 	 .curve(d3.curveCardinal);

				 // chart.selectAll(".marker")
					// 	 .data(scope.data)
					// 	 .enter()
					// 	 .append("circle")
					// 	 .attr("class","marker")
					// 	 .attr("cx", (function(d) { return x(d.name); })) //to horizontally align in the middle of the bar
					// 	 .attr("fill", "black")
					// 	 .attr("cy", function(d) { return y(d.value);})
					// 	 .attr("r", (x(0)/4)); // function(d) {return (d.value / yMax) * (x.bandwidth()/4) + (x.bandwidth()/4);});

				 chart.selectAll(".text")
						 .data(scope.data)
						 .enter()
						 .append("text")
						 .attr("class","label")
						 .attr("x", (function(d) { return x(d.name); })) //to horizontally align in the middle of the bar
						 .attr("fill", "black")
						 .attr("font-size", "12")
						 .attr("text-anchor","middle") //to horizontally align in the middle of the bar
						 .attr("alignment-baseline", "hanging") //to vetically align in the middle of the bar
						 .attr("y", function(d) { return y(d.value) - 15; })
						 .attr("dy", ".75em")
						 .text(function(d) { return d.value.toFixed(0); });

				}
		 };
		 return directiveDefinitionObject;
	}]);
