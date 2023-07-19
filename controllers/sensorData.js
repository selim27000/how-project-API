import SensorDataModel from "../models/sensorData.js";
import { sensorDataErrors } from "../utils/errors.utils.js";

export const digestSensorData = async (req, res) => {
  const rawPacket = req.body;

  const serialNb = Object.keys(rawPacket)[0];

  const packet = rawPacket[serialNb].map((metric) => {
    return parseInt(metric) / 100;
  });

  const humInt = packet[0];
  const tempInt = packet.slice(1, 10); // [1, 10[
  const humExt = packet[10];
  const tempExt = packet[11];
  const weight = packet[12];
  const freq = packet[13] * 100;

  const data = {
    humInt,
    tempInt,
    humExt,
    tempExt,
    freq,
    weight,
  };

  const timestamp = new Date();

  try {
    const sensorData = await SensorDataModel.create({
      serialNb,
      data,
      timestamp,
    });
    res.status(201).json(sensorData);
  } catch (err) {
    const errors = sensorDataErrors(err);
    return res.status(200).send({ errors });
  }
};

export const getSensorData = async (req, res) => {
  try {
    const limit = 1000;
    const days = req.query.days;
    let interval = 1 * 24 * 60 * 60 * 1000;

    let rangeStart = new Date();
    if (days !== "max") {
      rangeStart.setDate(rangeStart.getDate() - days);
      interval = (days * 24 * 60 * 60 * 1000) / limit;
      // console.log("interval = " + interval);
    }

    const rangeMatch = {
      $and: [
        { timestamp: { $gte: rangeStart } },
        { serialNb: req.params.serialNb },
      ],
    };

    const allMatch = {
      serialNb: req.params.serialNb,
    };

    const query = [
      {
        $match: req.query.days === "max" ? allMatch : rangeMatch,
      },
      {
        $addFields: {
          time_block: {
            $subtract: [
              "$timestamp",
              {
                $mod: [
                  {
                    $convert: {
                      input: "$timestamp",
                      to: "long",
                    },
                  },
                  interval,
                ],
              },
            ],
          },
        },
      },
      {
        $unwind: {
          path: "$data.tempInt",
          includeArrayIndex: "position",
        },
      },
      {
        $group: {
          _id: ["$time_block", "$position"],
          position: { $first: "$position" },
          time_block: { $first: "$time_block" },
          humInt: { $first: "$data.humInt" },
          tempInt: { $avg: "$data.tempInt" },
          humExt: { $first: "$data.humExt" },
          tempExt: { $first: "$data.tempExt" },
          weight: { $first: "$data.weight" },
          freq: { $first: "$data.freq" },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
      {
        $group: {
          _id: "$time_block",
          time_block: { $first: "$time_block" },
          avg_humInt: { $avg: "$humInt" },
          avg_tempInt: { $push: "$tempInt" },
          avg_humExt: { $avg: "$humExt" },
          avg_tempExt: { $avg: "$tempExt" },
          avg_weight: { $avg: "$weight" },
          avg_freq: { $avg: "$freq" },
        },
      },
      {
        $project: {
          timestamp: { $add: ["$time_block", 0] },
          count: "$count",
          data: {
            humInt: "$avg_humInt",
            tempInt: "$avg_tempInt",
            humExt: "$avg_humExt",
            tempExt: "$avg_tempExt",
            weight: "$avg_weight",
            freq: "$avg_freq",
          },
        },
      },
    ];

    SensorDataModel.aggregate(query)
      .limit(limit)
      .sort({ timestamp: -1 })
      .exec((err, docs) => {
        // console.log(docs);
        console.log(err);
        if (err) return res.status(400).json(err);
        else if (!docs) return res.status(400).json({ message: "" });
        else {
          return res.status(200).json(docs);
        }
      });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};
