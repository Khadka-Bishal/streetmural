import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#0a0b0f]">{children}</div>;
}
