import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema


const individualInputsSchema = mongoose.Schema({
        id:{type: String ,required:false},
         amountSpent:{type: String ,required:false},
         estHarvestDate:{type: String ,required:false},
         estSales:{type: String ,required:false},
         amountMade:{type: String ,required:false},
         actHarvestDate:{type: String ,required:false},
        estReturns:{type: String ,required:false},
         actReturns:{type: String ,required:false},
        


}, {timestamps:false})


const individualHarvestsSchema = mongoose.Schema({
        id:{type: String ,required:false},
         cropName:{type: String ,required:false},
         harvestStart:{type: String ,required:false},
         harvestEnd:{type: String ,required:false},
        harvestQuantity:{type: String ,required:false},
        
        


}, {timestamps:false})

const farmersSchema =  mongoose.Schema({
   
       uuid:{type:String ,required:false },
       created_by:{type:String ,required:false },
       last_submitter:{type:String ,required:false },
       start_record:{type:String ,required:false },
       end_record:{type:String ,required:false },
       last_submit:{type:String ,required:false },
        gps_stamp:{type:String ,required:false },
        name:{type:String ,required:false },
        photo:{type:String ,required:false },
        age:{type:String ,required:false },
        challenge:{type:String ,required:false },
        farm_size:{type:String ,required:false },
        location:{type:String ,required:false },
        crop_types:{type:String ,required:false },
        offtaking:{type:String ,required:false },
        market:{type:String ,required:false },
        production_level: {type:String ,required:false },
        gender:{type:String ,required:false },
        produce:{type:String ,required:false },
        country:{type:String ,required:false },
        chemicals:{type:String ,required:false },
        farmerId:{type:String ,required:false },
        agentAddedId:{type:String ,required:false },
        familySize:{type:String ,required:false },
        phone:{type:String ,required:false },

        chemical_organic: {type:String ,required:false },
        interest:{type:String ,required:false },

       farmingCrop:{type:String ,required:false },
        productSoldTo:{type:String ,required:false },
        typeOfChemical:{type:String ,required:false },

        organicFarmingInterest: {type:String ,required:false },
        harvestSize:{type:String ,required:false },
        harvestPurpose:{type:String ,required:false },
        inputs:[individualInputsSchema],
        harvests:[individualHarvestsSchema],
        
        firstName:{type:String ,required:false },
        lastName:{type:String ,required:false },
        username:{type:String ,required:false,default:0},
        password:{type:String ,required:false,default:0},
        OriginalResponseId:{type:mongoose.Schema.Types.ObjectId,required:false, ref:'responsesdbs'},

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const Farmers = mongoose.model('Farmers',farmersSchema)

/*the this Farmers you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI
 
 coming back a year later.. this statement is not exactly true
 
 SQL HAS ITS OWN ORM
 
 */

//exports.Farmers = Farmers
export default Farmers