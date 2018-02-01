// bring in mysql + inquirer packages 
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var purchaseSelection;
var products;


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
  
  });
}


function selectPurchase(){
connection.query("SELECT * from products", function(err,res){
     products = res;
  
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you would like to buy?",
            name: "id",
            // Not going to lie, I pretty much yanked this validation out of Peter's GreatBay
            // Was hoping someone could help me better understand it
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
           
            // validate: function (value){
            //     console.log("----------------------");
            //     console.log(parseInt(value))
            //     if(isNaN(value) === false || typeof value != 'String' ) {
            //         return true;
            //         console.log("NAN")
            //     }else if(value === undefined || value == "") {
            //         return false;
                    
            //     }
            //     else{
            //         return false;
                   
            //     }
            // }

          },
          
          {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: false
          }
        ])
       .then(function(inquirerRes){
            
          //  console.log(products)
            for(var  i=0; i < products.length; i++){
                if(inquirerRes.id == products[i].id){
                    console.log("You're interested in buying a " + products[i].product + " are you ? \n")
                    purchaseSelection = products[i];

                    
                }
               
            }
           confirmPurchase(purchaseSelection);
        });

        
    });
}

            
    
    function confirmPurchase(selection){
       // console.log(purchaseSelection)
       
            inquirer.prompt([
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "qty",
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
                    type: "confirm",
                    message: "Are you sure you want to buy that many ? " ,
                    name: "confirm",
                    default: false
                  }
                ])

                .then(function(inquirerRes){
                   
                    
                    // if it is in stock update the database and show the customer their total
                     
                    if(purchaseSelection.onHand >= inquirerRes.qty){
                        var newQuantity = purchaseSelection.onHand - inquirerRes.qty;
                        connection.query("UPDATE products SET ? WHERE ?", [{onHand: newQuantity }, {id:purchaseSelection.id}], function (err) {
                            if (err) throw err;
                            
                            
                        })
                        
                        var orderTotal =  purchaseSelection.price * inquirerRes.qty *1.06
                        console.log("Purchase made");
                        console.log("Your order of  " + inquirerRes.qty + " " + purchaseSelection.product + "(s) will cost : " )
                        console.log("$" +  orderTotal)   
                    }
                    // inform the customer of our insuffcient quantity and do nothing, maybe a good time to call our intial buy func?  
                    else{
                       console.log("Sorry we do not have enough in stock")
                    }

                });


            }
            displayProduct();
            selectPurchase();
           module.exports = displayProduct
        
 











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


//   const family = [ " Mom ", " Dad" , " Cait" , " Pat "];

// family.forEach(function(value, index, array){
//     console.log(value);
// })



