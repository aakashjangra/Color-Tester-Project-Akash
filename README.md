# Color Tester Project

Color Tester is a web application that allows users to upload an image and extract its prominent colors. It then compares these extracted colors against a predefined set of brand colors, providing validation results and accessibility insights.

## Features

- **Image Upload**: Users can upload images in various formats (JPEG, PNG, WebP, BMP, SVG, TIFF).
- **Color Extraction**: The application samples colors from five key points in the uploaded image.
- **Color Matching**: Extracted colors are compared against brand colors to determine compliance.
- **Accessibility Analysis**: The app evaluates color contrast and accessibility based on WCAG guidelines.
- **Interactive UI**: Displays extracted colors and analysis results in an easy-to-read format.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Icons & UI Components**: Lucide-react, shadcn/ui
- **Image Handling**: Next.js Image component, HTML5 Canvas API

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/color-matcher.git
   ```
2. Navigate to the project directory:
   ```sh
   cd color-matcher
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click on the upload button and select an image.
2. The app will extract colors from key positions in the image.
3. Click on Analyze Image button.
3. The extracted colors are displayed and analyzed against brand colors.
4. A compliance report and accessibility insights are provided.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please reach out via [aj.akashjangra@gmail.com] or open an issue on GitHub.
