export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center text-sm text-slate-600 md:text-left">
            <p>&copy; {new Date().getFullYear()} IELTS Assistant. All rights reserved.</p>
          </div>
          <div className="text-sm text-slate-600">
            <p>
              Contact{' '}
              <a href="mailto:phuckhangtdn@gmail.com" className="text-ocean-600 hover:text-ocean-700 transition-colors">
                phuckhangtdn@gmail.com
              </a>
              {' '}if you need further discussion
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
