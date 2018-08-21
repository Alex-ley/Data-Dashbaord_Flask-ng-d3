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
			 "name": "Current",
			 "value": 100
		},
		{
			 "name": "Planned",
			 "value": 1000
		},
 		{
			"name": "Test",
			"value": 600
		},
 		{
			"name": "Test_2",
			"value": 1200
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

					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

	        var margin = {top: 0, right: 50, bottom: 30, left: 50},
							full_width = card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = card.getBoundingClientRect().width * (2/3),
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
	            .attr("x", function(d) { return x(0); })
	            .attr("y", function(d) { return y(d.name); })
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

					var card = d3.select(element[0]).node().parentNode;
					// console.log(card.getBoundingClientRect());

	        var margin = {top: 20, right: 30, bottom: 30, left: 40},
							full_width = card.getBoundingClientRect().width
							width = full_width - margin.left - margin.right,
							// width = 600 - margin.left - margin.right,
							// height = 400 - margin.top - margin.bottom;
							full_height = card.getBoundingClientRect().width * (2/3),
	            height = full_height - margin.top - margin.bottom;

	        var x = d3.scaleBand()
	            .rangeRound([0, width])
							.padding(0.1);
	        var y = d3.scaleLinear()
	            .range([height, 0]);
	        var xAxis = d3.axisBottom(x);
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
