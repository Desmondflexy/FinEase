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
  const users = await User.find();
  for (const user of users) {
    if (user.acctNo) continue;
    user.acctNo = await generateAcctNo();
    await user.save();
  }
}