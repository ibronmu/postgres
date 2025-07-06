const {Client, Result} = require('pg');
const express = require('express')
const app = express();
app.use(express.json())
const con = new Client({
    host: "localhost",
    user:"postgres",
    port:5432,
    password:"Ibronmu@0770",
    database:"posts"
})
con.connect().then(()=>console.log('connected'))
app.post('/items',(req,res)=>{
const {name,id} = req.body;

const insert_query = 'INSERT INTO authors (name,id) VALUES($1,$2)'
con.query(insert_query,[name,id],(err,result)=>{
    if(err){
        res.send(err)
        console.log(err.message)
    }else{

        console.log(result)
        res.send('posted the author')
    }
})

})

app.get('/items',(req,res)=>{
const get_query = 'SELECT * FROM authors';
con.query(get_query,(err,result)=>{
    if(err){
        res.send('there was an error')
        console.log(err.message)
    }else{
        res.send(result.rows)
        console.log(result)
    }
})
})

app.get('/items/:id',(req,res)=>{

const id = req.params.id;
const request = "SELECT * FROM authors where id = $1"
con.query(request,[id],(err,result)=>{
    if(err){
        res.send(err.message)
        console.log(err.message)
    }else(
        res.send(result.rows[0])
    )
})
})
app.put('/items/update/:id',(req,res)=>{
    const id = req.params.id;
    const name = req.body.name;
    const query = 'UPDATE authors SET name = $1  where id = $2';
    con.query(query,[name,id],(err,result)=>{
if(err){
    res.send(err)
}else{
    res.send(result.rows)
}
    })
})
app.delete('/items/delete/:id',(req,res)=>{
const id = req.params.id;
const del_query = 'DELETE FROM authors where id = $1';
con.query(del_query,[id],(err,result)=>{
if(err){
    res.send(err)

}else{
    res.send('deleted')
}
}) 
})
app.listen(5000,()=>{
    console.log('listening ')
})