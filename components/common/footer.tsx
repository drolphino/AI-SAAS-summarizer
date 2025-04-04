import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <h2 className="text-xl font-semibold">Chota AI</h2>
            <p className="text-gray-400 mt-2">
              AI-powered PDF summarization. Save hours of reading time with accurate summaries.
            </p>
          </div>

         

          {/* Social & Legal */}
          <div>
            <h3 className="text-lg font-medium">Connect with Us</h3>
            <div className="flex space-x-4 mt-2">
              <Link href="https://www.linkedin.com/in/karan-kant-yadav-a81466183/" target="_blank" className="hover:text-gray-300">
                LinkedIn
              </Link>
              <Link href="https://github.com/drolphino/chota-ai" target="_blank" className="hover:text-gray-300">
                GitHub
              </Link>
            </div>
            <div className="mt-4">
              <span  className="text-gray-400 hover:text-white">Terms of Service</span> ·{" "}
              <span className="text-gray-400 hover:text-white">Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Chota AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
