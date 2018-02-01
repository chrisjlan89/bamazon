// bring in mysql + inquirer packages 
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var purchaseSelection;

// create a connection to the datase 
var connection = mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password: 'chris',
    database: 'bamazon'

});

// execute a connection 
connection.connect(function(err) {
    if (err) throw err;
   
})


function displayProduct(){
    console.log("\n \nThese are the current products we have in stock \n \n ------------------------------- \n")
    console.log
connection.query("SELECT * from products", function(err,res){
    if (err) throw err;
  //   console.log(" |" + "ID" + " | " + "PRODUCT" + " | " +  "Department" + " | " + "Price" + " | "  + "Quantity")
  //   console.log("_ __ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _")

     var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔', 'top-right': '╗',   'bottom': '═' , 'bottom-mid': '╧' , 
            'bottom-left': '╚' , 'bottom-right': '╝',   'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
            , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }, 
             head: ['ID', 'Item', 'Department' , 'Price', 'Inventory']
           , colWidths: [10, 30, 30 , 10, 15]
         });
   for(var i =0; i < res.length; i++){
       // console.log(" | " + res[i].id + " | " + res[i].product + " |    " +  res[i].department_name + " | " + res[i].price + " | "  + res[i].onHand)

        table.push(
                 [res[i].id,  res[i].product, res[i].department_name, res[i].price, res[i].onHand]
               
             );
            
   } 
   console.log(table.toString());
  // connection.end();
  selectPurchase();
  });
}


function selectPurchase(){
connection.query("SELECT * from products", function(err,res){
     var products = res;
   //  var i = 0;
   var j =0;
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you would like to buy?",
            name: "id",
            // Not going to lie, I pretty much yanked this validation out of Peter's GreatBay
            // Was hoping someone could help me better understand it
            validate: function (value){
                if(isNaN(value) === false ) {
                    return true;
                    console.log("NAN")
                }else if(value == undefined) {
                    return false;
                    
                }
                else{
                    return false;
                   
                }
            }

          },
          
          {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: false
          }
        ])
       .then(function(inquirerRes){
            console.log(inquirerRes.id)
          //  console.log(products)
            for(var  i=0; i < products.length; i++){
                if(inquirerRes.id == products[i].id){
                    console.log(products[i].product)
                   // j = i;
                    
                }
               
            }

        //    function something(){
            inquirer.prompt([
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "qty",
                    validate: function (value ){
                        if(isNaN(value) === false) {
                            return true;
                        }else {
                            return false;
                        }
                    }
                  },
                
                  {
                    type: "confirm",
                    message: "Are you sure:",
                    name: "confirm",
                    default: false
                  }
                ])

                .then(function(inquirerRes){
                   
                    
                    // if it is in stock update the database and show the customer their total
                    if(products[i -1].onHand >= inquirerRes.qty){
                        var newQuantity = products[i -1].onHand - inquirerRes.qty;
                        connection.query("UPDATE products SET ? WHERE ?", [{onHand: newQuantity }, {id:products[i -1].id}], function (err) {
                            if (err) throw err;
                            console.log("Purchase made");
                            
                        })
                       
                        console.log(products[i -1].price * inquirerRes.qty)   
                    }
                    // inform the customer of our insuffcient quantity and do nothing, maybe a good time to call our intial buy func?  
                    else{
                       console.log("Sorry we do not have enough in stock")
                    }

                });


          //  }
       //  makePurchase()  
       // first .then currently ends down here, would like refactor

       });

        
});
}

// function start() {
//     inquirer.prompt({
//         name: 'postOrBid',
//         type: 'rawlist',
//         message: 'Would you like to [POST] an auction or [BID] on an auction?',
//         choices: ['POST', 'BID']
//     })
//     .then(function(answer) {
//       if(answer.postOrBid === "POST"){
//         postAuction();
//       }else{
//           bidAuction();
//       } 
//     })
// }



displayProduct();


//   const family = [ " Mom ", " Dad" , " Cait" , " Pat "];

// family.forEach(function(value, index, array){
//     console.log(value);
// })



