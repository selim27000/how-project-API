import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const sensorData = new mongoose.Schema(
  {
    serialNb: {
      type: String,
      required: true,
    },
    data: {
      humInt: Number,
      tempInt: [Number],
      humExt: Number,
      tempExt: Number,
      freq: Number,
      weight: Number,
    },
    timestamp: Date,
  },
  {
    timeseries: {
      timeField: "timestamp",
    },
  }
);

const ApiaryModel = mongoose.model("sensorData", sensorData, "sensordata");
export default ApiaryModel;
