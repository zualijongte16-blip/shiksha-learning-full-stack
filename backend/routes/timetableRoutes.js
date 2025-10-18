const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to the timetable data file
const TIMETABLE_FILE = path.join(__dirname, '../data/timetables.json');

// Initialize timetable file if it doesn't exist
const initializeTimetableFile = async () => {
  try {
    await fs.access(TIMETABLE_FILE);
  } catch (error) {
    // File doesn't exist, create it with default structure
    const defaultTimetable = {
      "8": {
        "general": {
          "Monday": {
            "1": "Mathematics",
            "2": "English",
            "3": "Science",
            "4": "Social Studies",
            "5": "Hindi",
            "6": "Art",
            "7": "Physical Education",
            "8": "Computer Science"
          },
          "Tuesday": {
            "1": "English",
            "2": "Mathematics",
            "3": "Science",
            "4": "Hindi",
            "5": "Social Studies",
            "6": "Music",
            "7": "Physical Education",
            "8": "Computer Science"
          },
          "Wednesday": {
            "1": "Mathematics",
            "2": "English",
            "3": "Science",
            "4": "Social Studies",
            "5": "Hindi",
            "6": "Art",
            "7": "Physical Education",
            "8": "Computer Science"
          },
          "Thursday": {
            "1": "English",
            "2": "Mathematics",
            "3": "Science",
            "4": "Hindi",
            "5": "Social Studies",
            "6": "Music",
            "7": "Physical Education",
            "8": "Computer Science"
          },
          "Friday": {
            "1": "Mathematics",
            "2": "English",
            "3": "Science",
            "4": "Social Studies",
            "5": "Hindi",
            "6": "Art",
            "7": "Physical Education",
            "8": "Computer Science"
          },
          "Saturday": {
            "1": "English",
            "2": "Mathematics",
            "3": "Science",
            "4": "Hindi",
            "5": "Social Studies",
            "6": "Music",
            "7": "Physical Education",
            "8": "Computer Science"
          }
        }
      }
    };
    await fs.writeFile(TIMETABLE_FILE, JSON.stringify(defaultTimetable, null, 2));
  }
};

// GET /api/timetable/:class/:stream
router.get('/:class/:stream', async (req, res) => {
  try {
    const { class: classNumber, stream } = req.params;

    // Ensure timetable file exists
    await initializeTimetableFile();

    // Read timetable data
    const timetableData = JSON.parse(await fs.readFile(TIMETABLE_FILE, 'utf8'));

    // Get timetable for specific class and stream
    const classTimetable = timetableData[classNumber]?.[stream];

    if (!classTimetable) {
      return res.status(404).json({
        success: false,
        message: `Timetable not found for class ${classNumber} ${stream}`
      });
    }

    res.json({
      success: true,
      data: classTimetable
    });
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/timetable/:class/:stream/:day
router.put('/:class/:stream/:day', async (req, res) => {
  try {
    const { class: classNumber, stream, day } = req.params;
    const { periods } = req.body;

    // Ensure timetable file exists
    await initializeTimetableFile();

    // Read current timetable data
    const timetableData = JSON.parse(await fs.readFile(TIMETABLE_FILE, 'utf8'));

    // Update timetable for specific class, stream, and day
    if (!timetableData[classNumber]) {
      timetableData[classNumber] = {};
    }
    if (!timetableData[classNumber][stream]) {
      timetableData[classNumber][stream] = {};
    }

    timetableData[classNumber][stream][day] = periods;

    // Write updated data back to file
    await fs.writeFile(TIMETABLE_FILE, JSON.stringify(timetableData, null, 2));

    res.json({
      success: true,
      message: `Timetable updated for ${classNumber} ${stream} ${day}`
    });
  } catch (error) {
    console.error('Error updating timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
