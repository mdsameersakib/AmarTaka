import { ExternalLink, Github, Linkedin, Mail, User } from "lucide-react";

export function DeveloperCredits() {
  return (
    <section className="rounded-[32px] border-4 border-[#0f172a] bg-white p-6 shadow-neo">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#0f172a]/60">
            <User className="h-4 w-4" />
            <span>Developer</span>
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">
            Built by Sameer Sakib
          </h2>
          <p className="text-sm text-[#0f172a]/70">
            Creator of Amar Taka. Feel free to connect or reach out!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:mdsameersakib@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#fefce8] px-4 py-2.5 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4 text-[#ea580c]" />
            <span>Email</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <a
            href="https://github.com/mdsameersakib"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2.5 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <a
            href="https://linkedin.com/in/mdsameersakib"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo inline-flex items-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#e0f2fe] px-4 py-2.5 text-xs font-black uppercase text-[#0f172a] shadow-neo-sm transition hover:-translate-y-0.5"
          >
            <Linkedin className="h-4 w-4 text-[#0284c7]" />
            <span>LinkedIn</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </section>
  );
}
