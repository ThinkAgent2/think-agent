'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ExternalLink, Video, Building, Loader2, Plus, Pencil } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { getDojoEvents } from '@/lib/supabase/queries';
import { DojoEventForm } from '@/components/events/DojoEventForm';
import type { DojoEvent } from '@/types/database';

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getEventStatus(event: DojoEvent): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const start = new Date(event.date_debut);
  const end = new Date(event.date_fin);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

function formatDuration(dateDebut: string, dateFin: string): string {
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min`;
  }
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins.toString().padStart(2, '0')}`;
}

function EventCard({ event, isAdmin, onEdit, locale }: { event: DojoEvent; isAdmin: boolean; onEdit: () => void; locale: string }) {
  const status = getEventStatus(event);
  const isPast = status === 'past';
  const isOngoing = status === 'ongoing';
  const t = useTranslations('events.card');

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:glow-cyan ${isPast ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {event.format === 'En_Ligne' ? (
              <Badge variant="outline" className="border-accent-cyan text-accent-cyan">
                <Video className="h-3 w-3 mr-1" />
                {t('online')}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-accent-jaune text-accent-jaune">
                <Building className="h-3 w-3 mr-1" />
                {t('inPerson')}
              </Badge>
            )}
            {isOngoing && (
              <Badge className="bg-accent-vert text-black animate-pulse">
                {t('ongoing')}
              </Badge>
            )}
            {isPast && (
              <Badge variant="secondary">
                {t('finished')}
              </Badge>
            )}
          </div>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-accent-cyan hover:bg-accent-cyan/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <CardTitle className="text-xl mt-2">{event.titre}</CardTitle>
        {event.marques && event.marques.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.marques.map((marque) => (
              <Badge key={marque} variant="outline" className="text-xs">
                {marque}
              </Badge>
            ))}
          </div>
        )}
        <CardDescription className="text-muted-foreground mt-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-exalt-blue" />
            <span className="capitalize">{formatDate(event.date_debut, locale)}</span>
          </div>

          {/* Horaire + Durée */}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-accent-cyan" />
            <span>
              {formatTime(event.date_debut, locale)} - {formatTime(event.date_fin, locale)} ({formatDuration(event.date_debut, event.date_fin)})
            </span>
          </div>

          {/* Capacité */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{t('participantsMax', { count: event.capacite })}</span>
          </div>

          {/* Lieu si présentiel */}
          {event.format === 'Présentiel' && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{t('location')}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {!isPast ? (
          event.lien_360learning ? (
            <a href={event.lien_360learning} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold">
                {t('registerOn360')}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          ) : (
            <Button disabled variant="outline" className="w-full">
              {t('linkComingSoon')}
            </Button>
          )
        ) : (
          <Button disabled variant="outline" className="w-full">
            {t('eventFinished')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<DojoEvent | null>(null);

  const isAdmin = user?.role === 'Administrateur';
  const t = useTranslations('events');

  useEffect(() => {
    let isCancelled = false;

    async function loadEvents() {
      setIsLoading(true);
      try {
        const data = await getDojoEvents(locale);
        if (!isCancelled) {
          setEvents(data);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      isCancelled = true;
    };
  }, [locale]);

  // Trier les événements : à venir d'abord, puis passés
  const sortedEvents = [...events].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    
    const order = { ongoing: 0, upcoming: 1, past: 2 };
    if (order[statusA] !== order[statusB]) {
      return order[statusA] - order[statusB];
    }
    
    return new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime();
  });

  const upcomingEvents = sortedEvents.filter(e => getEventStatus(e) !== 'past');
  const pastEvents = sortedEvents.filter(e => getEventStatus(e) === 'past');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
            {isAdmin && (
              <Link href="/events/new">
                <Button className="bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newEvent')}
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-exalt-blue" />
            </div>
          ) : (
            <>
              {/* Upcoming events */}
              {upcomingEvents.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent-vert" />
                    {t('upcoming')}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        isAdmin={isAdmin}
                        onEdit={() => setEditingEvent(event)}
                        locale={locale}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Past events */}
              {pastEvents.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-muted-foreground">
                    <span className="h-3 w-3 rounded-full bg-muted-foreground" />
                    {t('past')}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {pastEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        isAdmin={isAdmin}
                        onEdit={() => setEditingEvent(event)}
                        locale={locale}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {events.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {t('empty.title')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('empty.subtitle')}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Modal d'édition */}
          {editingEvent && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">{t('editEvent')}</h2>
                <DojoEventForm
                  event={editingEvent}
                  onSuccess={(updated) => {
                    setEvents(events.map(e => e.id === updated.id ? updated : e));
                    setEditingEvent(null);
                  }}
                  onCancel={() => setEditingEvent(null)}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
