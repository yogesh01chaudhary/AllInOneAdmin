const {Schema,model}=require("mongoose")
const SubCategorySchema=new Schema({
    name:{
        type:String
    },
    image:{
        type:Buffer
    },
    subCategory2:[{
        type:Schema.Types.ObjectId,
        ref:"subCategory2"
    }],
    service:[{
        type:Schema.Types.ObjectId,
        ref:"service"
    }]
})
exports.SubCategory=model("subCategory",SubCategorySchema)