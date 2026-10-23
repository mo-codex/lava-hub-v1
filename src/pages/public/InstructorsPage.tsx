import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Github, Linkedin, Twitter, ArrowRight, Award } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Instructor, Workshop } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';

export function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    setInstructors(db.getInstructors());
    setWorkshops(db.getWorkshops());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5" />
          <span>Industry Mentors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Meet Our Instructors
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Experienced Somali tech leaders and diaspora engineers volunteering their time and expertise to mentor the next generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((inst) => {
          const assignedWorkshops = workshops.filter((w) => w.instructorIds?.includes(inst.id));

          return (
            <Card
              key={inst.id}
              className="flex flex-col justify-between overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="h-56 -mx-6 -mt-6 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={inst.photoUrl}
                    alt={inst.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-orange-600 font-medium">{inst.role}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {inst.bio}
                </p>

                {/* Expertise */}
                <div className="flex flex-wrap gap-1">
                  {inst.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{assignedWorkshops.length} workshops</span>
                <Link
                  to={`/instructors/${inst.slug}`}
                  className="font-semibold text-slate-900 dark:text-white hover:text-orange-600 inline-flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function InstructorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    if (!slug) return;
    const inst = db.getInstructorBySlug(slug);
    if (inst) {
      setInstructor(inst);
      const allWs = db.getPublishedWorkshops();
      setWorkshops(allWs.filter((w) => w.instructorIds?.includes(inst.id)));
    }
  }, [slug]);

  if (!instructor) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500">Instructor not found.</p>
        <Link to="/instructors" className="text-xs font-semibold text-orange-600">
          Back to Instructors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <Link
        to="/instructors"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        ← Back to Instructors
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <img
          src={instructor.photoUrl}
          alt={instructor.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-700 shrink-0"
        />
        <div className="space-y-4 flex-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {instructor.name}
            </h1>
            <p className="text-sm font-semibold text-orange-600 mt-1">{instructor.role}</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {instructor.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {instructor.expertise.map((exp) => (
              <span
                key={exp}
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Assigned Workshops */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Workshops Led by {instructor.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workshops.map((ws) => (
            <Card key={ws.id} className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-semibold">{ws.category}</p>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ws.title}</h3>
              </div>
              <Link
                to={`/workshops/${ws.slug}`}
                className="text-xs font-semibold text-slate-900 dark:text-white hover:text-orange-600 shrink-0"
              >
                View →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
