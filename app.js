const http=require('http');
const fs=require('fs')

function sendResponse(res, { body, status = 200 }) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const routes={
  '/':{
    GET: (_req,res)=>{
      sendResponse(res,{
        body:{
          msg:"WelCome"
        }
      })
    }

  },
  '/students':{
    GET:(_req,res)=>{
      const raw= fs.readFileSync('./data/db.json')
      const students=JSON.parse(raw)
      sendResponse(res, {
      body:students
    })
    },
    POST:(req,res)=>{
      let body="";
      req.on('data',(chunk)=>{
        body+=chunk.toString()
      })

      req.on('end',()=>{
        const payload=JSON.parse(body)
        const raw= fs.readFileSync('./data/db.json')
        const students=JSON.parse(raw)
        students.push(payload)
        fs.writeFileSync('./data/db.json',JSON.stringify(students))
        sendResponse(res,{
          body:{
            msg:'Student Created',students
          },
          status:201,
        })
      })
    },
    default:(_req, res)=>{
  sendResponse(res,{status:404, body:{msg:'Resource not found'}})
}
  }
}



const server=http.createServer((req,res)=>{
  const {url, method}=req;
  const currentRoute = routes[url] || routes.default
  const handler =currentRoute && currentRoute[method] || routes.default
  handler(req,res)
});

server.listen(4000, ()=>{
  console.log('server is listening...')
})






