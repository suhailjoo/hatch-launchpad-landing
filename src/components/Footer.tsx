
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Logo variant="long" className="text-2xl mb-4" />
            <p className="text-gray-600 mb-4">
              AI-powered hiring management platform that transforms how companies find and hire talent.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-hatch-coral">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-hatch-coral">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Integrations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Product Updates</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Community</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-hatch-coral">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Hatch. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-hatch-coral">Terms</a>
              <a href="#" className="text-gray-500 hover:text-hatch-coral">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-hatch-coral">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
