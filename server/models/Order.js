import mongoose, { set } from 'mongoose';


const OrderSchema = new mongoose.Schema({
   user : {
      type :mongoose.Schema.Types.ObjectId,
      ref:'User',
      required : true
   },
   stock: {
      type:mongoose.Types.ObjectId,
      ref:'Stock',
      required:true
   },
   quantity:{
       type:Number,
       required:true
   },
   price:{
        type:Number,
        required:true
    },
    type:{
         type:String, //buy or sell
         enum:['buy','sell'],
         required:true
    },
    timestamp:{
        type:Date,
        default:new Date()
    },

    remainingBalance:{
        type:Number,
        required:true,
        set:function(value){
            return this.parseFloat(value).toFixed(2);
        }
    },

});


const Order=mongoose.model('Order',OrderSchema);
export default Order;