/**
 * Compares extracted colors with brand colors and formats output per specifications
 * @param {Array} extractedColors - Array of objects with color and element info
 * @param {Number} tolerance - Color difference tolerance (0-255, where lower is stricter)
 * @returns {Object} Formatted validation results
 */
export function validateColors(extractedColors, tolerance = 25) {
  // Define brand colors
  const brandColors = {
    primary: ['#FF0000', '#003DA5'],     // Red, Deep Navy
    secondary: ['#72B5E8', '#54585A'],   // Light Blue, Gray
    accent: ['#FFB612', '#158B45']       // Yellow, Green
  };

  // Initialize results with required format
  const results = {
    colorCompliance: true,
    colorErrors: [],
    accessibilityIssues: []
  };

  // Process each extracted color
  extractedColors.forEach(color => {
    let element, location;
    let matched = false;
    let closestMatch = {
      category: null,
      color: null,
      difference: Infinity
    };

    // Compare with each brand color category
    Object.entries(brandColors).forEach(([category, colors]) => {
      colors.forEach(brandColor => {
        const difference = getColorDifference(color, brandColor);

        if (difference < tolerance) {
          matched = true;
        }

        if (difference < closestMatch.difference) {
          closestMatch = {
            category,
            color: brandColor,
            difference
          };
        }
      });
    });

    // If no match found, add to colorErrors
    if (!matched) {
      results.colorCompliance = false;
      results.colorErrors.push({
        element: element || 'Unknown element',
        expectedColor: closestMatch.color || 'Any brand color',
        actualColor: color,
        location: location || 'Not specified'
      });
    }
  });

  // Check accessibility (contrast ratio) between color pairs
  for (let i = 0; i < extractedColors.length; i++) {
    for (let j = i + 1; j < extractedColors.length; j++) {
      // Skip if elements aren't related (you may need to modify this logic)
      if (extractedColors[i].element === 'background' &&
        extractedColors[j].element === 'text' ||
        extractedColors[i].element === 'text' &&
        extractedColors[j].element === 'background') {

        const contrastRatio = calculateContrastRatio(
          extractedColors[i].color,
          extractedColors[j].color
        );

        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        const wcagRequirement = 4.5;

        if (contrastRatio < wcagRequirement) {
          results.accessibilityIssues.push({
            combination: `${extractedColors[i].element} (${extractedColors[i].color}) and ${extractedColors[j].element} (${extractedColors[j].color})`,
            contrastRatio: parseFloat(contrastRatio.toFixed(2)),
            requirement: "WCAG AA 4.5:1",
            colorblindImpact: getColorblindImpact(extractedColors[i].color, extractedColors[j].color)
          });
        }
      }
    }
  }

  return results;
}

/**
 * Calculate color difference between two hex colors
 * @param {String} color1 - Hex color code
 * @param {String} color2 - Hex color code
 * @returns {Number} Color difference value
 */
function getColorDifference(color1, color2) {
  // Ensure we have the # prefix
  color1 = color1.startsWith('#') ? color1 : '#' + color1;
  color2 = color2.startsWith('#') ? color2 : '#' + color2;

  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return Infinity;

  // Calculate Euclidean distance in RGB space
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Convert hex color to RGB object
 * @param {String} hex - Hex color code
 * @returns {Object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * @param {String} color1 - Hex color code
 * @param {String} color2 - Hex color code
 * @returns {Number} Contrast ratio
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = calculateRelativeLuminance(hexToRgb(color1));
  const lum2 = calculateRelativeLuminance(hexToRgb(color2));

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * @param {Object} rgb - RGB color object
 * @returns {Number} Relative luminance
 */
function calculateRelativeLuminance(rgb) {
  if (!rgb) return 0;

  // Convert RGB to linear values
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Apply gamma correction
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Determine potential colorblind impact
 * @param {String} color1 - Hex color code
 * @param {String} color2 - Hex color code
 * @returns {Array} Array of colorblind impacts
 */
function getColorblindImpact(color1, color2) {
  // This is a simplified implementation - a real version would simulate
  // different types of color blindness and check actual perceived differences

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return ["Unknown impact"];

  const impacts = [];

  // Red-green color blindness checks
  if (Math.abs(rgb1.r - rgb1.g) > 100 && Math.abs(rgb2.r - rgb2.g) < 50) {
    impacts.push("Deuteranopia (red-green color blindness)");
    impacts.push("Protanopia (red-green color blindness)");
  }

  // Blue-yellow color blindness check
  if (Math.abs(rgb1.b - rgb1.g) > 100 && Math.abs(rgb2.b - rgb2.g) < 50) {
    impacts.push("Tritanopia (blue-yellow color blindness)");
  }

  return impacts.length > 0 ? impacts : ["No significant impact detected"];
}

// Example usage
const extractedColors = [
  { color: "#FF1010", element: "header", location: "top banner" },
  { color: "#FFFFFF", element: "background", location: "main content" },
  { color: "#333333", element: "text", location: "main content" },
  { color: "#A32F4D", element: "button", location: "call to action" }
];

