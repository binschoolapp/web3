// pages/_app.js or pages/_app.tsx
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';

 function App({ Component, pageProps }) {
  return <Component {...pageProps} />
 }
 
 export default App;