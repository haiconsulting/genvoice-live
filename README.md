# GenVoice - AI-Powered Document Generator

GenVoice is a modern web application that helps users create professional invoices and statements of work (SOW) using AI-powered template generation and customization.

## Features

- 📄 Create and customize invoices and SOW documents
- 🤖 AI-powered template generation
- 🎨 Dark/Light mode support
- 🖼️ Logo and signature upload capabilities
- 📝 Rich text editing with TinyMCE
- 💾 Custom template saving and management
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ianmkinney/genvoice-live.git
    cd genvoice-live
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory with the following variables:
    ```env
    REACT_APP_OPENAI_API_KEY=your_openai_api_key
    REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    REACT_APP_TINYMCE_API_KEY=your_tinymce_api_key
    ```

4. **Start the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000/genvoice-live`

## Building and Deployment

- **Create a production build:**
    ```bash
    npm run build
    ```

- **Deploy to GitHub Pages:**
    ```bash
    npm run deploy
    ```
    Ensure that the `homepage` field in your `package.json` is set correctly to enable GitHub Pages deployment.

## Project Structure

```bash
genvoice-live/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   ├── logo192.png
│   └── logo512.png
├── src/
│   ├── components/
│   │   ├── BrandingManager/
│   │   ├── DocumentCreator/
│   │   ├── InvoiceForm/
│   │   ├── InvoicePreview/
│   │   ├── Navigation/
│   │   ├── TemplateGenerator/
│   │   ├── LoadingIndicator/
│   │   └── CostDisplay/
│   ├── services/
│   │   └── openaiService.js
│   ├── templates/
│   │   ├── defaultTemplate.js
│   │   ├── sowTemplate.js
│   │   └── templateManager.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Key Features

### Document Creator
- **Create Professional Invoices and SOWs:** Easily generate and customize invoices and Statements of Work.
- **Real-Time Preview:** Instant preview of documents with the TinyMCE rich text editor.
- **Custom Branding:** Upload and manage logos and signatures to personalize your documents.
- **Dark/Light Mode:** Toggle between dark and light themes for a better user experience.

### Template Generator
- **AI-Powered Customization:** Utilize OpenAI to generate and customize document templates based on your prompts.
- **Multiple Base Templates:** Choose between default invoice templates and Statement of Work templates.
- **Custom Field Support:** Add and manage custom fields to suit your specific needs.
- **Cost Tracking:** Monitor the cost associated with AI-generated templates.

### Responsive Design
- **Multi-Device Support:** Fully responsive design ensures usability across desktop, tablet, and mobile devices.
- **Smooth Animations:** Enhanced user experience with Framer Motion animations.
- **Accessible Interface:** Designed with accessibility in mind to accommodate all users.

## Technologies Used

- **React 18:** Front-end library for building user interfaces.
- **Framer Motion:** Library for smooth animations and transitions.
- **TinyMCE:** Rich text editor for document previews and editing.
- **OpenAI API:** AI capabilities for template generation and customization.
- **html2pdf.js:** Library for converting HTML content to PDF format.
- **React Router DOM:** Handling routing within the application.
- **GitHub Pages:** Hosting the live application.

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch:**
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. **Commit your changes:**
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. **Push to the branch:**
    ```bash
    git push origin feature/AmazingFeature
    ```
5. **Open a Pull Request**

Please ensure your code follows the existing style and includes relevant tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **OpenAI:** For providing the powerful AI capabilities.
- **TinyMCE:** For the rich text editor integration.
- **Unsplash:** For image integration and stock photos.
- **The React Community:** For excellent tools and libraries that make development easier.
- **Framer Motion:** For smooth and intuitive animations.

Thanks for reading!