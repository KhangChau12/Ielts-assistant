export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center text-sm text-slate-600 md:text-left">
            <p>&copy; {new Date().getFullYear()} IELTS Assistant. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm text-slate-600">
            <a href="#" className="hover:text-ocean-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-ocean-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-ocean-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
