const fs = require('fs');
let dashboard = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/mobile/src/components/AgroSmartFarmerDashboard.jsx', 'utf8');

dashboard = dashboard.replace(/\{\/\* MODAL 3: HARDWARE CAMERA VERIFICATION \*\/\}[\s\S]*?\{\/\* END MODAL 3 \*\/\}/, '');
dashboard = dashboard.replace(/onClick=\{.*?setShowCameraModal\(true\);.*?\}/g, 'onClick={() => completeTask(activeTaskIdForCamera || t.id)}');

// Also remove states
dashboard = dashboard.replace(/const \[showCameraModal, setShowCameraModal\].*?;/, '');
dashboard = dashboard.replace(/const \[activeTaskIdForCamera, setActiveTaskIdForCamera\].*?;/, '');
dashboard = dashboard.replace(/const \[cameraStreamActive, setCameraStreamActive\].*?;/, '');

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/mobile/src/components/AgroSmartFarmerDashboard.jsx', dashboard);
console.log('Camera stripped');
