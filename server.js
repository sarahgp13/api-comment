'use strict';

const Hapi=require('hapi');
const mongoose = require('mongoose');
//const cors = require('cors')

mongoose.connect('mongodb://sarah:password1@ds155903.mlab.com:55903/blog-comments', {useMongoClient: true})
mongoose.connection.on('connected', () => {
    console.log('connected to database')
})

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:5000,
    routes: {cors: true},
});

// setting up the required schemas and models in this file
const Comment = require ('./models/test')

// Add the route
server.route({
    method:'GET',
    path:'/comment',
    handler:(req, res) => {
        return Comment.find();
    }
});
server.route({
    method:'GET',
    path:'/comment/{id}',
    handler:(req, res) => {
        const foundComment = Comment.findById(req.params.id, (err, data) => {
            if(err){return res(err).code(404)}
        })
        return foundComment;
    }
});
server.route({
    method:'POST',
    path:'/newcomment',
    handler:(req, res) => {
        const {name, comment} = req.payload
        const newcomment = new Comment ({
            name,
            comment
        });
        return newcomment.save();
    }
});
server.route({
    method:'PUT',
    path:'/comment/content/{id}',
    handler:(req, res) => {
        console.log('patch handler')
        const editComment = Comment.findByIdAndUpdate(req.params.id, req.payload, (err, data) => {
            if(err){return res(err).code(404)}
        })
        const foundComment = Comment.findById(req.params.id, (err, data) => {
            if(err){return res(err).code(404)}
        })
        return editComment;
    }
});
server.route({
    method:'DELETE',
    path:'/comment/{id}',
    handler:(req, res) => {
        console.log('delete handler')
        const commentDelete = Comment.findByIdAndRemove(req.params.id, req.payload, (err, data) => {
            if(err){return res(err).code(404)}
        })
        return commentDelete && 'Comment has been deleted';
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
