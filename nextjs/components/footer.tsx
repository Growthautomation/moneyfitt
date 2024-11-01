import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-[#2E2C72] text-white py-24">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Social Media Column */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            {/* Logo */}
            <div className="mb-6 flex justify-center md:justify-start w-full">
              <Link href="/">
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714dd2d2d205b0ae28ec205_Full_white%403x.png"
                  alt="MoneyFitt Logo"
                  width={200}
                  height={50}
                  className="w-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                href="https://www.facebook.com/moneyfittsg/"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714d85bfc0f1a701a1579bc_facebook-social-media-icon-brix-templates.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link 
                href="https://x.com/MoneyFitt"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6715e047c5a88b21007539a5_x-2%201%20(1).svg"
                  alt="X"
                  width={24}
                  height={24}
                />
              </Link>
              <Link 
                href="https://www.instagram.com/moneyfittsg/"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714d85bfc0f1a701a1579e3_instagram-social-media-icon-brix-templates.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link 
                href="https://www.linkedin.com/company/moneyfitt"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714d85cfc0f1a701a1579fd_linkedin-social-media-icon-brix-templates.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              </Link>
              <Link 
                href="https://www.youtube.com/@moneyfitt/featured"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714d85cfc0f1a701a157a05_youtube-social-media-icon-brix-templates.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                />
              </Link>
              <Link 
                href="https://www.tiktok.com/@moneyfitt"
                target="_blank"
                className="bg-white p-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6715e046ef80e965075f73b5_tiktok-icon-2%201%20(1).svg"
                  alt="TikTok"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          {/* Menu Column */}
          <div className="text-center md:text-left md:ml-12">
            <h3 className="font-bold text-2xl mb-8">Menu</h3>
            <ul className="space-y-4">
              <li><Link href="https://moneyfitt.co" className="hover:text-[#8583EB]">Home</Link></li>
              <li><Link href="https://moneyfitt.co/advisors" className="hover:text-[#8583EB]">For Professionals</Link></li>
              <li><Link href="https://app.moneyfitt.co/sign-in" className="hover:text-[#8583EB]">Sign In</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-2xl mb-8">Company</h3>
            <ul className="space-y-4">
              <li><Link href="https://moneyfitt.co/about" className="hover:text-[#8583EB]">About</Link></li>
              <li><Link href="mailto:hello@moneyfitt.co" className="hover:text-[#8583EB]">Contact Us</Link></li>
              <li><Link href="https://www.linkedin.com/company/moneyfitt/jobs/" target="_blank" className="hover:text-[#8583EB]">Careers</Link></li>
              <li><Link href="https://moneyfitt.co/terms-and-conditions" className="hover:text-[#8583EB]">Terms and Conditions</Link></li>
              <li><Link href="https://moneyfitt.co/privacy-policy" className="hover:text-[#8583EB]">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-2xl mb-8">Contact us</h3>
            <div className="bg-white rounded-lg p-4 flex items-start space-x-3 mx-auto md:mx-0 inline-flex">
              <Image
                src="https://cdn.prod.website-files.com/6704f4a2c1011ee49a3d8393/6714d85cfc0f1a701a157a0b_icon-brix-template-Email.svg"
                alt="Email"
                width={24}
                height={24}
              />
              <div>
                <p className="text-sm mb-1 text-[#2E2C72]">Email:</p>
                <a 
                  href="mailto:hello@moneyfitt.co"
                  className="text-[#5C59E4] font-bold hover:text-[#2E2C72] transition-colors"
                >
                  hello@moneyfitt.co
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright text - added below the grid */}
        <div className="text-center mt-16 text-sm text-[#D6D5F8]">
          © Copyright ProConnect Technologies Pte Ltd {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}

export default Footer
