const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

const oldCameraFunc = /function openCameraModal\(farmId, activityId\) \{[\s\S]*?function closeCameraModal\(\) \{[\s\S]*?\}\n/g;

// Instead of removing, we'll redefine openCameraModal to just complete the task instantly
const newCameraFunc = `function openCameraModal(farmId, activityId) {
  // Removed hardware camera stream validation per user request
  completeWeeklyTask(farmId, activityId);
}

function closeCameraModal() {
  const m = document.getElementById('camera-modal');
  if (m) m.remove();
}
`;

code = code.replace(oldCameraFunc, newCameraFunc);
fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
