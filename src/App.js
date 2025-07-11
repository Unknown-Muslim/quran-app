// App.js
import React, { useEffect } from 'react';

// Main App component
function App() {
  // useEffect hook runs after the component mounts
  useEffect(() => {
    // IMPORTANT NOTE FOR VERCEL INSIGHTS:
    // Vercel Insights (and Speed Insights) scripts are typically NOT added directly
    // within React components like App.js.
    // They are global scripts that need to be present very early in the page load.
    //
    // The correct and recommended way to include Vercel Insights in a React app
    // (especially if it's not a Next.js app where Vercel injects it automatically)
    // is to add the script tag directly to your `public/index.html` file.

    // You should add the following line inside the <head> section of your
    // `public/index.html` file:
    //
    // <script src="/_vercel/insights/script.js" defer></script>
    //
    // If you are using Speed Insights, it might be this one instead:
    // <script src="/_vercel/speed-insights/script.js" defer></script>
    //
    // Vercel will then serve this script from its special endpoint.
    //
    // Do NOT try to dynamically create and append this script tag here in React,
    // as it might not capture all page views or load correctly.
    // The script needs to be part of the initial HTML response.

    console.log("App component mounted. Remember to add Vercel Insights script to public/index.html!");
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      {/* Main container for the app content */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {/* Title of the application */}
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          Welcome to Your React App!
        </h1>
        {/* Description */}
        <p className="text-lg text-gray-700 mb-6">
          This is a simple React application.
        </p>
        {/* Instructions for Vercel Insights */}
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-6" role="alert">
          <p className="font-semibold mb-2">Vercel Insights Setup:</p>
          <p className="text-sm">
            To enable Vercel Insights, please add the following line to the
            <code className="bg-gray-200 px-1 rounded mx-1">{'<head>'}</code>
            section of your
            <code className="bg-gray-200 px-1 rounded mx-1">public/index.html</code>
            file:
          </p>
          <pre className="bg-gray-800 text-white text-left p-3 rounded-md mt-3 overflow-x-auto">
            <code>
              &lt;script src="/_vercel/insights/script.js" defer&gt;&lt;/script&gt;
            </code>
          </pre>
          <p className="text-sm mt-3">
            After adding it, commit and deploy your changes to Vercel.
            Visits to your live site will then appear in your Vercel dashboard.
          </p>
        </div>
        {/* Call to action button */}
        <button
          onClick={() => alert('Button Clicked!')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Click Me!
        </button>
      </div>
    </div>
  );
}

// Export the App component as the default export
export default App;
sssss