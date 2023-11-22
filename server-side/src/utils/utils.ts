import User from "../models/users";

export async function generateAcctNo(){
  let acctNo = Math.floor(Math.random() * 10000000000);
  let user = await User.findOne({ acctNo });
  while (user) {
    acctNo = Math.floor(Math.random() * 10000000000);
    user = await User.findOne({ acctNo });
  }
  return String(acctNo);
}


export async function runCommand(){
  // try{
  //   const users = await User.find();
  //   for (const user of users) {
  //     if (user.isAdmin) continue;
  //     user.isAdmin = false;
  //     await user.save();
  //   }
  // }
  // catch(error:any){
  //   console.log(error);
  // }
}