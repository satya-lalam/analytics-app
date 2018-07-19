var express = require('express')
var fs = require('fs')

var app = express()
var result = JSON.parse(fs.readFileSync("product-revenue.json"));

function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group]; 
  })
}

var groupedResult = groupBy(result, function(item)
{
  return [item.year, item.product, item.country];
});
var obj;
var productRevenue =[];
for(var i=0; i<groupedResult.length; i++){
    var sum=0;
    for(var j=0; j<groupedResult[i].length; j++){
        sum = sum + groupedResult[i][j].revenue;
    }
    obj = '{"year":"'+ groupedResult[i][0].year+
    '", "product":"'+ groupedResult[i][0].product+
    '", "country":"'+ groupedResult[i][0].country+
    '", "totalrevenue":"'+sum+
    '"}';
    productRevenue.push(JSON.parse(obj));
}

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/api/products', function (req, res) {
    res.contentType('application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(productRevenue);
})
 
app.listen(4000)