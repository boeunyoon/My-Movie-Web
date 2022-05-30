const express = require('express')
const app = express()
const port = 8080
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const { User } = require("./server/models/Users");
const { auth } = require("./server/middleware/auth")
//application/x-www--form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
const config = require('./server/config/key');
const mongoose = require('mongoose');
const res = require('express/lib/response');
const connect = mongoose.connect(config.mongoURI,
    {
      useNewUrlParser: true, useUnifiedTopology: true
      //useCreateIndex: true, useFindAndModify: false
    }).then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! HI')
})
app.get('/api/hello', (req, res)=>{
  res.send("안녕하세요")
})
app.post('/register', (req, res) => {
  //회원가입시 필요한 정보들을 client에서 가져오면 
  //그것들을 데이터베이스에 넣어준다

  const user = new User(req.body)

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
        success: true
    });
});
})

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
      if (!user){
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다"
        });
      }
          

      user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
              return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" });
          //비밀번호가 맞다면 토큰을 생성하기
          user.generateToken((err, user) => {
              if (err) return res.status(400).send(err);
              //토큰을 cookie에 저장한다
                  res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id})
          });
      });
  });
});

app.get('/api/users/auth', auth,(req, res) => {
  //여기까지 미들웨러를 통과해 왔다는 얘기는 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
          success: true
      });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) 
})