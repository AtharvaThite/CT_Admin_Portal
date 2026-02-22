import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, Mail, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { getTherapistById } from "@/lib/queries/therapists";
import { getBookingsByTherapistId } from "@/lib/queries/bookings";
import { formatDate, getInitials, formatCurrencyRupees } from "@/lib/utils";
import { TherapistActions } from "./therapist-actions";

export default async function TherapistDetailPage({ params }: { params: Promise<{ therapistId: string }> }) {
  const { therapistId } = await params;
  const [therapist, bookings] = await Promise.all([
    getTherapistById(therapistId),
    getBookingsByTherapistId(therapistId),
  ]);

  if (!therapist) return notFound();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/therapists">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Therapists
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={therapist.avatar} alt={therapist.name} />
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">{getInitials(therapist.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{therapist.name}</h1>
              <StatusBadge status={therapist.verified ? "verified" : "unverified"} />
            </div>
            <p className="text-muted-foreground text-sm">{therapist.specializations.join(", ")}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{therapist.ratings.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({therapist.reviewsCount} reviews)</span>
              <span className="text-sm text-muted-foreground mx-1">·</span>
              <span className="text-sm text-muted-foreground">{therapist.experience} years exp</span>
            </div>
          </div>
        </div>
        <TherapistActions therapistId={therapistId} verified={therapist.verified} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({therapist.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{therapist.email}</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{therapist.phone}</span></div>
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{therapist.location.clinicName}, {therapist.location.city}, {therapist.location.state}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Bio</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{therapist.bio || '—'}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">Individual Session:</span> {formatCurrencyRupees(therapist.individualSessionFee)}</p>
                <p className="text-sm"><span className="text-muted-foreground">Group Session:</span> {formatCurrencyRupees(therapist.groupSessionFee)}</p>
                <p className="text-sm"><span className="text-muted-foreground">Sliding Scale:</span> {therapist.offersSlidingScale ? 'Yes' : 'No'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Specializations & Modalities</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1">{therapist.specializations.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conditions Treated</p>
                  <div className="flex flex-wrap gap-1">{therapist.conditions.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credentials">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Education</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">Highest Qualification:</span> {therapist.highestQualification}</p>
                <p className="text-sm"><span className="text-muted-foreground">Field of Study:</span> {therapist.fieldOfStudy}</p>
                <p className="text-sm"><span className="text-muted-foreground">Institution:</span> {therapist.institution}</p>
                <p className="text-sm"><span className="text-muted-foreground">Graduation Year:</span> {therapist.graduationYear}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Registration & License</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">HCPC ID:</span> {therapist.hcpcId || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Registration #:</span> {therapist.registrationNumber}</p>
                <p className="text-sm"><span className="text-muted-foreground">License Expiry:</span> {therapist.licenseExpiryDate || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Insurance Provider:</span> {therapist.insuranceProvider || '—'}</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base">Qualifications & Certifications</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Qualifications</p>
                  <div className="flex flex-wrap gap-2">{therapist.qualifications.map((q) => <div key={q.name} className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-teal-600" /><span className="text-sm">{q.name}</span></div>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                  <div className="flex flex-wrap gap-1">{therapist.certifications.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader><CardTitle className="text-base">Weekly Schedule</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm mb-3"><span className="text-muted-foreground">Working Hours:</span> {therapist.workingHours || '—'}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(therapist.weeklySchedule.schedule).map(([day, slots]) => (
                  <div key={day} className="border rounded-lg p-3">
                    <p className="font-medium text-sm mb-2">{day}</p>
                    {slots.map((slot, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        {slot.time} — {slot.durationMinutes}min ({slot.mode})
                      </div>
                    ))}
                  </div>
                ))}
                {Object.keys(therapist.weeklySchedule.schedule).length === 0 && (
                  <p className="text-sm text-muted-foreground">No schedule configured</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="pt-6">
              {therapist.reviews.length > 0 ? (
                <div className="space-y-4">
                  {therapist.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.reviewerName}</span>
                          {review.isVerified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
