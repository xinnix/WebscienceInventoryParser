var lineReader = require('line-reader');
var nodeExcel  = require('excel-export');


var conf = {};

var re = new RegExp(/^[1-9]\d*$/g);
keywords = ['By:','Source:','Research Fields:','Times Cited:'];
otherkey = ['ESI Hot','Research Front'];
oneInv = {};


var trim = function(str) {
    //return this.replace(/[(^\s+)(\s+$)]/g,"");//會把字符串中間的空白符也去掉
    //return this.replace(/^\s+|\s+$/g,""); //
    return str.replace(/^\s+/g,"").replace(/\s+$/g,"");
}

function isEmpty(obj)
{
    for (var name in obj)
    {
        return false;
    }
    return true;
};

function parserLine(line){
	line = trim(line);
	if(line.length!=0){
		var res = line.match(re);
		if(res){
			console.log(oneInv);
			console.log('hello');
			if(!isEmpty(oneInv)){
				
				var a = [];
				for (x in oneInv){
					a.push(oneInv[x]);
				}
				conf.rows.push(a);
				console.log(conf.rows);

			}
			oneInv['order']=res[0];
			return;
		}
		for(key in keywords){
			var pos = line.indexOf(keywords[key]);
			// console.log('keywords:'+key);
			if(pos!=-1){
				oneInv[keywords[key]]= line.substring(pos+keywords[key].length);
				return;
			}
		}

		for(key in otherkey){
			var pos = line.indexOf(otherkey[key]);
			// console.log('keywords:'+key);
			if(pos!=-1){
				return;
			}
		}

		oneInv['title'] = line;
	}

}
var count = 0;
function readfile(name){
	lineReader.eachLine(name, function(line, last) {

		 console.log(line);
		// console.log(count++);
  		parserLine(line);
		// console.log(Object.getOwnPropertyNames(oneInv).length);
  		
  		
		
 	 	if (/* done */last) {
 	 		if(!isEmpty(oneInv)){
				
				var a = [];
				for (x in oneInv){
					a.push(oneInv[x]);
				}
				conf.rows.push(a);
				console.log(conf.rows);

			}
 	 		var result = nodeExcel.execute(conf);

			var fs=require("fs");  
			fs.writeFile('./1.xlsx',result,'binary',function(err){
			if(err) throw err;
			console.log('complete');
			});
   		 	return false; // stop reading
  		}
	});
}

 readfile('a.txt');

// console.log(isEmpty(oneInv));
// a = 'Times Cited: 840';
// parserLine(a);

// console.log(oneInv);



conf.cols = [{
	caption:'order',
	type:'string'
},{
	caption:'Title',
	type:'string',
},{
	caption:'Author',
	type:'string'
},{
	caption:'Source',
	type:'string'
},{
	caption:'Research Fields',
	type:'string'
},{
	caption:'Times Cited',
	type:'string' 
}
];
conf.rows = [
     
    ];

// var result = nodeExcel.execute(conf);

// var fs=require("fs");  
// fs.writeFile('./1.xslx',result,'binary',function(err){
// 	if(err) throw err;
// 	console.log('complete');
// });