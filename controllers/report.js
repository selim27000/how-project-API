import HiveModel from "../models/Hive.js";

export const createHiveReport = async (req, res) => {
  try {
    const hiveId = req.params.id;
    const report = req.body;
    const hive = await HiveModel.findById(hiveId);
    if (!hive) {
      return res.status(404).json({ message: "Ruche introuvable." });
    }
    hive.report.push(report);
    await hive.save();

    return res.status(201).json(hive);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

export const createDraftReport = async (req, res) => {
  try {
    const hiveId = req.params.id;
    const report = req.body;
    const hive = await HiveModel.findById(hiveId);
    if (!hive) {
      return res.status(404).json({ message: "Ruche introuvable." });
    }
    hive.draftReport.push(report);
    await hive.save();

    return res.status(201).json(hive);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

export const getReports = async (req, res) => {
  const hiveId = req.params.id;

  try {
    const hive = await HiveModel.findById(hiveId).populate('draftReport');
    if (!hive) {
      throw new Error(`Hive with id ${hiveId} not found`);
    }
    const reports = hive.draftReport.map(report => {
      return report;
    });
    return res.json({reports});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getReportById = async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await HiveModel.findOne({
      "draftReport._id": reportId,
    }, {
      "draftReport.$": 1,
    });

    if (!report || !report.draftReport) {
      throw new Error(`Report with id ${reportId} not found`);
    }

    return res.json(report.draftReport[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
