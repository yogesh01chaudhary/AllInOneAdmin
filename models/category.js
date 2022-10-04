const {Schema,model}=require("mongoose")
const CategorySchema=new Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    subCategory:[{
        type:Schema.Types.ObjectId,
        ref:"subCategory"
    }],
    service:[{
        type:Schema.Types.ObjectId,
        ref:"service"
    }]
})
exports.Category=model("category",CategorySchema)