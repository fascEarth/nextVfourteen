import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import resumeData from '../app/lib/resumeData.json';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 bg-gray-800 text-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src="/fascearth2.png" alt="Acme Logo" className="rounded-xl" width={40} height={40} />
              <span className="text-xl font-bold">Fascinating Earth</span>
            </div>
          </Link>
          {/* Login Button */}
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* About Me Section */}
        <section id="about" className="bg-light py-5">
          <div className="container text-center">
            <Image src="/rajkumar.jpg" alt={resumeData.name} width={150} height={150} className="rounded-full mx-auto mb-3" />
            <h1 className="text-3xl font-bold">{resumeData.name}</h1>
            <p className="text-lg font-medium">{resumeData.title}</p>
            <p className="text-lg text-gray-700 mt-4">{resumeData.about}</p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                  <Image src={`/skills/${skill.image}`} alt={skill.name} width={30} height={30} className="mb-4 rounded-lg" />
                  <h3 className="text-xl font-bold">{skill.name}</h3>
                  <p className="text-gray-600">{skill.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-8 bg-gray-100">
          <div className="container">
            <h2 className="text-2xl font-bold mb-4">Experience Roadmap</h2>
            {resumeData.experiences.map((experience, index) => (
              <div key={index} className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                  <div className="md:w-1/4 text-center md:text-left mb-4 md:mb-0">
                    <div className="text-gray-600">{experience.start_date} - {experience.end_date}</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold mb-2">{experience.position}</h3>
                    <p className="text-lg text-gray-700 mb-2">{experience.company} - {experience.location}</p>
                    <p className="text-lg text-gray-700">{experience.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                  <Image src={`/projects/${project.image}`} alt={project.name} width={300} height={200} className="mb-4 rounded-lg" />
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <Link href={project.url} target="_blank" className="block text-blue-500 font-semibold hover:underline">Visit Project</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Fascinating Earth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
