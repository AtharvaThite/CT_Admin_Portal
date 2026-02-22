import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { getUserById } from "@/lib/queries/users";
import { getBookingsByUserId } from "@/lib/queries/bookings";
import { formatDate } from "@/lib/utils";
import { UserActions } from "./user-actions";

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const [user, bookings] = await Promise.all([
    getUserById(userId),
    getBookingsByUserId(userId),
  ]);

  if (!user) return notFound();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
        </div>
        <UserActions userId={userId} isActive={!user.isDisabled} />
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="health">Health Info</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={Phone} label="Phone" value={user.phone} />
                <InfoRow icon={Calendar} label="Date of Birth" value={user.dateOfBirth ? formatDate(user.dateOfBirth) : '—'} />
                <InfoRow icon={Shield} label="Gender" value={user.gender || '—'} />
                <InfoRow icon={Shield} label="Pronouns" value={user.pronouns || '—'} />
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <StatusBadge status={user.profileType} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StatusBadge status={user.onboardingCompleted ? 'active' : 'inactive'} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Address & Emergency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={MapPin} label="Address" value={[user.address, user.city, user.state, user.zipCode].filter(Boolean).join(', ') || '—'} />
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium mb-2">Emergency Contact</p>
                  <p className="text-sm">{user.emergencyContactName || '—'}</p>
                  <p className="text-sm text-muted-foreground">{user.emergencyContactPhone}</p>
                  <p className="text-sm text-muted-foreground">{user.emergencyContactRelationship}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">Therapy Type:</span> {user.preferredTherapyType || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Session Format:</span> {user.sessionFormat || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Time Preference:</span> {user.timePreference || '—'}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {user.acceptedTerms && <Badge variant="secondary">Terms Accepted</Badge>}
                  {user.notificationsEnabled && <Badge variant="secondary">Notifications</Badge>}
                  {user.smsNotifications && <Badge variant="secondary">SMS</Badge>}
                  {user.emailNotifications && <Badge variant="secondary">Email</Badge>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">User ID:</span> <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{user.userId}</code></p>
                <p className="text-sm"><span className="text-muted-foreground">Created:</span> {formatDate(user.createdAt)}</p>
                <p className="text-sm"><span className="text-muted-foreground">Updated:</span> {formatDate(user.updatedAt)}</p>
                <p className="text-sm"><span className="text-muted-foreground">Onboarding:</span> {user.onboardingCompleted ? 'Completed' : 'Incomplete'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health History</CardTitle>
              </CardHeader>
              <CardContent>
                {user.healthHistory ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Current Conditions</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.healthHistory.currentConditions.length > 0 ? user.healthHistory.currentConditions.map((c) => <Badge key={c} variant="outline">{c}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Past Conditions</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.healthHistory.pastConditions.length > 0 ? user.healthHistory.pastConditions.map((c) => <Badge key={c} variant="outline">{c}</Badge>) : <span className="text-sm text-muted-foreground">None</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No health history recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Medications ({user.medications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {user.medications.length > 0 ? (
                  <div className="space-y-3">
                    {user.medications.map((med, i) => (
                      <div key={i} className="border rounded-lg p-3">
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} — {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medications recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Allergies ({user.allergies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {user.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {user.allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <p className="font-medium text-sm">{allergy.name}</p>
                          <p className="text-xs text-muted-foreground">{allergy.reaction}</p>
                        </div>
                        <StatusBadge status={allergy.severity} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No allergies recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardContent className="pt-6">
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <Link key={booking.id} href={`/bookings/${booking.id}`} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{booking.therapistName}</p>
                        <p className="text-xs text-muted-foreground">{booking.sessionType} — {formatDate(booking.date)} at {booking.timeSlot}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No bookings found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value || '—'}</p>
      </div>
    </div>
  );
}
