import mongoose from 'mongoose'
import colors from '../../ansiColoring.js'

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(colors.green("[CONNECTED]"), "MongoDB");
    }
    catch(err){
        console.error(colors.highlighted_red(err.message))
        process.exit(1)
    }  
}