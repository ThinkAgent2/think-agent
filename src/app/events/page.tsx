'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ExternalLink, Video, Building } from 'lucide-react';
import type { DojoEvent } from '@/types/database';

// Données mock pour les événements
const mockEvents: DojoEvent[] = [
  {
    id: '1',
    titre: 'Dojo Think Agent #1 - Découverte',
    description: 'Premier événement Think Agent ! 10 ateliers en parallèle pour découvrir les challenges Explorer et Crafter. Parfait pour débuter ton parcours IA.',
    date_debut: '2025-02-15T09:00:00Z',
    date_fin: '2025-02-15T11:30:00Z',
    format: 'En_Ligne',
    lien_360learning: 'https://360learning.com/exalt/dojo-1',
    organisateur_id: 'org-1',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    titre: 'Dojo Think Agent #2 - Crafter Session',
    description: 'Session intensive sur les challenges Crafter. Crée ton premier assistant métier avec l\'accompagnement des mentors eXalt.',
    date_debut: '2025-02-28T14:00:00Z',
    date_fin: '2025-02-28T16:30:00Z',
    format: 'En_Ligne',
    lien_360learning: 'https://360learning.com/exalt/dojo-2',
    organisateur_id: 'org-1',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    titre: 'Dojo Think Agent #3 - Présentiel Paris',
    description: 'Événement spécial en présentiel dans les locaux eXalt Paris. Networking, ateliers pratiques et keynote sur l\'avenir du travail avec l\'IA.',
    date_debut: '2025-03-15T09:00:00Z',
    date_fin: '2025-03-15T12:00:00Z',
    format: 'Présentiel',
    lien_360learning: 'https://360learning.com/exalt/dojo-3',
    organisateur_id: 'org-2',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    titre: 'Dojo Think Agent #4 - Architecte Challenge',
    description: 'Pour les Crafters confirmés : plonge dans les challenges Architecte. Multi-agents, orchestration et systèmes autonomes.',
    date_debut: '2025-03-28T14:00:00Z',
    date_fin: '2025-03-28T17:00:00Z',
    format: 'En_Ligne',
    lien_360learning: 'https://360learning.com/exalt/dojo-4',
    organisateur_id: 'org-1',
    created_at: new Date().toISOString(),
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
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

function EventCard({ event }: { event: DojoEvent }) {
  const status = getEventStatus(event);
  const isPast = status === 'past';
  const isOngoing = status === 'ongoing';

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:glow-cyan ${isPast ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {event.format === 'En_Ligne' ? (
              <Badge variant="outline" className="border-accent-cyan text-accent-cyan">
                <Video className="h-3 w-3 mr-1" />
                En ligne
              </Badge>
            ) : (
              <Badge variant="outline" className="border-accent-jaune text-accent-jaune">
                <Building className="h-3 w-3 mr-1" />
                Présentiel
              </Badge>
            )}
            {isOngoing && (
              <Badge className="bg-accent-vert text-black animate-pulse">
                En cours
              </Badge>
            )}
            {isPast && (
              <Badge variant="secondary">
                Terminé
              </Badge>
            )}
          </div>
        </div>
        
        <CardTitle className="text-xl mt-2">{event.titre}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-exalt-blue" />
            <span className="capitalize">{formatDate(event.date_debut)}</span>
          </div>

          {/* Horaire */}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-accent-cyan" />
            <span>
              {formatTime(event.date_debut)} - {formatTime(event.date_fin)}
            </span>
          </div>

          {/* Capacité (info statique pour le mock) */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max 10 personnes par atelier • Jusqu&apos;à 200 participants</span>
          </div>

          {/* Lieu si présentiel */}
          {event.format === 'Présentiel' && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Locaux eXalt Paris</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {!isPast ? (
          <a href={event.lien_360learning} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-accent-jaune hover:bg-accent-jaune/80 text-black font-semibold">
              S&apos;inscrire sur 360 Learning
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>
        ) : (
          <Button disabled variant="outline" className="w-full">
            Événement terminé
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  // Trier les événements : à venir d'abord, puis passés
  const sortedEvents = [...mockEvents].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    
    // Ongoing first, then upcoming, then past
    const order = { ongoing: 0, upcoming: 1, past: 2 };
    if (order[statusA] !== order[statusB]) {
      return order[statusA] - order[statusB];
    }
    
    // Within same status, sort by date
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Événements Dojo</h1>
            <p className="text-muted-foreground">
              Ateliers pratiques pour progresser ensemble. Inscription via 360 Learning.
            </p>
          </div>

          {/* Format info */}
          <Card className="mb-8 border-exalt-blue/30 bg-exalt-blue/5">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-exalt-blue" />
                  <span><strong>Format :</strong> 2h30 (2 créneaux d&apos;1h)</span>
                </div>
                <div className="hidden md:block h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-exalt-blue" />
                  <span><strong>10 ateliers</strong> en parallèle</span>
                </div>
                <div className="hidden md:block h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span>🎯 <strong>Tronc commun</strong> : 7 ateliers à chaque événement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-accent-vert" />
                Prochains événements
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Past events */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-muted-foreground" />
                Événements passés
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {sortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Aucun événement prévu pour le moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Reviens bientôt pour découvrir les prochains Dojos !
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
