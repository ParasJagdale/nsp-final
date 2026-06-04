import digitalIndia from '../assets/digital_india.jpg';
import educationMinistry from '../assets/EducationMinistryLogo.png';
import goiLogo from '../assets/Government_of_India_logo.png';
import nsdcLogo from '../assets/NSDCLogo.png';

export default function LogoBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 px-4">
        <span className="text-lg text-gray-600 font-bold tracking-wide mb-2">Supported by</span>
        <div className="flex flex-wrap justify-center items-center gap-10">
          <img src={goiLogo} alt="Government of India" className="h-14 object-contain" />
          <img src={educationMinistry} alt="Ministry of Education" className="h-14 object-contain" />
          <img src={digitalIndia} alt="Digital India" className="h-14 object-contain" />
          <img src={nsdcLogo} alt="NSDC" className="h-14 object-contain" />
        </div>
      </div>
    </div>
  );
}
