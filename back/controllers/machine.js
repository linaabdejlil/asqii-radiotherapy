const { Machine } = require("../models");

// Obtenir une machine par son ID
exports.getMachineById = async (req, res) => {
  const { machineId } = req.params;

  try {
    const machine = await Machine.findByPk(machineId);

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    return res.json(machine);
  } catch (error) {
    console.error("Error fetching machine by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exports;
