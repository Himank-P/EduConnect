const fs = require('fs');
const path = require('path');

// Helper function to shuffle an array for variety
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.generateTimetable = (req, res) => {
  const inputsPath = path.join(__dirname, '../data/timetableInputs.json');

  fs.readFile(inputsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read timetable inputs.' });
    }

    try {
      const { teachers, classes, timeSlots, days } = JSON.parse(data);
      
      const generatedTimetable = {};
      const teacherAvailability = {};
      const classAvailability = {};

      // 1. Initialize availability trackers and the final timetable structure
      days.forEach(day => {
        teacherAvailability[day] = {};
        classAvailability[day] = {};
        timeSlots.forEach(time => {
          teacherAvailability[day][time] = new Set();
          classAvailability[day][time] = new Set();
        });
      });

      classes.forEach(cls => {
        generatedTimetable[cls.name] = {};
        days.forEach(day => {
          generatedTimetable[cls.name][day] = [];
        });
      });

      // 2. Pre-schedule a universal break for all classes and teachers
      const breakSlotIndex = Math.floor(timeSlots.length / 2);
      const breakTime = timeSlots[breakSlotIndex];

      days.forEach(day => {
        classes.forEach(cls => {
          generatedTimetable[cls.name][day].push({ time: breakTime, subject: "Break", teacher: "" });
          classAvailability[day][breakTime].add(cls.name);
        });
        teachers.forEach(teacher => {
          teacherAvailability[day][breakTime].add(teacher.name);
        });
      });

      // 3. Main Scheduling Loop for actual classes
      days.forEach(day => {
        classes.forEach(cls => {
          const subjectsToSchedule = shuffleArray([...cls.subjects]);

          timeSlots.forEach(time => {
            if (time === breakTime) return;

            const isClassBusy = classAvailability[day][time].has(cls.name);
            if (isClassBusy) return;

            for (let i = 0; i < subjectsToSchedule.length; i++) {
              const subject = subjectsToSchedule[i];
              
              const availableTeacher = teachers.find(t => 
                t.subjects.includes(subject) && !teacherAvailability[day][time].has(t.name)
              );

              if (availableTeacher) {
                generatedTimetable[cls.name][day].push({ time, subject, teacher: availableTeacher.name });
                
                teacherAvailability[day][time].add(availableTeacher.name);
                classAvailability[day][time].add(cls.name);

                subjectsToSchedule.splice(i, 1);
                break;
              }
            }
          });
        });
      });
      
      // 4. Sort each day's schedule by time
      for(const className in generatedTimetable) {
          for(const day in generatedTimetable[className]) {
              generatedTimetable[className][day].sort((a,b) => timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time));
          }
      }

      const outputPath = path.join(__dirname, '../data/generatedTimetables.json');
      fs.writeFile(outputPath, JSON.stringify(generatedTimetable, null, 2), (writeErr) => {
        if (writeErr) console.error("Failed to save timetable:", writeErr);
      });

      res.status(200).json({ success: true, timetable: generatedTimetable });

    } catch (error) {
      console.error('Error generating timetable:', error);
      res.status(500).json({ error: 'An error occurred while generating the timetable.' });
    }
  });
};

