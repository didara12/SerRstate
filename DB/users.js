const {users,Real_state}  = require('./connecte')




 async function  f(){
   try {
      const data = await Real_state.find();
      console.log('Real_state Data:', data);
    } catch (error) {
      console.error('Error fetching Real_state data:', error);
    } 
   
}

 f()
 
// const u = new users({
//     username:"test",
//     email:"test",
//     password:"test"
// })

// u.save(u).then(res => console.log(res))