// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
