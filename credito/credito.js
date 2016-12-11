var builder = require('botbuilder');
var restify = require('restify');
//var githubClient = require('./githubClient');

//setup restify
//setup resfity server
var server = new restify.createServer();
server.listen(process.env.port||process.env.PORT||3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

//create the bot
var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


bot.dialog('/', [
    function(session){
        //select options
        builder.Prompts.choice(session, "欢迎使用",'Consultar|Agregar Referencia|Eliminar Referencia');
    },
    function(session, results){
        switch(results.response.index){
            case 0:
                session.beginDialog('/Consultar');
                break;
            case 1:
                session.beginDialog('/Agregar Referencia');
                break;
            case 2:
                session.beginDialog('/Eliminar Referencia');
                break;
            default:
                session.endDialog();
                break;
         }
    },
    function (session, results) {
        // Reload bienvenida
        session.replaceDialog('/Menu');
    }
]).reloadAction('showMenu', null, { matches: /^(Menu|back)/i });
 
//  CONSULTAR 
bot.dialog('/Consultar', [
    
    function(session){
      //  session.send(session, results.response);
        builder.Prompts.text(session, "Ingrese su cédula");
    },
     function(session, results){
        session.userData.text = results.response;
        builder.Prompts.text(session, "Cédula de referencia");
    },
    function(session, results){
        session.userData.coding = results.response;   
        session.send("El num cedula suyo es: "+session.userData.text+" El de su clientes es: "+session.userData.coding+".");
    }
]);

// AGREGAR REFERENCIA
bot.dialog('/Agregar Referencia', [
    
    function(session){
      //  session.send(session, results.response);
        builder.Prompts.text(session, "Escriba el nombre completo");
    },
     function(session, results){
        session.userData.name = results.response;
        builder.Prompts.text(session, "Escriba número de cédula");
    },
    function(session, results){
        session.userData.coding = results.response;   
        session.send("Nombre: "+session.userData.name+' \n'+"Cedula: "+session.userData.coding+".");
    }
    ]);

// ELIMINAR REFERENCIA
bot.dialog('/Eliminar Referencia', [
    function(session){
      //  session.send(session, results.response);
        builder.Prompts.text(session, "Ingrese su cédula");
    },
    function(session, results){
        session.userData.text =results.response;
        builder.Prompts.text(session, "Escriba número de cédula de referencia");
    },
    function(session, results){
        session.userData.coding = results.response;   
        session.send("Cédula Eliminada: "+session.userData.coding);
    }
    ]);










