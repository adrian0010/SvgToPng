const svgInput = document.getElementById("svgInput");
const scaleInput = document.getElementById("scaleInput");
const originalResolutionDisplay = document.getElementById("originalResolution");
const scaledResolutionDisplay = document.getElementById("scaledResolution");
const resolutionDisplay = document.getElementById("resolutionDisplay");
const scaleContainer = document.getElementById("scaleContainer");
const downloadButton = document.getElementById("downloadButton");
const canvas = document.getElementById("canvas");

let originalWidth = 0;
let originalHeight = 0;
let originalFileName = ""; // To store the original SVG file name
let pngDataUrl = ""; // To store the PNG data URL for download

// Show resolution display, scale input, and download button when SVG is uploaded
svgInput.addEventListener("change", function () {
  const svgFile = svgInput.files[0];
  if (!svgFile) return;

  // Store the original file name (without extension)
  originalFileName = svgFile.name.replace(/\.svg$/, "");

  const reader = new FileReader();

  reader.onload = function (e) {
    const svgData = e.target.result;
    const image = new Image();

    image.onload = function () {
      originalWidth = image.width;
      originalHeight = image.height;

      // Display original resolution
      originalResolutionDisplay.textContent = `${originalWidth} x ${originalHeight}`;

      // Update and display scaled resolution based on current scale
      updateScaledResolution(originalWidth, originalHeight, parseFloat(scaleInput.value));

      // Show the resolution display, scale input, and download button
      resolutionDisplay.style.display = "block";
      scaleContainer.style.display = "block";
      downloadButton.style.display = "block";
    };

    // Convert SVG data to a Base64 URL for the image source
    image.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  reader.readAsText(svgFile);
});

// Update scaled resolution when scale input changes
scaleInput.addEventListener("input", function () {
  if (originalWidth && originalHeight) {
    const scale = parseFloat(this.value);
    updateScaledResolution(originalWidth, originalHeight, scale);
  }
});

// Function to update scaled resolution display
function updateScaledResolution(originalWidth, originalHeight, scale) {
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;
  scaledResolutionDisplay.textContent = `${scaledWidth.toFixed(0)} x ${scaledHeight.toFixed(0)}`;
}

// Prepare PNG data on hover over download button
downloadButton.addEventListener("mouseover", function () {
  const scale = parseFloat(scaleInput.value);
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  // Set up canvas with scaled dimensions
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  const context = canvas.getContext("2d");

  // Load SVG data again to draw it on the canvas at scaled dimensions
  const reader = new FileReader();
  reader.onload = function (e) {
    const svgData = e.target.result;
    const image = new Image();

    image.onload = function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      // Convert canvas to PNG and store data URL
      pngDataUrl = canvas.toDataURL("image/png");
    };

    image.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  reader.readAsText(svgInput.files[0]);
});

// Trigger download when download button is clicked
downloadButton.addEventListener("click", function () {
  if (!pngDataUrl) return; // Check if PNG data is ready

  const scale = parseFloat(scaleInput.value);
  let downloadFileName = originalFileName;
  if (scale !== 1) {
    downloadFileName += `-scaled-${scale.toFixed(2)}`; // Append the scale factor if not 1
  }
  downloadFileName += ".png"; // Ensure it has the .png extension

  // Create a temporary link to download the PNG file
  const downloadLink = document.createElement("a");
  downloadLink.href = pngDataUrl;
  downloadLink.download = downloadFileName;
  downloadLink.click(); // Trigger the download
});
