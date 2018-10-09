const MongoClient = require('mongodb').MongoClient ;
const promise = require('promise');

class Connection {
    static connectToMongo() {
        console.log("Enterted.11 !");
        if ( this.database ) return Promise.resolve(this.database)
        return MongoClient.connect(this.url, this.options)
            .then(db =>{
                const dbConn = MongoClient.db(this.data);
                global.db = dbConn;
                console.log(db);     
            })
    }
    static closeConnection(){
        this.db.close();
    }
}

Connection.db = null
Connection.database = 'authentication';
Connection.url = 'mongodb://127.0.0.1:27017/'+this.database ;
Connection.options = {
    bufferMaxEntries:   0 ,
    reconnectTries:     5000
}

module.exports = { Connection }