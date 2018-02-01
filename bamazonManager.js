// import { type } from 'os';

//  var productDisplay = require("./bamazonCustomer.js")
var purchaseSelection;
var products;
var mysql = require('mysql');
var inquirer =require('inquirer');
var Table = require('cli-table');



var connection = mysql.createConnection({
    host : 'localhost',
    port:3306,
    user:'root',
    password:'chris',
    database: 'bamazon'
})

connection.connect(function(err){
    if(err) throw err;
})

function managerDisplay(){
// Inquier Prompot with a list of options
inquirer.prompt({
    name: 'manager',
    type: 'rawlist',
    message: ' \n \nwhat would you like to do Mr.Manager.... just manager not Mr.Manager',
    choices : ['View all products for sale' , 'View low inventory' , 'Add to Inventory', 'Add a new product']
     
})
.then(function(inqRes){
   
    switch(inqRes.manager){
       case 'View all products for sale': 
       return displayProduct()

       case 'View low inventory':
       return lowInventory()

       case 'Add to Inventory' :
       return addInventory();

       case 'Add a new product' :
       return addItem()
       
    }
      
});

}



function displayProduct(){
    console.log("\n \nThese are the current products we have in stock \n \n ------------------------------- \n")
    console.log
connection.query("SELECT * from products", function(err,res){
    if (err) throw err;
 

     var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔', 'top-right': '╗',   'bottom': '═' , 'bottom-mid': '╧' , 
            'bottom-left': '╚' , 'bottom-right': '╝',   'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
            , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }, 
             head: ['ID', 'Item', 'Department' , 'Price', 'Inventory']
           , colWidths: [10, 30, 30 , 10, 15]
         });
   for(var i =0; i < res.length; i++){
     

        table.push(
                 [res[i].id,  res[i].product, res[i].department_name, res[i].price, res[i].onHand]
               
             );
            
   } 
   console.log(table.toString());
  // connection.end();
  managerDisplay()
  });
}

function lowInventory(){
    connection.query("Select *from products WHERE onHand < 5",function(err,res){
       if (err) throw err;
       var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔', 'top-right': '╗',   'bottom': '═' , 'bottom-mid': '╧' , 
        'bottom-left': '╚' , 'bottom-right': '╝',   'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
        , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }, 
         head: ['ID', 'Item', 'Department' , 'Price', 'Inventory']
       , colWidths: [10, 30, 30 , 10, 15]
     });
for(var i =0; i < res.length; i++){
 

    table.push(
             [res[i].id,  res[i].product, res[i].department_name, res[i].price, res[i].onHand]
           
         );
        
} 
console.log(table.toString());
    })
  //  console.log("\n \n")
   // managerDisplay()
}



function addInventory(){
    var choiceObj;
    connection.query("Select * from products", function(err,res,){
        
    inquirer.prompt([
       { name: 'addItems',
        type: 'list',
        choices : function(){
        var choiceArr = [];
            for(var i=0; i < res.length; i++){
                choiceArr.push(res[i].product)
               
            }
            return choiceArr
        },
        message: 'Bruh, you better make sure your on hands are right, what do you want to order? \n'

    },
    {
        name: "quantity",
        type: "input",
        message: "How many do you want to order?"
      }

    

    ])
        
   

      .then(function(inqRes){
        var orderQuantity = inqRes.quantity
       
           for(var j =0; j < res.length; j++){
             if(res[j].product == inqRes.addItems){
                var newOnHand = res[j].onHand + parseInt(orderQuantity)
                connection.query("UPDATE products SET ? WHERE ?", [{onHand : newOnHand}, {product : inqRes.addItems}])

                console.log("Quantity ordered \n")
                console.log("Would you like to do anything else? \n")
                managerDisplay()
             }
            }
        //  console.log(res)
          // are set and where order interchangable within the syntax?
         // connection.query("UPDATE products SET ? WHERE ?", [{onHand : inqRes.quantity}, {product : inqRes.addItems}])
      }






    )},
   
      )}





   function addItem(){
        inquirer.prompt([
           {
                name : "item",
                type : "input",
                message: "What item would you like to add?"
    
           },
           {
               name : "dept",
               type : "input",
               message : "What department does the item belong to?"
           } ,
           {
               name : "retail",
               type : "input",
               message : "How much does it cost?",
               validate: function (value){

                if(value.trim() == ""|| value == null) {
                   
                    
                    return false;
                }else if(isNaN(value) === false) {
                    return true;
                    
                }
                else{
                    return false;
                   
                }
            }
           },
           {
               name: "orderQty",
               type : "input",
               message : "How many would you like to order?",
               validate: function (value){

                if(value.trim() == ""|| value == null) {
                   
                    
                    return false;
                }else if(isNaN(value) === false) {
                    return true;
                    
                }
                else{
                    return false;
                   
                }
            }
           }

        ])

    .then(function(inquirerRes){
          
    connection.query(
    "INSERT INTO products SET ?",
    {
      product : inquirerRes.item,
      department_name : inquirerRes.dept,
      price : inquirerRes.retail,
      onHand : inquirerRes.orderQty
    },

    function(err) {
        if (err) throw err;
       
      }
    );
  });
}
   
   managerDisplay()
    

