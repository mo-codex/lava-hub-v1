import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, Clock, ArrowRight, Sparkles, XCircle } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, WorkshopCategory } from '../../types/index.ts';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';
import { useT } from '../../i18n/LanguageContext.tsx';
import { Card } from '../../components/ui/Card.tsx';

export function WorkshopsPage() {
  const { t, language } = useT();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refresh = () => setWorkshops(db.getPublicWorkshops());
    refresh();
    return db.subscribe(refresh);
  }, []);

  const categories = ['All', 'Web Development', 'JavaScript', 'React', 'AI'];

  const filteredWorkshops = workshops.filter((ws) => {
    const matchesCategory = selectedCategory === 'All' || ws.category === selectedCategory;
    const matchesSearch =
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          {language === 'so' ? 'Aqoon-is-weydaarsiyada Furan' : 'Explore Free Workshops'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'so'
            ? 'Dhammaan aqoon-is-weydaarsiyada waa 100% bilaash. Ka faa’iideyso kalfadhiyo toos ah oo wax ku ool ah oo ay hogaaminayaan khubaro khibrad leh.'
            : 'All workshops are 100% free and open to youth in Somalia, Somaliland, and the diaspora. Practical, live, and project-focused.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
        {/* Category Tabs (Segmented Button Control) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl overflow-x-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Workshop Grid */}
      {filteredWorkshops.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No workshops found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-semibold text-orange-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((ws) => {
            const remainingSeats = calculateRemainingSeats(ws.capacity, ws.confirmedCount);
            const isFull = remainingSeats === 0;
            const isCancelled = ws.status === 'cancelled';

            return (
              <Card
                key={ws.id}
                className={`flex flex-col justify-between overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all ${
                  isCancelled ? 'opacity-85 border-red-200 dark:border-red-900/40' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Workshop Cover Image */}
                  <div className="relative h-44 -mx-6 -mt-6 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={ws.coverImage}
                      alt={ws.title}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        isCancelled ? 'grayscale-50' : ''
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                      <span>{ws.category}</span>
                      {isCancelled ? (
                        <span className="font-mono text-[11px] bg-red-600 px-2 py-0.5 rounded font-bold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="font-mono tabular-nums bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatMogadishuTime(ws.startTime, { format: 'short', includeTime: false })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {formatMogadishuTime(ws.startTime, { format: 'timeOnly' })}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-orange-600 transition-colors font-display line-clamp-2">
                      {ws.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {ws.summary}
                    </p>
                  </div>
                </div>

                {/* Footer with Seat Status & Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    {isCancelled ? (
                      <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cohort Cancelled</span>
                      </span>
                    ) : isFull ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Waitlist Open ({ws.waitlistCount} waiting)</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {remainingSeats}
                        </span>{' '}
                        {t('common.seatsLeft')}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/workshops/${ws.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
