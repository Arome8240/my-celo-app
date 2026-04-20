import { Button } from "@/components/ui/button";
import { UserBalance } from "@/components/user-balance";
import { MiniPayConnectButton } from "@/components/minipay-connect-button";
import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarClock,
  HeartPulse,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <HeartPulse className="h-4 w-4" />
              Built for secure multi-hospital care networks
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Modern Health Management for
              <span className="text-primary"> Multi-Hospital Systems</span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Coordinate patient records, appointments, pharmacy workflows, billing, and
              inter-facility referrals across every hospital in your network from one secure
              platform.
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MiniPayConnectButton className="min-w-[210px]" />
              <Button size="lg" variant="outline" className="px-8 py-3 text-base font-medium">
                Request Enterprise Demo
              </Button>
            </div>

            <UserBalance />
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          <article className="rounded-xl border bg-card p-6">
            <Building2 className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Network-wide command center</h3>
            <p className="text-sm text-muted-foreground">
              Standardize care protocols, staff permissions, and operational KPIs across all
              hospitals from one executive dashboard.
            </p>
          </article>

          <article className="rounded-xl border bg-card p-6">
            <Activity className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Real-time clinical workflows</h3>
            <p className="text-sm text-muted-foreground">
              Track triage events, medication administration, and discharge status instantly with
              role-based alerts and escalations.
            </p>
          </article>

          <article className="rounded-xl border bg-card p-6">
            <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Compliant secure payments</h3>
            <p className="text-sm text-muted-foreground">
              Use MiniPay to collect patient co-pays and service fees with tamper-resistant
              transaction trails for finance teams.
            </p>
          </article>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 rounded-2xl border bg-card p-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl bg-background/70 p-5">
              <CalendarClock className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Unified Appointments</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Book, route, and reschedule patients across facilities with shared specialist
                availability.
              </p>
            </article>
            <article className="rounded-xl bg-background/70 p-5">
              <BadgeCheck className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Regulatory Ready</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enforce policy-based access and audit-ready logs to support strict healthcare
                compliance.
              </p>
            </article>
            <article className="rounded-xl bg-background/70 p-5">
              <Wallet className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Faster Settlements</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reduce payment delays with transparent blockchain settlement and real-time status
                visibility.
              </p>
            </article>
            <article className="rounded-xl bg-background/70 p-5">
              <HeartPulse className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Better Patient Outcomes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Turn network data into preventive care insights with longitudinal patient tracking.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
