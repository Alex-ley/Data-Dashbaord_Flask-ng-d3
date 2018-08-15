var app = angular.module('myApp', []);
	app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {
    $scope.myData = [10,20,30,40,60];

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
   //in your HTML, this will be named as bars-chart
   app.directive('barsChart', ['$parse', function ($parse) {
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
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
           //a little of magic: setting it's width based
           //on the data value (d)
           //and text all with a smooth transition
         }
      };
      return directiveDefinitionObject;
   }]);
