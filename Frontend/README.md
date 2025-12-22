# 🔗 Encly

**Encly** is a sleek, secure link shortener with built-in password protection and encryption. Cut down your URLs, share them anywhere, and keep them safe — all in one modern app.

## ✨ Features

- **🔒 Secure Link Shortening** - Create short, memorable URLs for your long links
- **🛡️ Password Protection** - Add an extra layer of security with password-protected links
- **🔐 Encryption** - Keep your links safe with built-in encryption
- **📊 Dashboard** - Manage all your shortened links in one place
- **📈 Analytics** - Track link performance and engagement (coming soon)
- **📱 Responsive Design** - Works seamlessly across all devices
- **🎨 Modern UI** - Clean, intuitive interface built with React and Tailwind CSS
- **🔄 QR Code Generation** - Generate QR codes for your shortened links

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React QR Code** - QR code generation

### Backend & Services
- **Firebase** - Authentication and real-time database
- **Supabase** - Alternative backend as a service
- **Appwrite** - Backend server for web and mobile apps
- **Express** - Server framework (if applicable)

### UI Components
- **Radix UI Components** - Accordion, Avatar, Dropdown Menu, Label
- **Sonner** - Toast notifications
- **Next Themes** - Dark mode support
- **Class Variance Authority** - Component variants

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanishenigma/encly.git
   cd encly/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the Frontend directory and add your configuration:
   ```env
   # Add your Firebase, Supabase, or Appwrite credentials here
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # Add other necessary environment variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Usage

1. **Sign Up / Login** - Create an account or log in to get started
2. **Create Short Links** - Enter your long URL and generate a short link
3. **Add Security** - Optionally add password protection to your links
4. **Manage Links** - View and manage all your links from the dashboard
5. **Share** - Copy your short link or download the QR code to share

## 🗂️ Project Structure

```
Frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Link.jsx
│   │   ├── LinkPage.jsx
│   │   ├── Login.jsx
│   │   ├── Redirect.jsx
│   │   ├── ResetPassword.jsx
│   │   └── SignUp.jsx
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

## 🛠️ Development

- **Linting**: Run `npm run lint` to check code quality
- **Type Checking**: TypeScript types included for better DX

## 🔐 Security Features

- **Password Protection** - Secure your links with custom passwords
- **Encryption** - All sensitive data is encrypted
- **Protected Routes** - Authentication required for dashboard access
- **Secure Authentication** - Firebase/Supabase authentication

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Tanish Enigma**
- GitHub: [@tanishenigma](https://github.com/tanishenigma)

## 🙏 Acknowledgments

- Built with ❤️ using React and modern web technologies
- UI components powered by Radix UI
- Icons by Lucide

---

**Made with 🔗 by Tanish Enigma**
