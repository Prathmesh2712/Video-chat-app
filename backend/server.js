const express = require('express')();

const server=require('http').createServer(express);

const cors=require('cors');

const io=require('socket.io')(
    server,
    {
        cors:{
            origin:'*',
            methods:['GET','POST'],
        }
    }
);

express.use(cors());

const PORT=process.env.PORT || 4000;

express.get('/',(req, res)=>{    
   res.send("Server started ...!");
})

io.on('connection',(socket)=>{

    socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


