import bcrypt from 'bcryptjs'
//const bcrypt = require('bcryptjs')
const dummyPassword = '0284'
const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync(dummyPassword,salt)

const users = [
  {
    name:'Admin User',
    email:'admin@emaple.com',
    password: hash,
    nuban:1000,
    isAdmin:true,
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance',
    notes:''
  },

  {
    name:'John Doe',
    email:'john@yahoo.com',
    password: hash,
    nuban:1200000895,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'Jane Doe',
    email:'jane@yahoo.com',
    password: hash,
    nuban:3000,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    isTeller:true,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'Adijat Odubanjo',
    email:'odubanjoadijat@bridgewaymfb.com',
    password: hash,
    nuban:4000,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'OKOLI LTD',
    email:'okoli@yahoo.com',
    password: hash,
    nuban:5000,
    isAdmin:false,
    isMerchant:true,
    merchantAddress:"Dolphin estate, ilupeju way",
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance',
    notes:''
  },
  {
    name:'BRIDGEWAY-DISTRIBUTOR OLAM',
    email:'bridgewaydistributorolam@yahoo.com',
    password:hash,
    nuban:1100016516,
    isAdmin:false,
    isMerchant:true,
    merchantAddress:"Olam Nigeria Limited ,56 Abebe Village Road,Abulenla,101241 ,Lagos",
    userMessage:'',
    adminMessage:'',
    momFirstName:'is a merchant',
    shoeSize:'is a merchant',
    closestFriend:'is a merchant',
    childhoodStreet:'is a merchant',
    firstEmployment:'is a merchant',
    notes:''
  } ,
  {
    name:'BRIDGEWAY-DISTRIBUTOR COCA-COLA',
    email:'bridgewaydistributorcocacola@yahoo.com',
    password:hash,
    nuban:1100016509,
    isAdmin:false,
    isMerchant:true,
    merchantAddress:"(THIS VENDOR SENDS GOODS TO BRIDGEWAY)49A Lafiaji way ,Dolphin Estate,Ikoyi,Lagos",
    userMessage:'',
    adminMessage:'',
    momFirstName:'is a merchant',
    shoeSize:'is a merchant',
    closestFriend:'is a merchant',
    childhoodStreet:'is a merchant',
    firstEmployment:'is a merchant',
    notes:''
  } 
]

//exports.users =users;
export default users