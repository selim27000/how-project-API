import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import HiveModel from "../models/Hive.js";
import ApiaryModel from "../models/Apiary.js";

export const getHive = (req, res) => {
  const query = [
    {
      $match: { _id: ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: "apiaries",
        localField: "apiaryId",
        foreignField: "_id",
        as: "apiary",
      },
    },
    {
      $unwind: "$apiary",
    },
  ];

  try {
    HiveModel.aggregate(query)
    .exec((err, docs) => {
      if (err) return res.status(400).json(err);
      else if (!docs)
        return res.status(400).json({ message: "ID unknown " + req.params.id });
      else return res.status(200).json(docs[0]);
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getUserHives = async (req, res) => {
  const page = req.query.page - 1 || 0;
  const hivesPerPage = 5;
  const query = { ownerId: req.query.userId };

  try {
    HiveModel.find(query)
      .skip(page * hivesPerPage)
      .limit(hivesPerPage)
      .exec((err, docs) => {
        if (err) return res.status(400).json(err);
        else if (!docs) return res.status(400).json({ message: "" });
        else {
          HiveModel.countDocuments(query).exec((count_error, count) => {
            if (count_error) {
              res.status(400).json(count_error);
            }
            const data = {
              hives: docs,
              pages: Math.ceil(count / hivesPerPage),
            };
            return res.status(200).json(data);
          });
        }
      });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getApiaryHives = async (req, res) => {
  const page = req.query.page - 1 || 0;
  const hivesPerPage = 5;
  const query = { apiaryId: req.params.apiaryId };

  try {
    const apiary = await ApiaryModel.findById(req.params.apiaryId);
    if (!apiary.showAddress) {
      apiary.address = null;
    }
    HiveModel.find(query)
      .skip(page * hivesPerPage)
      .limit(hivesPerPage)
      .exec((err, docs) => {
        if (err) return res.status(400).json(err);
        else if (!docs)
          return res
            .status(400)
            .json({ message: "ID unknown " + req.body.apiaryId });
        else {
          HiveModel.countDocuments(query).exec((count_error, count) => {
            if (count_error) {
              res.status(400).json(count_error);
            }
            const data = {
              apiary: apiary,
              hives: docs,
              pages: Math.ceil(count / hivesPerPage),
            };
            return res.status(200).json(data);
          });
        }
      });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getHiveNames = async (req, res) => {
  const { userId, apiaryId } = req.query;
  let query;

  if (apiaryId) {
     query = { ownerId: userId, apiaryId };
  } else {
     query = { ownerId: userId };
  }

  try {
    HiveModel.find(query)
      .select("name apiaryId")
      .exec((err, docs) => {
        if (err) return res.status(400).json(err);
        else return res.status(200).json(docs);
      });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const createHive = async (req, res) => {
  const {
    ownerId,
    apiaryId,
    name,
    desc,
    hiveType,
    serialNb,
    superNb,
    frameNb,
    swarm,
  } = req.body;

  try {
    const hive = await HiveModel.create({
      ownerId,
      apiaryId,
      name,
      desc,
      hiveType,
      serialNb,
      superNb,
      frameNb,
      swarm,
    });
    const hiveNb = await HiveModel.find({
      apiaryId: apiaryId,
    }).count();
    await ApiaryModel.findByIdAndUpdate(apiaryId, {
      $set: {
        hiveNb: hiveNb,
      },
    });
    res.status(201).json(hive);
  } catch (err) {
    console.log(err);
    return res.status(401).send({ errors });
  }
};

export const updateHive = (req, res) => {
  const {
    ownerId,
    apiaryId,
    name,
    hiveType,
    serialNb,
    frameCapacity,
  } = req.body;

  try {
    HiveModel.findByIdAndUpdate(
      req.params.id,
      {
        ownerId,
        apiaryId,
        name,
        hiveType,
        serialNb,
        frameCapacity,
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        else if (!docs)
          return res
            .status(400)
            .json({ message: "ID unknown " + req.params.id });
        else return res.status(200).json(docs);
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteHive = async (req, res) => {
  try {
    const apiaryId = await HiveModel.findById(req.params.id).apiaryId;
    await HiveModel.findByIdAndDelete(req.params.id);
    const hiveNb = await HiveModel.find({
      apiaryId: apiaryId,
    }).count();
    // console.log("hiveNb after deletion : " + hiveNb);
    await ApiaryModel.findByIdAndUpdate(apiaryId, {
      $set: {
        hiveNb: hiveNb,
      },
    });
    return res.status(200).json({ message: "Hive deleted successfully." });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const transhumance = async (req, res) => {
  const {
    hiveList,
    destApiaryId,
    sourceApiaryId
  } = req.body;

  try {
    await HiveModel.updateMany(
      { _id: { $in: hiveList } },
      { $set: { apiaryId: destApiaryId } }
    );

    await ApiaryModel.findByIdAndUpdate(sourceApiaryId, {
      $inc: {
        hiveNb: -1 * hiveList.length,
      },
    });

    await ApiaryModel.findByIdAndUpdate(destApiaryId, {
      $inc: {
        hiveNb: hiveList.length,
      },
    });

    return res.status(200).json({ message: "Transhumance executed successfully." });
  } catch (err) {
    return res.status(200).send({ err });
  }
}